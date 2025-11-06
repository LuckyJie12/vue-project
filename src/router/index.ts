import { createRouter, createWebHistory } from "vue-router";
import ConsoleView from "@/views/ConsoleView.vue";
import AnalyticsView from "@/views/AnalyticsView.vue";
import SelectLogView from "@/views/SelectLogView.vue";
import AboutView from "../views/AboutView.vue";
import { ElMessage } from "element-plus";
import { useFileStore } from "@/store/file";

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
      name: "home",
      component: AnalyticsView,
    },

    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
  ],
});

export default router;

// 全局路由守卫：进入 /analytics（性能统计） 前，检查是否已选择 log 文件
router.beforeEach((to, from, next) => {
  // 如果目标已经是选择页面，放行
  if (to.path === "/select-log") return next();

  const fileStore = useFileStore();
  const selected = fileStore && (fileStore.selected as boolean);

  if (!selected) {
    ElMessage.warning("请先选择 log 文件，正在跳转到选择页面");
    return next({ path: "/select-log" });
  }

  next();
});
