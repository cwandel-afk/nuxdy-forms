<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { FormConfig, FormField } from "../types";

const props = defineProps<{
  config: FormConfig;
  submitCallback?: (data: any) => void | Promise<void>;
}>();

const emit = defineEmits(["submit", "reset", "validation-error"]);

const formData = ref<Record<string, any>>({});
const errors = ref<Record<string, string[]>>({});

// Initialize form data with default values
onMounted(() => {
  initializeFormData(props.config.fields);
});

function initializeFormData(fields: FormField[]) {
  fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      formData.value[field.id] = field.defaultValue;
    } else if (field.type === "checkbox") {
      formData.value[field.id] = false;
    } else if (field.type === "checkbox-group") {
      formData.value[field.id] = [];
    } else if (field.type === "list") {
      formData.value[field.id] = [];
    } else if (field.type === "group" && "fields" in field) {
      // For group fields, create an object to hold nested values
      formData.value[field.id] = formData.value[field.id] || {};
      // Initialize nested fields
      field.fields.forEach((subField) => {
        if (subField.defaultValue !== undefined) {
          formData.value[field.id][subField.id] = subField.defaultValue;
        } else if (subField.type === "checkbox") {
          formData.value[field.id][subField.id] = false;
        } else if (subField.type === "checkbox-group") {
          formData.value[field.id][subField.id] = [];
        } else {
          formData.value[field.id][subField.id] = "";
        }
      });
    } else {
      formData.value[field.id] = "";
    }
  });
}

function updateField(fieldId: string, value: any) {
  formData.value[fieldId] = value;
}

function shouldShowField(field: FormField): boolean {
  // If no conditions are specified, always show the field
  if (!field.conditions || field.conditions.length === 0) {
    return true;
  }

  // Check all conditions
  return field.conditions.every((condition) => {
    const fieldValue = formData.value[condition.field];

    switch (condition.operator) {
      case "==":
        return fieldValue == condition.value;
      case "!=":
        return fieldValue != condition.value;
      case ">":
        return fieldValue > condition.value;
      case "<":
        return fieldValue < condition.value;
      case ">=":
        return fieldValue >= condition.value;
      case "<=":
        return fieldValue <= condition.value;
      case "contains":
        return (
          Array.isArray(fieldValue) && fieldValue.includes(condition.value)
        );
      case "!contains":
        return (
          !Array.isArray(fieldValue) || !fieldValue.includes(condition.value)
        );
      default:
        return true;
    }
  });
}

async function handleSubmit() {
  // Reset errors
  errors.value = {};

  // Validate required fields
  let isValid = true;

  // Validate all fields
  props.config.fields.forEach((field) => {
    if (field.required && shouldShowField(field)) {
      const value = formData.value[field.id];
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        errors.value[field.id] = [`${field.label || field.id} is required`];
        isValid = false;
      }
    }

    // Custom validation
    if ((field as any).validation && shouldShowField(field)) {
      const value = formData.value[field.id];
      if ((field as any).validation.pattern) {
        const regex = new RegExp((field as any).validation.pattern);
        if (value && !regex.test(String(value))) {
          errors.value[field.id] = [
            (field as any).validation.message || "Invalid format",
          ];
          isValid = false;
        }
      }
    }
  });

  if (!isValid) {
    emit("validation-error", errors.value);
    return;
  }

  // Format output
  const output = formatOutput();

  // Call submit callback if provided
  if (props.submitCallback) {
    props.submitCallback(output);
  }

  emit("submit", output);
}

function formatOutput() {
  // Format the output based on config.outputFormat
  if (props.config.outputFormat === "yaml") {
    // Convert to YAML format
    // You would need to add a YAML library dependency
    return formData.value;
  }

  // Default to JSON
  return formData.value;
}

function resetForm() {
  initializeFormData(props.config.fields);
  errors.value = {};
  emit("reset");
}
</script>

<template>
  <form class="nuxdy-form" @submit.prevent="handleSubmit">
    <h2 v-if="config.title" class="nuxdy-form-title">
      {{ config.title }}
    </h2>
    <p v-if="config.description" class="nuxdy-form-description">
      {{ config.description }}
    </p>

    <template v-for="field in config.fields" :key="field.id">
      <FormField
        v-if="shouldShowField(field)"
        :field="field"
        v-model="formData[field.id]"
        :errors="errors[field.id]"
        @update:modelValue="updateField(field.id, $event)"
      />
    </template>

    <div class="nuxdy-form-actions">
      <button type="submit" class="nuxdy-form-button">
        {{ config.submitLabel || "Submit" }}
      </button>
      <button
        v-if="config.resetLabel"
        type="button"
        class="nuxdy-form-button"
        @click="resetForm"
      >
        {{ config.resetLabel }}
      </button>
    </div>
  </form>
</template>

<style scoped></style>
