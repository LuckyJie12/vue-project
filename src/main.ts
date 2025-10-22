import './assets/css/normalize.css'
import App from './App.vue'
import { createApp, watch } from 'vue'
import { useDark } from '@vueuse/core'
import { createPinia } from 'pinia'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入 Element Plus 暗色主题变量（当 html 上存在 .dark 时生效）
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局暗色模式状态（基于 @vueuse/core 的 useDark）
const isDark = useDark()
// 将暗色类同步到 <html>，确保组件库或自定义样式可基于 .dark 生效
watch(isDark, (v) => {
  document.documentElement.classList.toggle('dark', !!v)
}, { immediate: true })

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
