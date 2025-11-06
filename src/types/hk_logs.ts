/**
 * @file hk_logs.ts
 * @description 系统健康检查报告数据模型
 */

/**
 * 活跃用户数量日志
 */
export interface ActiveUserCountLog {
  /** 记录时间 */
  entry_date: Date
  /** 当前活跃用户数量 */
  applicationActiveuser: number
}

/**
 * 活跃用户明细日志
 */
export interface ActiveUserLog {
  /** 记录时间 */
  entry_date: Date
  /** 登录用户名 */
  login_name: string
  /** 用户全名 */
  keyed_name: string
  /** 登录 IP */
  ip: string
  /** 登录次数或计数 */
  count: string
}

/**
 * 循环引用检测日志
 */
export interface CircularReferenceLog {
  /** 记录时间 */
  entry_date: Date
  /** 类型名称 */
  type: string
  /** 来源项 */
  source_keyed_name: string
  /** 关联项 */
  related_keyed_name: string
  /** 修改人 */
  modified_by_id: string
  /** 修改时间 */
  modified_on: string
  /** 所有者 */
  owned_by_id: string
  /** 主版本 */
  major_rev: string
  /** 版本号 */
  generation: string
}

/**
 * ItemType 属性过载日志
 */
export interface ItemTypeOverloadLog {
  /** 记录时间 */
  entry_date: Date
  /** 超出属性数 */
  greater_property_count: string
  /** 超出 Item 属性数 */
  greater_Item_property_count: string
}

/**
 * 表单字段过载日志
 */
export interface FormFieldOverloadLog {
  /** 记录时间 */
  entry_date: Date
  /** ItemType 名称 */
  greater_formfd_itemtype: string
  /** 表单名称 */
  greater_form_name: string
  /** 字段数量 */
  count: string
  /** 值数量 */
  valuecount: string
  /** 筛选列表数量 */
  filterlistcount: string
}

/**
 * 调试方法日志
 */
export interface DebugMethodLog {
  /** 记录时间 */
  entry_date: Date
  /** 方法名称 */
  method_name: string
  /** 方法类型（C#/JS等） */
  method_type: string
  /** 修改人 */
  modified_by_id: string
  /** 修改时间 */
  modified_on: string
  /** 所有者 */
  owned_by_id: string
  /** 主版本 */
  major_rev: string
  /** 版本号 */
  generation: string
}

/**
 * 方法代码验证日志
 */
export interface MethodValidationLog {
  /** 记录时间 */
  entry_date: Date
  /** 方法名称 */
  method_name: string
  /** 方法类型（C#/JS等） */
  method_type: string
  /** 修改人 */
  modified_by_id: string
  /** 修改时间 */
  modified_on: string
  /** 所有者 */
  owned_by_id: string
  /** 主版本 */
  major_rev: string
  /** 版本号 */
  generation: string
  /** 错误信息或内容 */
  content: string
}

/* =============================
 * 📦 工具常量与类型
 * ============================= */

/**
 * 系统要求存在的日志文件名列表
 */
export const REQUIRED_LOG_FILES = [
  "HC_Monitor_ActiveUsersCount_result.json",
  "HC_Monitor_ActiveUsers_result.json",
  "HC_Detect_CircularReference_result.json",
  "HC_Check_ItemType_FieldOverload_result.json",
  "HC_Check_FormField_Overload_result.json",
  "HC_Check_DebugMethods_result.json",
  "HC_Validate_MethodCode_result.json",
] as const

/** 日志文件名类型 */
export type LogFileName = typeof REQUIRED_LOG_FILES[number]

/* =============================
 * 🧾 HealthCheckReport 主类
 * ============================= */

/**
 * @class HealthCheckReport
 * @description 系统健康检查报告聚合类，包含所有日志数据及相关验证逻辑。
 * 
 * 提供：
 * - 文件名校验（validateFiles）
 * - 文件解析（fromFiles）
 * - 报告对象构建（fromJsonMap）
 * - 快捷统计接口（getActiveUserCount 等）
 */
export class HealthCheckReport {
  /** 活跃用户数量日志 */
  activeUserCount: ActiveUserCountLog[] = []

  /** 活跃用户明细日志 */
  activeUsers: ActiveUserLog[] = []

  /** 循环引用检测日志 */
  circularReferences: CircularReferenceLog[] = []

  /** ItemType 属性过载日志 */
  itemTypeOverloads: ItemTypeOverloadLog[] = []

  /** 表单字段过载日志 */
  formFieldOverloads: FormFieldOverloadLog[] = []

  /** 调试方法日志 */
  debugMethods: DebugMethodLog[] = []

  /** 方法代码验证日志 */
  methodValidations: MethodValidationLog[] = []

  /**
   * 文件名与类属性映射表
   * 用于自动将文件内容注入到对应属性
   */
  private static fileMap: Record<LogFileName, keyof HealthCheckReport> = {
    "HC_Monitor_ActiveUsersCount_result.json": "activeUserCount",
    "HC_Monitor_ActiveUsers_result.json": "activeUsers",
    "HC_Detect_CircularReference_result.json": "circularReferences",
    "HC_Check_ItemType_FieldOverload_result.json": "itemTypeOverloads",
    "HC_Check_FormField_Overload_result.json": "formFieldOverloads",
    "HC_Check_DebugMethods_result.json": "debugMethods",
    "HC_Validate_MethodCode_result.json": "methodValidations",
  }

  /**
   * 根据 JSON 对象映射生成报告实例
   * @param map - 文件名到 JSON 内容的映射表
   * @returns HealthCheckReport 实例
   */
  static fromJsonMap(map: Record<string, any>): HealthCheckReport {
    const report = new HealthCheckReport()
    for (const key of REQUIRED_LOG_FILES) {
      const property = this.fileMap[key]
      report[property] = map[key] ?? []
    }
    return report
  }

  /**
   * 校验文件是否齐全
   * @param files - 用户上传的文件列表
   * @returns 校验结果：{ valid, missing }
   */
  static validateFiles(files: File[]): { valid: boolean; missing: string[] } {
    const fileNames = files.map(f => f.name)
    const missing = REQUIRED_LOG_FILES.filter(name => !fileNames.includes(name))
    return { valid: missing.length === 0, missing }
  }

  /**
   * 从浏览器 FileList 异步读取并解析所有日志文件
   * @param files - 用户上传的文件数组
   * @returns Promise<HealthCheckReport> 实例
   */
  static async fromFiles(files: File[]): Promise<HealthCheckReport> {
    const map: Record<string, any> = {}
    for (const file of files) {
      try {
        const text = await file.text()
        map[file.name] = JSON.parse(text)
      } catch (err) {
        console.warn(`❌ 解析失败: ${file.name}`, err)
      }
    }
    return HealthCheckReport.fromJsonMap(map)
  }

  /* =============================
   * 📊 快捷统计方法
   * ============================= */

  /**
   * 获取当前活跃用户数量
   */
  getActiveUserCount(): number {
    return this.activeUserCount[0]?.applicationActiveuser ?? 0
  }

  /**
   * 获取活跃用户数量（登录用户）
   */
  getLoginUserCount(): number {
    return this.activeUsers.length
  }

  /**
   * 检查是否存在循环引用记录
   */
  hasCircularReference(): boolean {
    return this.circularReferences.length > 0
  }

  /**
   * 获取调试方法数量
   */
  getDebugMethodCount(): number {
    return this.debugMethods.length
  }

  /**
   * 检查方法验证中是否存在错误代码
   */
  hasCodeError(): boolean {
    return this.methodValidations.some(log => log.content?.includes("错误"))
  }
}
