# Nuxdy Forms

[![npm version](https://img.shields.io/npm/v/nuxdy-forms.svg)](https://www.npmjs.com/package/nuxdy-forms)
[![npm downloads](https://img.shields.io/npm/dm/nuxdy-forms.svg)](https://www.npmjs.com/package/nuxdy-forms)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

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
});
```

## Basic Usage

```html
<template>
  <DynamicForm :config="formConfig" :submitCallback="handleSubmit" />
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

You can customize the appearance of the form by overriding the default classes (You can use tailwind or css to override the styles):

```css
/* Base form styles */
.dynamic-form {
  width: 100%;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.dynamic-form-field {
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
}

.dynamic-form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

/* ----------------------------------------------------------- */

.dynamic-form-field-label {
  font-size: 0.875rem;
  font-weight: 500;
}

/* ----------------------------------------------------------- */

.dynamic-form-input {
  width: 100%;
  min-height: 3rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 0.15rem solid lightgrey;
  outline: none;
  font-size: 0.875rem;
  box-shadow: 0px 0px 20px -18px;
}

.dynamic-form-input:hover {
  border: 2px solid lightgrey;
  box-shadow: 0px 0px 20px -17px;
}

.dynamic-form-input:focus {
  border: 2px solid grey;
}

/* ----------------------------------------------------------- */

.dynamic-form-select {
  width: 100%;
  min-height: 3rem;
  padding-inline: 1rem;
  border-radius: 0.5rem;
  border: 0.15rem solid lightgrey;
  outline: none;
  font-size: 0.875rem;
  box-shadow: 0px 0px 20px -18px;
}

.dynamic-form-select:hover {
  border: 2px solid lightgrey;
  box-shadow: 0px 0px 20px -17px;
}

.dynamic-form-select:focus {
  border: 2px solid grey;
}

/* ----------------------------------------------------------- */

.dynamic-form-checkbox {
  height: 1rem;
  width: 1rem;
  border-radius: 0.25rem;
  border-color: #d1d5db;
  color: #6366f1;
  margin-right: 0.5rem;
}

.dynamic-form-checkbox:focus {
  box-shadow: 0 0 0 2px #6366f1;
}

/* ----------------------------------------------------------- */

.dynamic-form-radio {
  height: 1rem;
  width: 1rem;
  border-color: #d1d5db;
  color: #6366f1;
  margin-right: 0.5rem;
}

.dynamic-form-radio:focus {
  box-shadow: 0 0 0 2px #6366f1;
}

/* ----------------------------------------------------------- */

.dynamic-form-error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
}

/* ----------------------------------------------------------- */

.dynamic-form-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.dynamic-form-description {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

/* ----------------------------------------------------------- */

.dynamic-form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.dynamic-form-button {
  display: inline-flex;
  justify-content: center;
  border-radius: 0.375rem;
  border-width: 1px;
  background-color: #4f46e5;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.dynamic-form-button:hover {
  background-color: #4338ca;
}

.dynamic-form-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #c7d2fe;
}

.dynamic-form-group {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.dynamic-form-list-item {
  position: relative;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.dynamic-form-remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #ef4444;
}

.dynamic-form-remove-button:hover {
  color: #b91c1c;
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
