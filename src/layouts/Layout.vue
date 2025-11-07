<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <el-scrollbar>
        <!-- Logo -->
        <div class="logo-box" @click="goHome">
          <img :src="isDark ? logoDark : logoLight" alt="Logo" class="logo" />
          <transition name="fade">
            <span v-if="!isCollapse" class="logo-text">PMO</span>
          </transition>
        </div>

        <!-- 菜单 -->
        <el-menu :default-active="activeMenu" class="menu" :collapse="isCollapse" router>
          <template v-for="item in menuItems" :key="item.path">
            <el-menu-item :index="item.path">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- 主体部分 -->
    <el-container>
      <el-header class="header">
        <div class="header-right">
          <el-button class="theme-toggle" @click="toggleDark()" :icon="isDark ? Moon : Sunny" circle />
          <el-button type="danger" plain size="small" @click="handleLogout">
            退出系统
          </el-button>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <RouterView />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter, RouterView } from "vue-router";
import { useDark, useToggle, useWindowSize } from "@vueuse/core";
import { Sunny, Moon, Monitor, PieChart, InfoFilled } from "@element-plus/icons-vue";
import logoDark from "@/assets/images/aras_logo_dark.png";
import logoLight from "@/assets/images/aras_logo_light.png";
import { useFileStore } from "@/store/file";
import { ElMessageBox, ElMessage } from "element-plus";
const fileStore = useFileStore();
/** 路由 & 状态 **/
const route = useRoute();
const router = useRouter();

/** 暗黑模式 **/
const isDark = useDark();
const toggleDark = useToggle(isDark);

/** 菜单配置（配置驱动） **/
const menuItems = [
  { path: "/console", label: "主控台", icon: Monitor },
  { path: "/analytics", label: "性能统计", icon: PieChart },
  { path: "/about", label: "登录趋势", icon: InfoFilled },
];
/** 退出激活 */
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      "确定要退出系统并重新选择文件吗？",
      "退出确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    // 清空状态与缓存
    fileStore.reset();
    localStorage.clear();
    // 跳转回选择界面
    router.push("/selectlog");
    ElMessage.success("已退出系统，请重新选择文件夹");
  } catch {
    ElMessage.info("已取消操作");
  }
};
/** 当前激活菜单 **/
const activeMenu = ref(route.path);
watch(
  () => route.path,
  (val) => (activeMenu.value = val)
);

/** 响应式折叠侧边栏 **/
const { width } = useWindowSize();
const isCollapse = computed(() => width.value < 992);

/** 点击 Logo 回到主控台 **/
const goHome = () => router.push("/console");
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-menu-item.is-active {
  position: relative;
  background-color: transparent !important;
  color: var(--el-color-primary) !important;
  font-weight: 600;
  border-radius: 2px;
}

.el-menu-item.is-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  border-radius: 2px;
  background-color: var(--el-color-primary);
}

.el-menu-item:hover {
  background-color: var(--el-color-primary-light-9);
  border-radius: 8px;
  color: var(--el-color-primary);
}



.sidebar {
  border-right: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
  transition: width 0.3s ease;
}

.logo-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border-bottom: 1px solid var(--el-border-color-light);
}

.logo {
  height: 36px;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

/* 菜单样式 */
.menu {
  border: none;
}

/* Header 样式 */
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
