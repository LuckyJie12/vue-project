<template>
  <div style="height: 100vh">
    <!-- 当路由需要全屏（比如 log 选择页），直接渲染 RouterView 占满页面 -->
    <RouterView v-if="isFullScreen" />

    <!-- 否则渲染常规布局（侧边栏 + header + main） -->
    <el-container v-else class="layout-container-index" style="height: 100vh">
      <el-aside width="200px">
        <el-scrollbar>
          <!-- Logo 图标 -->
          <div style="display: flex; justify-content: center; align-items: center; height: 60px;">
            <img :src="isDark ? '/aras_logo_dark.png' : '/aras_logo_light.png'" alt="Logo" style="height: 60px;" />
          </div>
          <el-menu router :default-active="defaultActive" class="el-menu-vertical" @open="handleOpen"
            @close="handleClose">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Monitor />
                </el-icon>
                <span>系统监控</span>
              </template>
              <el-menu-item index="/console">主控台</el-menu-item>
              <el-menu-item index="/analytics">性能统计</el-menu-item>
              <el-menu-item index="/about">登录趋势</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-button class="theme-toggle" @click="toggleDark()" :icon="isDark ? MoonIcon : SunIcon" circle />
          </div>

        </el-header>
        <el-main>
          <el-scrollbar>
            <RouterView />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import {
  Monitor,
  Sunny as SunIcon,
  Moon as MoonIcon,
} from '@element-plus/icons-vue'
const route = useRoute()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const defaultActive = ref(route.path)
import { computed } from 'vue'

// 当路由的 meta.fullScreen 为 true 时，页面应全屏渲染 RouterView
const isFullScreen = computed(() => {
  return Boolean(route.meta && (route.meta as any).fullScreen)
})

// 监听路由变化，更新菜单激活状态
watch(() => route.path, (newPath) => {
  defaultActive.value = newPath
})
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.layout-container-index .el-header {
  position: relative;
  border-bottom: 1px solid var(--el-border-color-light);
}

.layout-container-index .el-aside {
  border-right: 1px solid var(--el-border-color-light);
}

.layout-container-index .el-menu {
  border-right: none;
}

.layout-container-index .el-main {
  padding: 0;
}

.layout-container-index .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>