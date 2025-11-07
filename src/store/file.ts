import { ref, watch } from "vue";
import { defineStore } from "pinia";
import type { HealthCheckReport } from "@/models/health_check_logs";

export const useFileStore = defineStore("file", () => {
  /** 是否通过验证 */
  const selected = ref<boolean>(false);

  /** 验证结果报告 */
  const report = ref<HealthCheckReport | null>(null);

  /** 文件夹名称（便于显示） */
  const folderName = ref<string>("");

  /** 启动时从 localStorage 读取缓存 */
  const saved = localStorage.getItem("activationReport");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      report.value = data.report;
      selected.value = true;
      folderName.value = data.folderName;
    } catch {
      console.warn("⚠️ 无法解析本地激活缓存");
    }
  }

  /** 当验证成功后，自动保存到 localStorage */
  watch(
    [selected, report],
    ([sel, rep]) => {
      if (sel && rep) {
        localStorage.setItem(
          "activationReport",
          JSON.stringify({
            selected: true,
            report: rep,
            folderName: folderName.value,
          })
        );
      }
    },
    { deep: true }
  );

  /** 清空缓存（可用于登出或重新验证） */
  const reset = () => {
    selected.value = false;
    report.value = null;
    folderName.value = "";
    localStorage.removeItem("activationReport");
  };

  return { selected, report, folderName, reset };
});
