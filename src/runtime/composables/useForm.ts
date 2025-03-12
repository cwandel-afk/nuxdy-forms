import { ref, reactive } from "vue";
import type { FormConfig } from "../types";

export function useForm(config: FormConfig) {
  const formData = reactive<Record<string, any>>({});
  const errors = ref<Record<string, string[]>>({});
  const isSubmitting = ref(false);
  const isSuccess = ref(false);

  // Initialize form data with default values
  const initForm = () => {
    config.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        formData[field.id] = field.defaultValue;
      } else if (field.type === "checkbox") {
        formData[field.id] = false;
      } else if (field.type === "group" && field.fields) {
        field.fields.forEach((subField) => {
          if (subField.defaultValue !== undefined) {
            formData[subField.id] = subField.defaultValue;
          }
        });
      } else {
        formData[field.id] = "";
      }
    });
  };

  initForm();

  const resetForm = () => {
    initForm();
    errors.value = {};
    isSuccess.value = false;
  };

  const submitForm = async (callback: (data: any) => Promise<void>) => {
    isSubmitting.value = true;
    isSuccess.value = false;

    try {
      await callback(formData);
      isSuccess.value = true;
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    resetForm,
    submitForm,
  };
}
