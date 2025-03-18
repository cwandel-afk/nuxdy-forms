<script setup lang="ts">
import type { FormField } from "../types";

const props = defineProps<{
  field: FormField;
  modelValue: any;
  errors?: string[] | Record<string, string[]>;
}>();

const emit = defineEmits(["update:modelValue"]);

function updateValue(value: any) {
  emit("update:modelValue", value);
}

// For nested fields in groups
function getNestedValue(fieldId: string) {
  return props.modelValue?.[fieldId];
}

function updateNestedValue(fieldId: string, value: any) {
  const updatedValue = { ...(props.modelValue || {}), [fieldId]: value };
  emit("update:modelValue", updatedValue);
}

function getNestedErrors(fieldId: string) {
  return typeof props.errors === "object" && !Array.isArray(props.errors)
    ? props.errors?.[fieldId]
    : undefined;
}

function updateCheckboxGroup(value: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  const currentValue = Array.isArray(props.modelValue)
    ? [...props.modelValue]
    : [];

  if (checked && !currentValue.includes(value)) {
    currentValue.push(value);
  } else if (!checked && currentValue.includes(value)) {
    const index = currentValue.indexOf(value);
    currentValue.splice(index, 1);
  }

  emit("update:modelValue", currentValue);
}

// For list fields
function addListItem() {
  const listField = props.field as { type: string; fields?: FormField[] };
  if (listField.type !== "list" || !listField.fields) return;

  const newItem: Record<string, any> = {};
  listField.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      newItem[field.id] = field.defaultValue;
    } else if (field.type === "checkbox") {
      newItem[field.id] = false;
    } else if (field.type === "checkbox-group") {
      newItem[field.id] = [];
    } else {
      newItem[field.id] = "";
    }
  });

  const currentList = Array.isArray(props.modelValue)
    ? [...props.modelValue]
    : [];
  currentList.push(newItem);
  emit("update:modelValue", currentList);
}

function removeListItem(index: number) {
  if (!Array.isArray(props.modelValue)) return;

  const currentList = [...props.modelValue];
  currentList.splice(index, 1);
  emit("update:modelValue", currentList);
}

function updateListItem(index: number, fieldId: string, value: any) {
  if (!Array.isArray(props.modelValue)) return;

  const currentList = [...props.modelValue];
  currentList[index] = { ...currentList[index], [fieldId]: value };
  emit("update:modelValue", currentList);
}
</script>

<template>
  <div class="dynamic-form-field">
    <label
      v-if="field.label && field.type !== 'checkbox'"
      :for="field.id"
      class="dynamic-form-label"
    >
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>

    <!-- Text, Email, Number inputs -->
    <input
      v-if="['text', 'email', 'number'].includes(field.type)"
      :id="field.id"
      :type="field.type"
      :placeholder="(field as any).placeholder"
      :required="field.required"
      :value="modelValue"
      :min="field.type === 'number' ? field.min : undefined"
      :max="field.type === 'number' ? field.max : undefined"
      class="dynamic-form-input"
      @input="updateValue(($event.target as HTMLInputElement).value)"
    />

    <!-- Select dropdown -->
    <select
      v-else-if="field.type === 'select'"
      :id="field.id"
      :required="field.required"
      :value="modelValue"
      class="dynamic-form-select"
      @change="updateValue(($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled selected>
        {{ (field as any).placeholder || "Select an option" }}
      </option>
      <option
        v-for="option in (field as any).options"
        :key="String(option.value)"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Radio buttons -->
    <div v-else-if="field.type === 'radio'" class="space-y-2">
      <div
        v-for="option in (field as any).options"
        :key="String(option.value)"
        class="flex items-center"
      >
        <input
          :id="`${field.id}-${option.value}`"
          type="radio"
          :name="field.id"
          :value="option.value"
          :checked="modelValue === option.value"
          class="dynamic-form-radio"
          @change="updateValue(option.value)"
        />
        <label
          :for="`${field.id}-${option.value}`"
          class="dynamic-form-field-label"
        >
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- Checkbox -->
    <div v-else-if="field.type === 'checkbox'" class="flex items-center">
      <input
        :id="field.id"
        type="checkbox"
        :checked="!!modelValue"
        class="dynamic-form-checkbox"
        @change="updateValue(($event.target as HTMLInputElement).checked)"
      />
      <label :for="field.id" class="dynamic-form-field-label">
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </label>
    </div>

    <!-- Textarea -->
    <textarea
      v-else-if="field.type === 'textarea'"
      :id="field.id"
      :placeholder="(field as any).placeholder"
      :required="field.required"
      :rows="(field as any).rows || 3"
      :value="modelValue"
      class="dynamic-form-input"
      @input="updateValue(($event.target as HTMLTextAreaElement).value)"
    ></textarea>

    <!-- Checkbox group -->
    <div v-else-if="field.type === 'checkbox-group'" class="space-y-2">
      <div
        v-for="option in (field as any).options"
        :key="String(option.value)"
        class="flex items-center"
      >
        <input
          :id="`${field.id}-${option.value}`"
          type="checkbox"
          :name="field.id"
          :value="option.value"
          :checked="
            Array.isArray(modelValue) && modelValue.includes(option.value)
          "
          class="dynamic-form-checkbox"
          @change="updateCheckboxGroup(option.value, $event)"
        />
        <label
          :for="`${field.id}-${option.value}`"
          class="dynamic-form-field-label"
        >
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- Group of fields -->
    <div v-else-if="field.type === 'group'" class="dynamic-form-group">
      <h3 v-if="field.label" class="dynamic-form-label">
        {{ field.label }}
      </h3>
      <template v-if="(field as any).fields">
        <FormField
          v-for="subField in (field as any).fields"
          :key="subField.id"
          :field="subField"
          :model-value="getNestedValue(subField.id)"
          :errors="getNestedErrors(subField.id)"
          @update:model-value="updateNestedValue(subField.id, $event)"
        />
      </template>
    </div>

    <!-- List field -->
    <div v-else-if="field.type === 'list'">
      <div v-if="Array.isArray(modelValue) && modelValue.length > 0">
        <div
          v-for="(item, index) in modelValue"
          :key="index"
          class="dynamic-form-list-item"
        >
          <button
            type="button"
            class="dynamic-form-remove-button"
            @click="removeListItem(index)"
          >
            &times;
          </button>

          <div v-if="(field as any).fields">
            <div v-for="subField in (field as any).fields" :key="subField.id">
              <FormField
                :field="subField"
                :model-value="item[subField.id]"
                @update:model-value="updateListItem(index, subField.id, $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="dynamic-form-button" @click="addListItem">
        {{ (field as any).addButtonLabel || "Add Item" }}
      </button>
    </div>

    <!-- Error messages -->
    <div v-if="errors && errors.length" class="dynamic-form-error">
      <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>
