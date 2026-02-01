import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import { VueDraggableGrid } from './plugins/vue-grid-layout';
import router from './router';

import { PrimeVue, FtTheme, ToastService } from './plugins/primevue';
import i18n from './plugins/i18n';

const myApp = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
myApp.use(pinia);
const settingsStore = useSettingsStore(pinia);
// Keep i18n locale in sync with persisted settings
i18n.global.locale.value = settingsStore.locale;
watch(
  () => settingsStore.locale,
  (locale) => {
    i18n.global.locale.value = locale;
  },
);

myApp.use(PrimeVue, {
  theme: {
    preset: FtTheme,
    options: {
      darkModeSelector: '.ft-dark-theme',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
});
myApp.use(ToastService);

myApp.use(router);
myApp.use(i18n);
myApp.use(VueDraggableGrid);

// Vue.config.productionTip = false;
myApp.mount('#app');
