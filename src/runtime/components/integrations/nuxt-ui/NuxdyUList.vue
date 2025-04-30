<script setup lang="ts">
import { ref, onMounted, computed, h, resolveComponent } from "vue";
import type { FormField } from "../../../types";
import { ZodError } from "zod";
import { generateZodSchema } from "../../../composables/useZodForm";
import { useNuxtUiForm } from "../../../composables/useNuxtUiForm";
const UButton = resolveComponent("UButton");
const props = defineProps<{
  fields: FormField[];
  listId: string;
  fullWidthFields?: boolean;
  spaceBetweenFields?: string;
  addButtonLabel?: string;
}>();

const fieldConfig = computed(() => {
  return {
    id: props.listId,
    fields: props.fields,
  };
});
const { state, schema, initState, shouldShowField, fieldWidth } = useNuxtUiForm(
  fieldConfig.value,
  undefined,
  true
);

const isHydrated = ref(false);
const formState = ref<any[]>([]);

const validateListState = async () => {
  console.group("Validate List State");
  console.log("State", state);
  console.log("Schema", schema.value);
  console.groupEnd();
  return await schema.value
    ?.parseAsync(state)
    .then((res) => {
      console.log("List Validated");
      return true;
    })
    .catch((err: ZodError) => {
      console.group("List Validation Error");
      console.log("State", state);
      console.log("Schema", schema.value);
      console.log("List Validation Error", err);
      console.groupEnd();
      return false;
    });
};

const addItem = async () => {
  await validateListState().then((res) => {
    if (res) {
      formState.value.push(state);
      // Reset field state to initial values
      initState();
      // Reset schema
      schema.value = generateZodSchema(props.fields);
      emit("update:state", {
        formState: formState.value,
        listId: props.listId,
      });
    }
  });
};

const removeItem = (index: number) => {
  formState.value.splice(index, 1);
  emit("update:state", {
    formState: formState.value,
    listId: props.listId,
  });
};

onMounted(async () => {
  isHydrated.value = true;
});

const handleGroupUpdate = (newVal: any) => {
  if (newVal) {
    formState.value[newVal.groupId] = newVal.formState;
  }
};

const tableColumns = computed(() => {
  return [
    ...props.fields.map((item) => {
      return {
        accessorKey: item.id,
        header: item.label,
      };
    }),
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }: { row: any }) => {
        return h(
          "div",
          { class: "text-right" },
          h(UButton, {
            icon: "i-lucide-trash",
            color: "error",
            variant: "ghost",
            "aria-label": "Remove item",
            onClick: () => removeItem(row.index),
          })
        );
      },
    },
  ];
});

const handleListUpdate = (newVal: any) => {
  if (newVal) {
    state[newVal.listId] = newVal.formState;
  }
};

const emit = defineEmits(["update:state"]);
</script>

<template>
  <div v-if="!isHydrated" class="nuxdy-form-loading">
    <!-- You can add a loading skeleton or spinner here -->
    <div class="animate-pulse">
      <div v-for="field in fields" :key="field.id" class="mb-4">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
  <template v-else>
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
          :key="field.id"
          :name="field.id"
          :label="field.label"
          :required="field.required"
          :help="field.helpText"
          :description="field.description"
          :hint="field.hint"
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
          <UCard v-if="field.type === 'group'">
            <NuxdyUGroup
              :fields="field.fields"
              :group-id="field.id"
              @update:state="handleGroupUpdate"
            />
          </UCard>
        </UFormField>
      </div>
      <UButton :label="props.addButtonLabel || 'Add Item'" @click="addItem" />
    </UForm>
    <!-- List of items -->
    <div class="flex flex-col gap-2 mt-4">
      <UTable
        :data="formState"
        :columns="tableColumns"
        :key="formState.length"
      />

      <!-- <UCard v-for="(item, index) in formState" :key="index">
        <template #header>
          <UButton @click="removeItem(index)">Remove Item</UButton>
        </template>
      </UCard> -->
    </div>
  </template>
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
