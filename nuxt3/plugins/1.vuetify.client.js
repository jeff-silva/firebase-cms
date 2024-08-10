/**
 * Install Vuetify and create nuxt.config.ts like in link above.
 * Dont need to install @mdi/font. We will use @iconify/vue
 * https://vuetifyjs.com/en/getting-started/installation/#using-nuxt-3
 *
 * yarn add -D vuetify vite-plugin-vuetify
 * yarn add -D @iconify/vue @date-io/dayjs dayjs
 *
 */

// Iconify
import { h } from "vue";
import { Icon } from "@iconify/vue";

// Vuetify
// https://next.vuetifyjs.com/en/
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";
import DayJsAdapter from "@date-io/dayjs";

const defaults = {
  VTextField: { variant: "outlined" },
  VTextarea: { variant: "outlined" },
  VSelect: { variant: "outlined" },
  VAutocomplete: { variant: "outlined" },
  VFileInput: { variant: "outlined" },
};

export default defineNuxtPlugin(async (nuxtApp) => {
  const vuetifyOptions = {
    components: {
      ...components,
      ...labsComponents,
    },
    directives,
    defaults,
    icons: {
      defaultSet: "iconify",
      sets: {
        iconify: {
          component: (props) => {
            return h(Icon, { icon: props.icon, size: props.size });
          },
        },
      },
    },
    date: { adapter: DayJsAdapter },
  };

  nuxtApp.vueApp.use(createVuetify(vuetifyOptions));
  nuxtApp.provide("vuetifyOptions", vuetifyOptions);
});
