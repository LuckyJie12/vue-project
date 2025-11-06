import { ref } from 'vue'
import { defineStore } from 'pinia'
const STORAGE_NAME = 'hk_logs'

export const useFileStore = defineStore('file', () => {
  const selected = ref<boolean>(false)
  const folderName = ref<string | null>(null)
  const fileCount = ref<number>(0)

  return { selected, folderName, fileCount }
  // return { selected, fileName, fileCount, initFromDB, setFiles, clearFiles }
})