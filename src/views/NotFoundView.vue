<template>
  <div class="notfound-container">
    <h1>404</h1>
    <p>您访问的页面不存在</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => {
  router.push("/console");
};
</script>

<style scoped>
.notfound-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #f9fafb;
  font-family: "Segoe UI", sans-serif;
}

h1 {
  font-size: 6rem;
  color: #409eff;
  margin-bottom: 10px;
}

p {
  color: #6b7280;
  font-size: 1.2rem;
  margin-bottom: 20px;
}
</style>
