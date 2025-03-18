import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addServerPlugin,
  addImportsDir,
  addComponentsDir,
} from "@nuxt/kit";
import { fileURLToPath } from "url";

export default defineNuxtModule({
  meta: {
    name: "nuxdy-forms",
    configKey: "nuxdyForm",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  setup(_, nuxt) {
    const resolver = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    // Add CSS file with a lower priority (to load it earlier)
    nuxt.options.css.unshift(
      resolver.resolve("./runtime/assets/css/nuxdy-form.css")
    );

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
  },
});
