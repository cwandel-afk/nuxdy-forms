<script setup lang="ts">
import type { FormConfig } from "../src/runtime/types";

const formConfig: FormConfig = {
  id: "showcase-form",
  title: "Form Field Showcase",
  description:
    "This form demonstrates all available field types and configurations.",
  fields: [
    // Text input
    {
      id: "name",
      type: "text",
      label: "Text Input",
      placeholder: "Standard text input field",
      required: true,
      helpText: "This is a standard text input with required validation",
    },

    // Email input
    {
      id: "email",
      type: "email",
      label: "Email Input",
      placeholder: "email@example.com",
      required: true,
      validation: {
        message: "Please enter a valid email address",
      },
    },

    // Number input
    {
      id: "age",
      type: "number",
      label: "Number Input",
      placeholder: "Enter a number",
      min: 18,
      max: 100,
      helpText: "This field accepts numbers between 18 and 100",
    },

    // Select dropdown
    {
      id: "category",
      type: "select",
      label: "Select Dropdown",
      required: true,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
      helpText: "Standard dropdown select with options",
    },

    // Radio buttons
    {
      id: "preference",
      type: "radio",
      label: "Radio Button Group",
      required: true,
      options: [
        { value: "option1", label: "Radio Option 1" },
        { value: "option2", label: "Radio Option 2" },
        { value: "option3", label: "Radio Option 3" },
      ],
      defaultValue: "option1",
    },

    // Checkbox
    {
      id: "agreement",
      type: "checkbox",
      label: "Single Checkbox",
      defaultValue: false,
      helpText: "This is a single checkbox option",
    },

    // Checkbox group
    {
      id: "interests",
      type: "checkbox-group",
      label: "Checkbox Group",
      options: [
        { value: "interest1", label: "Interest 1" },
        { value: "interest2", label: "Interest 2" },
        { value: "interest3", label: "Interest 3" },
      ],
      helpText: "Select multiple options",
    },

    // Textarea
    {
      id: "comments",
      type: "textarea",
      label: "Text Area",
      placeholder: "Enter longer text here...",
      rows: 4,
      helpText: "This is a multi-line text input",
    },

    // Conditional field (shows only when a condition is met)
    {
      id: "conditionalField",
      type: "text",
      label: "Conditional Field",
      placeholder: "This field appears conditionally",
      conditions: [
        {
          field: "agreement",
          operator: "==",
          value: true,
        },
      ],
      helpText: "This field only appears when the checkbox is checked",
    },

    // Field with custom classes
    {
      id: "customStyleField",
      type: "text",
      label: "Custom Styled Field",
      placeholder: "This field has custom styling",
    },

    // List field example
    {
      id: "contacts",
      type: "list",
      label: "Contact List",
      addButtonLabel: "Add Contact",
      fields: [
        {
          id: "contactName",
          type: "text",
          label: "Contact Name",
          placeholder: "Enter contact name",
          required: true,
        },
        {
          id: "contactEmail",
          type: "email",
          label: "Contact Email",
          placeholder: "contact@example.com",
          required: true,
        },
        {
          id: "relationship",
          type: "select",
          label: "Relationship",
          options: [
            { value: "family", label: "Family" },
            { value: "friend", label: "Friend" },
            { value: "colleague", label: "Colleague" },
          ],
        },
        {
          id: "newList1",
          type: "list",
          label: "New List 1",
          fields: [
            {
              id: "newField1",
              type: "text",
              label: "New Field 1",
              placeholder: "Enter new field 1",
            },
            {
              id: "newList2",
              type: "list",
              label: "New List 2",
              fields: [
                {
                  id: "newField2",
                  type: "text",
                  label: "New Field 2",
                  placeholder: "Enter new field 2",
                },
              ],
            },
          ],
        },
      ],
      helpText: "Add multiple contacts to your list",
    },
  ],
  submitLabel: "Submit Forma",
  resetLabel: "Reset Fields",
};

const handleSubmit = (data: any) => {
  console.log("Form submitted:", data);
  // Here you would typically send the data to your API
  alert("Form submitted successfully!");
};
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Dynamic Form Example</h1>

    <DynamicForm :config="formConfig" @submit="handleSubmit" />
  </div>
</template>
