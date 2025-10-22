<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
          @select="handleSelect">
          <el-menu-item index="0">
            <img style="width: 100px" src="/element-plus-logo.svg" alt="Element logo" />
          </el-menu-item>
          <el-menu-item index="1">Processing Center</el-menu-item>
          <el-sub-menu index="2">
            <template #title>Workspace</template>
            <el-menu-item index="/">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>item four</template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
              <el-menu-item index="2-4-2">item two</el-menu-item>
              <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router :default-active="defaultActive" class="el-menu-vertical-demo" @open="handleOpen"
            @close="handleClose" style="height: calc(100vh - 60px);">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <location />
                </el-icon>
                <span>导航栏一</span>
              </template>
              <el-menu-item index="/">主页</el-menu-item>
              <el-menu-item index="/about">关于</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-scrollbar style="height: calc(100vh - 100px);">
            <RouterView />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import {
  Location,
} from '@element-plus/icons-vue'
const activeIndex = ref('1')
const defaultActive = ref('/')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
<style scoped>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
