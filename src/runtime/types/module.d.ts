import type { FormModuleOptions } from "./index";

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    dynamicForm?: FormModuleOptions;
  }
}
