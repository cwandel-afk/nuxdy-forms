import { z, ZodTypeAny } from "zod";
import { FormField } from "../types";
import { ref, computed } from "vue";

export const useFieldHelpers = (
  fields: FormField[],
  isList: boolean = false,
  isGroup: boolean = false
) => {
  const fieldWidth = (field: FormField) => {
    switch (field.width) {
      case "full":
        return "nuxdy-ui-form-full-width";
      case "half":
        return "nuxdy-ui-form-half-width";
      case "fit":
        return "nuxdy-ui-form-fit-width";
      case "auto":
        return "nuxdy-ui-form-auto-width";
      default:
        return "";
    }
  };

  const initFieldState = (
    fields: FormField[],
    initialState?: Record<string, any>,
    isGroup: boolean = false,
    isList: boolean = false
  ) => {
    const initialValues: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      } else if (field.type === "text") {
        initialValues[field.id] = "";
      } else if (field.type === "number") {
        initialValues[field.id] = 0;
      } else if (field.type === "checkbox") {
        initialValues[field.id] = false;
      } else if (field.type === "list") {
        if (!isList) {
          initialValues[field.id] = [];
        }
        if (isList) {
          console.warn("Nested list not supported");
        }
      } else if (field.type === "group" && field.fields) {
        if (!isGroup) {
          field.fields.forEach((subField) => {
            if (subField.defaultValue !== undefined) {
              initialValues[subField.id] = subField.defaultValue;
            }
          });
        }
        if (isGroup) {
          console.warn("Nested group not supported");
        }
      } else if (field.type === "checkbox-group") {
        initialValues[field.id] = [];
      } else {
        initialValues[field.id] = "";
      }
    });

    if (initialState) {
      Object.assign(initialValues, initialState);
    }

    return initialValues;
  };

  const shouldShowField = (field: FormField, state: Record<string, any>) => {
    if (field.conditions) {
      return field.conditions.every((condition) => {
        const fieldValue = state[condition.field];
        switch (condition.operator) {
          case "==":
            return fieldValue === condition.value;
          case "!=":
            return fieldValue !== condition.value;
          case ">":
            return fieldValue > condition.value;
          case "<":
            return fieldValue < condition.value;
          case ">=":
            return fieldValue >= condition.value;
          case "<=":
            return fieldValue <= condition.value;
          case "contains":
            return fieldValue?.includes(condition.value) ?? false;
          case "!contains":
            return !fieldValue?.includes(condition.value);
        }
      });
    }
    return true;
  };

  const generateZodSchema = (fields: FormField[]) => {
    const shape: Record<string, ZodTypeAny> = {};

    for (const field of fields) {
      let schema: ZodTypeAny | undefined;

      console.log("Creating Schema for", field);
      switch (field.type) {
        case "text":
          schema = z.string();

          if (field.required === true)
            schema = z.string().nonempty({ message: field.error });
          if (field.min !== undefined)
            schema = z.string().min(field.min, { message: field.error });
          if (field.max !== undefined)
            schema = z.string().max(field.max, { message: field.error });
          if (field.min !== undefined && field.max !== undefined)
            schema = z
              .string()
              .min(field.min, { message: field.error })
              .max(field.max, { message: field.error });
          break;

        case "email":
          schema = z.string().email();

          if (field.required === true)
            schema = z.string().email().min(1, { message: field.error });
          if (field.min !== undefined)
            schema = z
              .string()
              .email()
              .min(field.min, { message: field.error });
          if (field.max !== undefined)
            schema = z
              .string()
              .email()
              .max(field.max, { message: field.error });
          if (field.min !== undefined && field.max !== undefined)
            schema = z
              .string()
              .email()
              .min(field.min, { message: field.error })
              .max(field.max, { message: field.error });
          break;

        case "number":
          schema = z.number();
          if (field.required === true)
            schema = z.coerce.number().min(0, { message: field.error });
          if (field.min !== undefined)
            schema = z.coerce.number().min(field.min, { message: field.error });
          if (field.max !== undefined)
            schema = z.coerce.number().max(field.max, { message: field.error });
          if (field.min !== undefined && field.max !== undefined)
            schema = z.coerce
              .number()
              .min(field.min, { message: field.error })
              .max(field.max, { message: field.error });
          break;

        case "textarea":
          schema = z.string();
          if (field.required === true)
            schema = z.string().min(1, { message: field.error });
          break;

        case "checkbox":
          schema = z.boolean();
          break;

        case "select":
          schema = z.string();
          if (field.required === true)
            schema = z.string().min(1, { message: field.error });

          break;

        case "radio":
          schema = z.string();
          if (field.required === true)
            schema = z.string().min(1, {
              message: field.error,
            });
          break;

        case "checkbox-group":
          schema = z.array(
            z.object({
              value: z.string(),
              label: z.string(),
            })
          );
          if (field.required === true)
            schema = z
              .array(
                z.object({
                  value: z.string(),
                  label: z.string(),
                })
              )
              .nonempty({
                message: field.error,
              });
          break;

        case "list":
          // const listObjSchema = z.object(
          //   Object.fromEntries(
          //     field.fields.map((field) => {
          //       const ztype = generateZodSchema([field]);
          //       return [field.id, ztype];
          //     })
          //   )
          // );
          const listObjSchema = generateZodSchema(field.fields);
          if (field.required === true)
            schema = z.array(listObjSchema).nonempty({
              message: field.error,
            });
          else schema = z.array(listObjSchema);
          break;

        case "group":
          // const groupObjSchema = z.object(
          //   Object.fromEntries(
          //     field.fields.map(async (field) => {
          //       const ztype = await generateZodSchema([field]);

          //       return [field.id, ztype];
          //     })
          //   )
          // );

          // schema = groupObjSchema;
          break;

        default:
          throw new Error(
            `Unsupported field type. Supported Field Types: text, email, number, textarea, checkbox, select, radio, checkbox-group, list, group`
          );
      }

      if (field.required === false && schema) {
        schema = schema.optional();
      }

      if (schema) {
        shape[field.id] = schema;
      } else {
        console.error(`No schema found for field ${field.id}`);
      }
    }

    // if (fields.length === 1) {
    //   return shape[fields[0].id];
    // }

    console.log(shape);

    return z.object(shape);
  };

  const schema = ref<ZodTypeAny>(generateZodSchema(fields));
  const fieldState = ref<Record<string, any>>(
    initFieldState(fields, undefined, isGroup, isList)
  );

  const clearFieldState = () => {
    fieldState.value = initFieldState(fields, undefined, isGroup, isList);
  };

  return {
    fieldWidth,
    initFieldState,
    shouldShowField,
    generateZodSchema,
    schema,
    fieldState,
    clearFieldState,
  };
};
