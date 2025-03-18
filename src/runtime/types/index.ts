export interface FormModuleOptions {
  // Any module options you want to keep
}

// Base interface with common properties
interface BaseFormField {
  id: string;
  label: string;
  required?: boolean;
  helpText?: string;
  conditions?: Array<{
    field: string;
    operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "!contains";
    value: any;
  }>;
  defaultValue?: any;
}

// Input fields (text, email, number)
interface InputFormField extends BaseFormField {
  type: "text" | "email" | "number";
  min?: number;
  max?: number;
  placeholder?: string;
  validation?: {
    rules?: string[];
    message?: string;
  };
}

// Textarea field
interface TextareaFormField extends BaseFormField {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  validation?: {
    rules?: string[];
    message?: string;
  };
}

// Options-based fields (select, radio, checkbox-group)
interface OptionsFormField extends BaseFormField {
  type: "select" | "radio" | "checkbox-group";
  options: Array<{
    value: string | number | boolean;
    label: string;
  }>;
  placeholder?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

// Checkbox field
interface CheckboxFormField extends BaseFormField {
  type: "checkbox";
}

// Group field (creates a nested object)
interface GroupFormField extends BaseFormField {
  type: "group";
  fields: FormField[];
}

// List field (creates an array of objects)
interface ListFormField extends BaseFormField {
  type: "list";
  fields: FormField[];
  addButtonLabel?: string;
  removeButtonLabel?: string;
  minItems?: number;
  maxItems?: number;
}

// Union type of all field types
export type FormField =
  | InputFormField
  | TextareaFormField
  | OptionsFormField
  | CheckboxFormField
  | GroupFormField
  | ListFormField;

export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  resetLabel?: string;
  outputFormat?: "json" | "yaml";
}
