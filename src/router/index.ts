import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from "element-plus";
import { useFileStore } from "@/store/file";
import ConsoleView from "@/views/ConsoleView.vue";
import AnalyticsView from "@/views/AnalyticsView.vue";
import SelectLogView from "@/views/SelectLogView.vue";
import AboutView from "@/views/AboutView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/select-log",
      name: "select-log",
      component: SelectLogView,
      meta: { fullScreen: true },
    },
    {
      path: "/",
      redirect: "/console",
    },
    {
      path: "/console",
      name: "console",
      component: ConsoleView,
    },
    {
      path: "/analytics",
      name: "analytics",
      component: AnalyticsView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    // 通配符匹配所有未定义路由
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView,
      meta: { fullScreen: true },
    },
  ],
});

export default router;

/** ✅ 全局路由守卫 */
router.beforeEach((to, from, next) => {
  const fileStore = useFileStore();

  // 在首次加载时 Pinia 可能尚未初始化（SSR/刷新）
  const selected = !!fileStore.selected;

  // 已经激活：禁止进入 /select-log
  if (to.path === "/select-log" && selected) {
    ElMessage.success("✅ 系统已激活，正在进入后台...");
    return next("/console");
  }

  // 未激活：禁止访问除 /select-log 以外的页面
  if (!selected && to.path !== "/select-log") {
    ElMessage.warning("请先选择 log 文件以激活系统");
    return next("/select-log");
  }

  next();
});
