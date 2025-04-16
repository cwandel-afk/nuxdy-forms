import { ref, computed, reactive } from "vue";
import { z, ZodTypeAny } from "zod";
import type { FormError } from "@nuxt/ui/dist/runtime/types";
import type { FormConfig, FormField } from "../types";
import { useFieldHelpers } from "./useFieldHelpers";

export function generateZodSchema(
  fields: FormField[],
  nested: boolean = false
): z.ZodType<any> {
  const shape: Record<string, ZodTypeAny> = {};

  for (const field of fields) {
    let schema: ZodTypeAny;

    switch (field.type) {
      case "text":
        schema = z.string();

        if (nested) {
          break;
        }

        if (field.required === true)
          schema = z.string().min(1, { message: field.error });
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
          schema = z.string().email().min(field.min, { message: field.error });
        if (field.max !== undefined)
          schema = z.string().email().max(field.max, { message: field.error });
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
        if (field.required) {
          schema = z.object({}).array().nonempty({
            message: field.error,
          });
        } else {
          schema = z.object({}).array();
        }
        // const listObjSchema = z.object(
        //   Object.fromEntries(
        //     field.fields.map((field) => {
        //       const ztype = generateZodSchema([field]);
        //       return [field.id, ztype];
        //     })
        //   )
        // );
        // if (field.required === true)
        //   schema = z.array(listObjSchema).nonempty({
        //     message: field.error,
        //   });
        // else schema = z.array(listObjSchema);
        break;

      case "group":
        const groupObjSchema = z.object(
          Object.fromEntries(
            field.fields.map((field) => {
              const ztype = generateZodSchema([field]);

              return [field.id, ztype];
            })
          )
        );

        schema = groupObjSchema;
        break;

      default:
        throw new Error(
          `Unsupported field type. Supported Field Types: text, email, number, textarea, checkbox, select, radio, checkbox-group, list, group`
        );
    }

    if (field.required === false) {
      schema = schema.optional();
    }

    shape[field.id] = schema;
  }

  if (fields.length === 1) {
    return shape[fields[0].id];
  }

  console.log("Parent", shape);
  return z.object(shape);
}

export function useZodForm(config: FormConfig, initialState?: any) {
  const state = reactive<Record<string, any>>({});
  const errors = ref<FormError[]>([]);
  const touched = ref<Set<string>>(new Set());
  const isSubmitting = ref(false);
  const schema = ref<ZodTypeAny>(generateZodSchema(config.fields));

  // Initialize form data with default values
  const initState = async () => {
    const initialValues: Record<string, any> = {};

    config.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      } else if (field.type === "number") {
        initialValues[field.id] = 0;
      } else if (field.type === "checkbox") {
        initialValues[field.id] = false;
      } else if (field.type === "list") {
        initialValues[field.id] = [];
      } else if (field.type === "group" && field.fields) {
        // initialValues[field.id] = useFieldHelpers().initFieldState(
        //   field.fields,
        //   undefined,
        //   true,
        //   false
        // );
      } else if (field.type === "checkbox-group") {
        initialValues[field.id] = [];
      } else {
        initialValues[field.id] = "";
      }
    });

    // if initialState is provided, merge it with the default values
    if (initialState) {
      Object.assign(initialValues, initialState);
    }

    // Update the reactive state
    Object.keys(initialValues).forEach((key) => {
      state[key] = initialValues[key];
    });
  };

  const validate = async (path?: string) => {
    try {
      await schema.value.parseAsync(state);
      if (path) {
        errors.value = errors.value.filter(
          (error: FormError) => error.path !== path
        );
      } else {
        errors.value = [];
      }
      return true;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        if (path) {
          errors.value = [
            ...errors.value.filter((error: FormError) => error.path !== path),
            ...newErrors.filter((error: FormError) => error.path === path),
          ];
        } else {
          errors.value = newErrors;
        }
      }
      return false;
    }
  };

  const clearErrors = (path?: string) => {
    if (path) {
      errors.value = errors.value.filter(
        (error: FormError) => error.path !== path
      );
    } else {
      errors.value = [];
    }
  };

  const setTouched = (path: string) => {
    touched.value.add(path);
  };

  const isTouched = (path: string) => {
    return touched.value.has(path);
  };

  const getError = (path: string) => {
    return errors.value.find((error: FormError) => error.path === path);
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

  return {
    state,
    errors,
    schema,
    isSubmitting,
    validate,
    clearErrors,
    setTouched,
    isTouched,
    getError,
    initState,
    shouldShowField,
  };
}
