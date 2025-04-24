import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addServerPlugin,
  addImportsDir,
  addComponentsDir,
} from "@nuxt/kit";
import { fileURLToPath } from "url";
export interface ModuleOptions {
  useNuxtUI?: boolean;
  fullWidthFields?: boolean;
  spaceBetweenFields?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxdy-forms",
    configKey: "nuxdyForm",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    useNuxtUI: false,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    // Add CSS file with a lower priority (to load it earlier)
    nuxt.options.css.unshift(
      resolver.resolve("./runtime/assets/css/nuxdy-form.css")
    );

    if (options.useNuxtUI) {
      nuxt.options.css.unshift(
        resolver.resolve("./runtime/assets/css/nuxdy-form.css")
      );

      addComponentsDir({
        path: resolver.resolve("./runtime/components/integrations/nuxt-ui"),
        pathPrefix: false,
      });
    }

    // Add components
    addComponent({
      name: "NuxdyForm",
      filePath: resolver.resolve("./runtime/components/NuxdyForm.vue"),
    });

    addComponent({
      name: "FormField",
      filePath: resolver.resolve("./runtime/components/FormField.vue"),
    });

    // Add composables
    addImportsDir(resolver.resolve("./runtime/composables"));

    // If Nuxt UI is enabled, add the module
    if (options.useNuxtUI) {
      nuxt.options.modules.push("@nuxt/ui");
    }
  },
});
