<template>
  <div class="activation-bg">
    <transition name="fade" mode="out-in">
      <!-- Step 1：选择文件夹 -->
      <div v-if="step === 1" key="step1" class="card">
        <el-icon class="icon">
          <FolderOpened />
        </el-icon>
        <h2>步骤 1：选择文件夹</h2>
        <p class="desc">请选择需要验证的激活文件夹（支持 .json 文件）</p>

        <!-- 文件夹选择按钮 -->
        <input ref="folderInput" type="file" webkitdirectory hidden @change="handleFolderUpload" />
        <el-button type="primary" round size="large" class="select-btn" @click="openFolderSelector">
          <el-icon>
            <FolderAdd />
          </el-icon>
          选择文件夹
        </el-button>
      </div>

      <!-- Step 2：验证动画 -->
      <div v-else-if="step === 2" key="step2" class="card verifying-card">
        <div class="loading-ring">
          <div class="ring"></div>
          <div class="ring-inner"></div>
        </div>
        <h2>正在验证文件夹...</h2>
        <p class="desc animate-text">
          系统正在扫描 {{ folderName || "文件夹" }}
        </p>
      </div>

      <!-- Step 3：成功界面 -->
      <div v-else key="step3" class="card success-card">
        <el-icon class="icon success">
          <CircleCheckFilled />
        </el-icon>
        <h2>验证成功</h2>
        <p class="desc">文件夹 “{{ folderName || "未命名" }}” 验证通过，系统已激活</p>
        <el-button type="primary" round size="large" @click="enterBackend">
          进入后台
        </el-button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import {
  FolderOpened,
  FolderAdd,
  CircleCheckFilled,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useFileStore } from "@/store/file";
import { HealthCheckReport } from "@/models/health_check_logs";

const router = useRouter();
const fileStore = useFileStore();

const step = ref<number>(1);
const folderName = ref<string>("");
const folderInput = ref<HTMLInputElement | null>(null);

/** 打开文件夹选择器 */
const openFolderSelector = () => folderInput.value?.click();

/** 处理文件夹选择 */
const handleFolderUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];

  if (files.length === 0) {
    ElMessage.warning("未选择任何文件夹");
    return;
  }

  // 过滤 JSON 文件
  const jsonFiles = files.filter((file) => /\.json$/i.test(file.name));
  if (jsonFiles.length === 0) {
    ElMessage.error("该文件夹中未检测到 .json 文件");
    return;
  }

  // 获取文件夹名
  const relativePath = (jsonFiles[0] as any).webkitRelativePath || "";
  folderName.value = relativePath.split("/")[0] || "未知文件夹";

  await startVerification(jsonFiles);
}

/** 文件验证逻辑 */
const startVerification = async (jsonFiles: File[]) => {
  step.value = 2;

  try {
    const validateFiles = await HealthCheckReport.validateFiles(jsonFiles);
    if (!validateFiles.valid) {
      ElMessage.error(`验证失败：缺少 ${validateFiles.missing.join(", ")}`);
      step.value = 1;
      return;
    }
    const report = await HealthCheckReport.fromFiles(jsonFiles);
    fileStore.report = report;
    fileStore.folderName = folderName.value;
    fileStore.selected = true;
    step.value = 3;
    ElMessage.success("✅ 验证通过，系统已激活");
  } catch (error) {
    console.error(error);
    ElMessage.error("验证失败，请检查文件格式");
    step.value = 1;
  }
};

/** 进入后台 */
function enterBackend() {
  if (!fileStore.selected) {
    ElMessage.error("错误：文件夹未通过验证，无法进入后台");
    return;
  }
  router.push("/console");
  ElMessage.success("✅ 系统已激活，正在进入后台...");
}
</script>

<style scoped>
.activation-bg {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
  font-family: "Segoe UI", sans-serif;
}

/* 卡片容器 */
.card {
  width: 420px;
  padding: 40px;
  text-align: center;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

h2 {
  margin: 15px 0;
  color: #1f2937;
}

.desc {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 25px;
}

/* 按钮样式 */
.select-btn {
  font-size: 1rem;
  padding: 12px 28px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 图标 */
.icon {
  font-size: 3rem;
  color: #409eff;
  margin-bottom: 10px;
}

.success {
  color: #22c55e;
}

/* ✅ 加载圆环动画 */
.loading-ring {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.ring {
  width: 100%;
  height: 100%;
  border: 6px solid #e5e7eb;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.ring-inner {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 56px;
  height: 56px;
  border: 3px solid transparent;
  border-top-color: #93c5fd;
  border-radius: 50%;
  animation: spinReverse 1.5s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinReverse {
  to {
    transform: rotate(-360deg);
  }
}

/* 动画文字 */
.animate-text {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }
}

/* 成功状态 */
.success-card {
  border-top: 4px solid #22c55e;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
