import { defineNuxtPlugin } from "#app";
import type { FormConfig } from "./types";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      dynamicForm: {
        // Helper function to load form config from a file or API
        async loadFormConfig(source: string): Promise<FormConfig> {
          try {
            const response = await fetch(source);
            return await response.json();
          } catch (error) {
            console.error("Failed to load form configuration:", error);
            throw error;
          }
        },
      },
    },
  };
});
