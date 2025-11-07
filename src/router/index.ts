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
      path: "/",
      redirect: "/console",
    },
    {
      path: "/console",
      component: () => import("@/layouts/Layout.vue"),
      children: [
        {
          path: "",
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
      ],
    },
    {
      path: "/selectlog",
      name: "selectlog",
      component: SelectLogView,
      meta: { fullScreen: true },
    },
    // 通配符匹配所有未定义路由
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: NotFoundView,
      meta: { fullScreen: true },
    },
  ],
});

export default router;

/** 全局路由守卫 */
router.beforeEach((to, from, next) => {
  const fileStore = useFileStore();
  const selected = !!fileStore.selected;

  // 放行所有带 fullScreen 的页面
  if (to.matched.some((r) => r.meta.fullScreen)) {
    // 如果系统已激活，则禁止重复进入选择日志页
    if (to.path === "/selectlog" && selected) {
      ElMessage.success("✅ 系统已激活，正在进入后台...");
      return next("/console");
    }
    return next();
  }

  // 如果未激活则跳转到选择日志页
  if (!selected) {
    ElMessage.warning("请先选择 log 文件以激活系统");
    return next("/selectlog");
  }

  // 否则放行
  next();
});
