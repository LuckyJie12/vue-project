<template>
  <div class="about">
    <h1>我是主页面</h1>
    <h1>人员信息</h1>
    <p>姓名：{{ Person.name }}</p>
    <p>年龄：{{ Person.age }}</p>
    <el-button type="primary" @click="addPersonAge()">年龄+1</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
let Person = ref({
  name: "张三",
  age: 18
});
const addPersonAge = () => {
  Person.value.age += 1;
}
</script>