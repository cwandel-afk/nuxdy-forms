<script setup lang="ts">
import { ZodError } from "zod";
import { useZodForm } from "../../../composables/useZodForm";
import type { FormConfig, FormField } from "../../../types";
import { onMounted, ref } from "vue";
const props = defineProps<{
  config: FormConfig;
  initialState?: any;
  fullWidthFields?: boolean;
  spaceBetweenFields?: string;
  onSubmit: (state: any) => Promise<void> | void;
}>();

const isHydrated = ref(false);
const formErrors = ref<ZodError | null>(null);

const { state, schema, initState, shouldShowField } = useZodForm(
  props.config,
  props.initialState
);

const handleSubmit = async () => {
  await props.onSubmit(state);
};

const handleReset = () => {
  initState();
};

onMounted(async () => {
  await initState();
  isHydrated.value = true;
});

const handleListUpdate = (newVal: any) => {
  if (newVal) {
    state[newVal.listId] = newVal.formState;
  }
};

const handleGroupUpdate = (newVal: any) => {
  if (newVal) {
    state[newVal.groupId] = newVal.formState;
  }
};

const handleValidate = async () => {
  await schema.value
    .parseAsync(state)
    .then(() => {
      handleSubmit();
    })
    .catch((error: ZodError) => {
      formErrors.value = error;
    });
};

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

const fieldError = (field: FormField) => {
  return formErrors.value?.issues.find((issue) =>
    issue.path.some((path) => path == field.id)
  )?.message;
};
</script>

<template>
  <div v-if="!isHydrated" class="nuxdy-form-loading">
    <!-- You can add a loading skeleton or spinner here -->
    <div class="animate-pulse">
      <div v-for="field in config.fields" :key="field.id" class="mb-4">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
  <UForm
    v-else
    :state="state"
    :schema="schema"
    :key="schema"
    class="nuxdy-ui-form"
    :style="{
      '--space-between-fields': props.spaceBetweenFields,
    }"
  >
    <div v-for="field in config.fields" :key="field.id">
      <!-- TODO: Group and List Error Handling within UFormField -->
      <UFormField
        v-if="shouldShowField(field, state)"
        :name="field.id"
        :label="field.label"
        :required="field.required"
        :help="field.helpText"
        :description="field.description"
        :hint="field.hint"
        :size="field.size"
        :error="fieldError(field)"
        @submit="console.log('submit')"
      >
        <UInput
          v-if="field.type === 'text' || field.type === 'email'"
          :name="field.id"
          :placeholder="field.placeholder"
          v-model="state[field.id]"
          :class="fieldWidth(field)"
        />
        <UInputNumber
          v-if="field.type === 'number'"
          :name="field.id"
          :placeholder="field.placeholder"
          v-model="state[field.id]"
          :class="fieldWidth(field)"
        />
        <UTextarea
          v-if="field.type === 'textarea'"
          :name="field.id"
          :rows="field.rows"
          :placeholder="field.placeholder"
          v-model="state[field.id]"
          :class="fieldWidth(field)"
        />
        <UCheckbox
          v-if="field.type === 'checkbox'"
          :name="field.id"
          v-model="state[field.id]"
          :class="fieldWidth(field)"
        />
        <USelect
          v-if="field.type === 'select'"
          :name="field.id"
          :items="field.options"
          v-model="state[field.id]"
          :placeholder="field.placeholder"
          :class="fieldWidth(field)"
        />
        <URadioGroup
          v-if="field.type === 'radio'"
          :name="field.id"
          v-model="state[field.id]"
          :items="field.options"
          :class="fieldWidth(field)"
        />
        <USelectMenu
          v-if="field.type === 'checkbox-group'"
          :name="field.id"
          multiple
          :placeholder="field.placeholder"
          v-model="state[field.id]"
          :items="field.options"
          :class="fieldWidth(field)"
        />
        <UCard v-if="field.type === 'list'">
          <NuxdyUList
            :fields="field.fields"
            :list-id="field.id"
            :full-width-fields="props.fullWidthFields"
            :space-between-fields="props.spaceBetweenFields"
            :add-button-label="field.addButtonLabel"
            @update:state="handleListUpdate"
          />
        </UCard>
        <UCard v-if="field.type === 'group'">
          <NuxdyUGroup
            :fields="field.fields"
            :group-id="field.id"
            :full-width-fields="props.fullWidthFields"
            :space-between-fields="props.spaceBetweenFields"
            @update:state="handleGroupUpdate"
          />
        </UCard>
      </UFormField>
    </div>
    <div
      class="flex gap-2"
      :class="{ 'justify-end': config.buttonPlacement === 'right' }"
    >
      <UButton :label="config.submitLabel" @click="handleValidate" />
      <UButton :label="config.resetLabel" @click="handleReset" />
    </div>
    <!--TODO: Need to figure out how to submit a nested form-->
  </UForm>
</template>

<style scoped>
.nuxdy-ui-form {
  --space-between-fields: 1rem;
  & > * + * {
    margin-top: var(--space-between-fields);
  }
}

.nuxdy-form-loading {
  width: 100%;
}
</style>
