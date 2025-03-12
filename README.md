# Nuxdy Forms

A dynamic form component library for Nuxt 3 applications. This library allows you to create highly configurable forms with various field types, nested fields, conditional rendering, and validation.

## Features

- **Multiple Field Types**: Support for text, email, number, textarea, select, radio, checkbox, checkbox groups, and more
- **Nested Fields**: Create complex forms with nested field groups
- **Conditional Rendering**: Show/hide fields based on the values of other fields
- **Validation**: Built-in validation with customizable error messages
- **Styling**: Highly configurable with Tailwind CSS classes
- **Output Formats**: Export form data as JSON or YAML
- **Callback Support**: Submit form data to your backend API with a simple callback function

## Installation

```bash
# npm
npm install nuxdy-forms

# yarn
yarn add nuxdy-forms

# pnpm
pnpm add nuxdy-forms
```

## Setup

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ["nuxdy-forms"],
  // Optional module configuration
  dynamicForm: {
    // Your configuration options here
  },
});
```

## Basic Usage

```html
<template>
  <DynamicForm
    :config="formConfig"
    :submitCallback="handleSubmit"
    formClasses="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
  />
</template>
```

```typescript
const formConfig = {
  id: "contact-form",
  title: "Contact Us",
  description: "Please fill out the form below to get in touch with us.",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Full Name",
      required: true,
      placeholder: "Enter your full name",
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      required: true,
      placeholder: "your.email@example.com",
      validation: {
        message: "Please enter a valid email address",
      },
    },
    {
      id: "message",
      type: "textarea",
      label: "Message",
      required: true,
      rows: 4,
      placeholder: "How can we help you?",
    },
  ],
  submitLabel: "Send Message",
  resetLabel: "Clear Form",
  outputFormat: "json",
};

const handleSubmit = async (formData) => {
  // Handle form submission
  console.log(formData);
  // Send data to your API
  // await $fetch('/api/contact', { method: 'POST', body: formData });
};
```

## Form Configuration

The form configuration object has the following structure:

```typescript
interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  resetLabel?: string;
  outputFormat?: "json" | "yaml";
}
```

### Field Types

#### Text, Email, Number

```typescript
{
  id: "fieldId",
  type: "text", // or "email" or "number"
  label: "Field Label",
  placeholder: "Placeholder text",
  required: true,
  helpText: "Help text for the field",
  min: 0, // For number fields
  max: 100, // For number fields
  validation: {
    rules: ["required", "email"], // Built-in validation rules
    message: "Custom error message"
  },
  defaultValue: "Default value"
}
```

#### Textarea

```typescript
{
  id: "message",
  type: "textarea",
  label: "Message",
  placeholder: "Enter your message",
  rows: 4,
  required: true
}
```

#### Select, Radio, Checkbox Group

```typescript
{
  id: "category",
  type: "select", // or "radio" or "checkbox-group"
  label: "Category",
  options: [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
  ],
  required: true,
  defaultValue: "option1" // For select/radio
  // For checkbox-group, defaultValue would be an array: ["option1", "option2"]
}
```

#### Checkbox

```typescript
{
  id: "subscribe",
  type: "checkbox",
  label: "Subscribe to newsletter",
  defaultValue: false
}
```

#### Group (Nested Fields)

```typescript
{
  id: "address",
  type: "group",
  label: "Address",
  fields: [
    {
      id: "street",
      type: "text",
      label: "Street",
      required: true
    },
    {
      id: "city",
      type: "text",
      label: "City",
      required: true
    },
    {
      id: "zipCode",
      type: "text",
      label: "ZIP Code",
      required: true
    }
  ]
}
```

#### List (Array of Objects)

```typescript
{
  id: "contacts",
  type: "list",
  label: "Additional Contacts",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Name",
      required: true
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      required: true
    }
  ],
  addButtonLabel: "Add Contact",
  removeButtonLabel: "Remove",
  minItems: 0,
  maxItems: 5
}
```

### Conditional Fields

You can show/hide fields based on the values of other fields:

```typescript
{
  id: "hasChildren",
  type: "checkbox",
  label: "Do you have children?",
  defaultValue: false
},
{
  id: "numberOfChildren",
  type: "number",
  label: "Number of children",
  min: 1,
  conditions: [
    {
      field: "hasChildren",
      operator: "==",
      value: true
    }
  ]
}
```

## Styling

You can customize the appearance of the form by overriding the default Tailwind CSS classes:

```css
/* Base form styles */
.dynamic-form {
  @apply w-full space-y-6 p-6 rounded-lg;
}

.dynamic-form-field {
  @apply w-full mb-4;
}

.dynamic-form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.dynamic-form-input {
  @apply w-full min-h-14 block rounded-md border-2 border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500;
}

.dynamic-form-select {
  @apply w-full min-h-14 bg-transparent block rounded-md border-2 border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500;
}

.dynamic-form-checkbox {
  @apply h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500;
}

.dynamic-form-radio {
  @apply h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500;
}

.dynamic-form-error {
  @apply mt-2 text-sm text-red-600;
}

.dynamic-form-button {
  @apply inline-flex justify-center rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}

.dynamic-form-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #c7d2fe;
}

.dynamic-form-description {
  @apply text-gray-600 mb-6;
}

.dynamic-form-title {
  @apply text-xl font-bold mb-4;
}

.dynamic-form-group {
  @apply p-4 border border-gray-200 rounded-lg mb-4;
}

.dynamic-form-list-item {
  @apply relative p-4 border border-gray-200 rounded-lg mb-4;
}

.dynamic-form-remove-button {
  @apply absolute top-2 right-2 text-red-500 hover:text-red-700;
}

.dynamic-form-actions {
  @apply flex gap-4 mt-6;
}
```

## Events

The DynamicForm component emits the following events:

- `submit`: Emitted when the form is submitted with valid data
- `reset`: Emitted when the form is reset
- `validation-error`: Emitted when there are validation errors

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build

# Run tests
npm run test
```

## License

MIT
