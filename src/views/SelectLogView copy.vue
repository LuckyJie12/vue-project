<template>
  <div class="log-import-container">
    <div class="main-card">
      <div style="height: 600px">
        <el-container>
          <el-header style="height: 200px;">
            <!-- 头部标题区域 -->
            <div class="header-section">
              <div class="title-group">
                <h1 class="main-title">日志文件导入</h1>
                <p class="subtitle">选择包含日志文件的文件夹，系统将自动验证并分析性能数据</p>
              </div>
              <div class="step-indicator">
                <span class="step-text">步骤 {{ active + 1 }}/3</span>
              </div>
            </div>
            <!-- 步骤指示器 -->
            <el-steps :active="active" align-center class="custom-steps">
              <el-step title="选择文件夹" description="选择包含日志文件的目录" />
              <el-step title="文件验证" description="检查文件格式和内容有效性" />
              <el-step title="完成导入" description="准备性能分析报告" />
            </el-steps>
          </el-header>
          <el-container style="height: 400px;">
            <el-aside width="50%">
              <div class="left-panel">
                <div class="upload-area" @click="triggerFolderSelect" @drop.prevent="handleDrop"
                  @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false"
                  :class="{ 'drag-over': isDragOver }">
                  <div class="upload-content">
                    <div class="upload-icon">
                      <i class="el-icon-folder-opened"></i>
                    </div>
                    <h3 class="upload-title">选择日志文件夹</h3>
                    <p class="upload-desc">点击选择或拖拽文件夹到此区域</p>
                    <p class="file-types">支持 .json .txt 格式文件 (UTF-8编码)</p>

                    <div class="upload-hint" v-if="!selectedFiles.length">
                      <i class="el-icon-info"></i>
                      <span>系统将读取文件夹内所有符合条件的日志文件</span>
                    </div>
                  </div>
                </div>

                <!-- 隐藏的文件选择输入 -->
                <input id="folderInput" ref="folderInput" type="file" webkitdirectory directory multiple
                  style="display: none" @change="handleFolderSelection" />

                <!-- 操作按钮区域 -->
                <div class="action-section">
                  <div class="action-buttons">
                    <el-button type="primary" :loading="validating" :disabled="!selectedFiles.length"
                      @click="startValidation" class="validate-btn">
                      <i class="el-icon-check"></i>
                      {{ validating ? '验证中...' : '开始验证' }}
                    </el-button>

                    <el-button @click="clearSelection" :disabled="validating" class="clear-btn">
                      <i class="el-icon-delete"></i>
                      清除选择
                    </el-button>

                    <el-button type="success" :disabled="active !== 2" @click="goToAnalytics" class="analytics-btn">
                      <i class="el-icon-data-analysis"></i>
                      查看性能报告
                    </el-button>
                  </div>

                  <!-- 进度和状态显示 -->
                  <div class="status-section">
                    <div v-if="validating" class="progress-container">
                      <el-progress :percentage="validationProgress" :stroke-width="8" :show-text="true"
                        class="validation-progress" />
                      <p class="progress-text">正在验证文件 {{ processedFiles }}/{{ selectedFiles.length }}</p>
                    </div>

                    <div v-else-if="active === 2" class="success-status">
                      <i class="el-icon-success"></i>
                      <span>验证完成！所有文件已准备就绪</span>
                    </div>

                    <div v-else-if="selectedFiles.length > 0" class="ready-status">
                      <i class="el-icon-info"></i>
                      <span>已选择 {{ selectedFiles.length }} 个文件，点击验证开始处理</span>
                    </div>

                    <div v-else class="idle-status">
                      <i class="el-icon-question"></i>
                      <span>请选择包含日志文件的文件夹</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-aside>
            <el-main width="50%">
              <div class="right-panel" v-if="selectedFiles.length > 0">
                <div class="file-info-panel">
                  <div style="height: 120px;">
                    <div class="panel-header">
                      <h4>选中的文件夹</h4>
                      <el-tag type="success" size="small">{{ selectedFiles.length }} 个文件</el-tag>
                    </div>

                    <div class="folder-path">
                      <i class="el-icon-folder"></i>
                      <span class="path-text">{{ folderName }}</span>
                    </div>
                    <div class="list-header">
                      <span>文件列表</span>
                    </div>
                  </div>
                  <div class="file-list">
                    <el-scrollbar height="270">
                      <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                        <i class="el-icon-document" :class="getFileIcon(file.name)"></i>
                        <span class="file-name">{{ getFilePath(file) }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
              <!-- 空状态提示 -->
              <div class="right-panel empty-panel" v-else>
                <div class="empty-state">
                  <i class="el-icon-folder-opened"></i>
                  <h3>尚未选择文件夹</h3>
                  <p>请在左侧区域选择包含日志文件的文件夹</p>
                  <p class="empty-tip">支持 .json 和 .txt 格式的日志文件</p>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-container>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 响应式数据
const active = ref(0)
const selectedFiles = ref<File[]>([])
const validating = ref(false)
const validationProgress = ref(0)
const processedFiles = ref(0)
const isDragOver = ref(false)
const showAllFiles = ref(false)
const folderInput = ref<HTMLInputElement>()

// 计算属性
const folderName = computed(() => {
  if (selectedFiles.value.length > 0) {
    const firstFile = selectedFiles.value[0]
    return (firstFile as any).webkitRelativePath?.split('/')[0] || '选中文件夹'
  }
  return ''
})

// 方法定义
const triggerFolderSelect = () => {
  folderInput.value?.click()
}

const handleFolderSelection = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files).filter(file =>
    /\.(json|txt)$/i.test(file.name)
  )

  selectedFiles.value = files
  active.value = 0
  validationProgress.value = 0
  processedFiles.value = 0
  showAllFiles.value = files.length <= 15 // 文件较少时自动展开

  ElMessage.success(`成功选择文件夹，找到 ${files.length} 个日志文件`)
  input.value = '' // 重置input，允许重复选择同一文件夹
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  // 注意：直接拖放文件夹在浏览器中支持有限
  // 这里提示用户使用标准的选择方式
  if (event.dataTransfer?.items) {
    for (let i = 0; i < event.dataTransfer.items.length; i++) {
      const item = event.dataTransfer.items[i]
      if (item.kind === 'file') {
        ElMessage.info('检测到文件拖放，请使用"选择文件夹"按钮以获得最佳兼容性')
        break
      }
    }
  }
}

const getFileIcon = (fileName: string) => {
  return fileName.endsWith('.json') ? 'json-file' : 'text-file'
}

const getFilePath = (file: File) => {
  return (file as any).webkitRelativePath || file.name
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const startValidation = async () => {
  if (selectedFiles.value.length === 0) {
    ElMessage.warning('请先选择包含日志文件的文件夹')
    return
  }

  validating.value = true
  active.value = 1
  validationProgress.value = 0
  processedFiles.value = 0

  try {
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]

      // 模拟文件验证过程
      await new Promise(resolve => setTimeout(resolve, 200))

      const text = await file.text()
      // 简单的文件内容验证
      const isValid = typeof text === 'string' &&
        text.trim().length > 0 &&
        /[\w\d\{\}\[\]]/.test(text)

      if (!isValid) {
        throw new Error(`文件格式无效: ${file.name}`)
      }

      processedFiles.value = i + 1
      validationProgress.value = Math.floor(((i + 1) / selectedFiles.value.length) * 100)
    }

    // 验证完成
    validating.value = false
    active.value = 2
    ElMessage.success(`验证完成！所有 ${selectedFiles.value.length} 个文件均有效`)

  } catch (error) {
    validating.value = false
    active.value = 0
    validationProgress.value = 0
    ElMessage.error(error instanceof Error ? error.message : '文件验证失败')
  }
}

const clearSelection = async () => {
  if (validating.value) return

  if (selectedFiles.value.length > 0) {
    try {
      await ElMessageBox.confirm(
        '确定要清除已选择的文件吗？此操作不可撤销。',
        '确认清除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      selectedFiles.value = []
      active.value = 0
      validationProgress.value = 0
      showAllFiles.value = false
      ElMessage.info('已清除文件选择')

    } catch {
      // 用户取消操作
    }
  }
}

const goToAnalytics = () => {
  if (active.value !== 2) {
    ElMessage.warning('请先完成文件验证')
    return
  }

  router.push('/analytics')
}
</script>

<style scoped>
.el-header {
  border: 1px solid #e6ebf5 !important;
}

.el-main {
  padding: 0 !important;
}

.log-import-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-card {
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.title-group .main-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.title-group .subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

.step-indicator {
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #6c757d;
}

.custom-steps {
  margin: 32px 0;
}

.custom-steps :deep(.el-step__head) {
  font-size: 16px;
}

.custom-steps :deep(.el-step__title) {
  font-size: 14px;
  font-weight: 600;
}


.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 300px;
}

.right-panel {
  flex: 1;
  min-width: 300px;
}

/* 上传区域样式 */
.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}

.upload-area:hover {
  border-color: #409eff;
  background: #f0f7ff;
}

.upload-area.drag-over {
  border-color: #409eff;
  background: #ecf5ff;
  transform: scale(1.02);
}

.upload-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.upload-title {
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.upload-desc {
  color: #5a6c7d;
  margin: 0 0 4px 0;
}

.file-types {
  color: #8798a7;
  font-size: 12px;
  margin: 0 0 16px 0;
}

.upload-hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0f7ff;
  padding: 8px 16px;
  border-radius: 6px;
  color: #409eff;
  font-size: 12px;
}

/* 文件信息面板样式 */
.file-info-panel {
  border-radius: 12px;
  background: #fafbfc;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
}

.folder-path {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #e6ebf5;
}

.path-text {
  color: #5a6c7d;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  word-break: break-all;
}

.file-list {
  background: white;
  border-radius: 6px;
  border: 1px solid #e6ebf5;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e6ebf5;
  font-weight: 600;
  color: #2c3e50;
}

.files-container {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.2s;
}

.file-item:hover {
  background: #f8f9fa;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item .json-file {
  color: #f39c12;
}

.file-item .text-file {
  color: #3498db;
}

.file-name {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #5a6c7d;
  word-break: break-all;
}

.file-size {
  color: #8798a7;
  font-size: 11px;
  white-space: nowrap;
}

.files-summary {
  padding: 20px;
  text-align: center;
  color: #8798a7;
  font-size: 14px;
}

.sample-files {
  margin-top: 12px;
  text-align: left;
}

.more-files {
  text-align: center;
  padding: 8px;
  color: #a0a0a0;
  font-style: italic;
}

/* 空状态面板 */
.empty-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: #a0a0a0;
  padding: 40px 20px;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 16px;
  color: #dcdfe6;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #7f8c8d;
}

.empty-state p {
  margin: 4px 0;
  font-size: 14px;
}

.empty-tip {
  font-size: 12px !important;
  color: #bdc3c7;
}

/* 操作按钮区域 */
.action-section {
  border-top: 1px solid #e6ebf5;
  padding-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.validate-btn,
.analytics-btn,
.clear-btn {
  padding: 12px 20px;
  font-weight: 600;
  min-width: 120px;
}

.status-section {
  text-align: center;
}

.progress-container {
  margin: 0 auto;
}

.validation-progress {
  margin-bottom: 8px;
}

.progress-text {
  color: #5a6c7d;
  font-size: 14px;
  margin: 0;
}

.success-status,
.ready-status,
.idle-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 500;
}

.success-status {
  background: #f0f9ff;
  color: #67c23a;
}

.ready-status {
  background: #f0f7ff;
  color: #409eff;
}

.idle-status {
  background: #f8f9fa;
  color: #6c757d;
}

</style>