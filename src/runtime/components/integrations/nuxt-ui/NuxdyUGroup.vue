<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { FormField } from "../../../types";
import { useNuxtUiForm } from "../../../composables/useNuxtUiForm";
import { ZodError } from "zod";
const props = defineProps<{
  fields: FormField[];
  groupId: string;
  fullWidthFields?: boolean;
  spaceBetweenFields?: string;
}>();

const formErrors = ref<ZodError | null>(null);


const fieldConfig = computed(() => {
  return {
    id: props.groupId,
    fields: props.fields,
  };
});

const { state, schema, initState, shouldShowField, fieldWidth } = useNuxtUiForm(
  fieldConfig.value
);

onMounted(async () => {
  await initState();
});

watch(state, (newVal) => {
  emit("update:state", {
    formState: newVal,
    groupId: props.groupId,
  });
});

const emit = defineEmits(["update:state"]);

const handleListUpdate = (newVal: any) => {
  if (newVal) {
    state.value[newVal.listId] = newVal.formState;
  }
};

const fieldError = (field: FormField) => {
  return formErrors.value?.issues.find((issue) =>
    issue.path.some((path) => path == field.id)
  )?.message;
};
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    :key="schema"
    class="nuxdy-ui-form"
    :style="{
      '--space-between-fields': props.spaceBetweenFields,
    }"
  >
    <div v-for="field in fields" :key="field.id">
      <UFormField
        v-if="shouldShowField(field, state)"
        :name="field.id"
        :label="field.label"
        :required="field.required"
        :help="field.helpText"
        :description="field.description"
        :hint="field.hint"
        :error="fieldError(field)"
        :size="field.size"
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
            @update:state="handleListUpdate"
          />
        </UCard>
        <!-- <UCard v-if="field.type === 'group'">
      <NuxdyUGroup
        :fields="field.fields"
        :group-id="field.id"
        @update:state="handleGroupUpdate"
      />
    </UCard> -->
      </UFormField>
    </div>
  </UForm>
  <!-- <pre>{{ formState }}</pre> -->
</template>

<style scoped>
.nuxdy-ui-form {
  --space-between-fields: 1rem;
  & > * + * {
    margin-top: var(--space-between-fields);
  }
}
</style>
