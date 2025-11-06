import "./assets/css/normalize.css";
import App from "./App.vue";
import { createApp } from "vue";
import { watch } from "vue";
import { useDark } from "@vueuse/core";
import { createPinia } from "pinia";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 导入 Element Plus 暗色主题变量
import "element-plus/theme-chalk/dark/css-vars.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 全局 dark 状态同步到 <html>，确保基于 .dark 的样式（如 element-plus 暗色变量）生效
const isDark = useDark();
watch(
  isDark,
  (v) => {
    document.documentElement.classList.toggle("dark", !!v);
  },
  { immediate: true }
);
app.mount("#app");