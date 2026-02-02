// B1 救援功能 Types (v1)
// 依據 ORCA Discovery 訪談結果定義

// ============================================
// Core Objects
// ============================================

/**
 * 救援請求狀態
 */
export type RescueRequestStatus =
  | 'draft'      // 草稿，尚未送出
  | 'pending'    // 已送出，等待 Helper 確認
  | 'confirmed'  // Helper 已確認
  | 'completed'  // 救援完成
  | 'cancelled'  // 已取消

/**
 * 壓力等級 (1-5)
 * 1 = 輕微不適
 * 5 = 極度煎熬
 */
export type StressLevel = 1 | 2 | 3 | 4 | 5

/**
 * 惱人問題
 */
export interface AnnoyingQuestion {
  /** 問題內容 */
  content: string

  /** 建議回答 (Helper 可參考) */
  suggestedResponse?: string
}

/**
 * 場景描述
 */
export interface RescueScenario {
  /** 場景描述文字 */
  description: string

  /** 預期在場人員 */
  expectedParticipants?: string
}

/**
 * 救援請求 - 完整版 (詳情頁/編輯頁使用)
 */
export interface RescueRequest {
  id: string

  /** 請求狀態 */
  status: RescueRequestStatus

  /** 預約日期時間 */
  scheduledDate: string // ISO 8601

  /** 預計時長 (小時) */
  duration: number

  /** 壓力等級 */
  stressLevel: StressLevel

  /** 地點描述 */
  location: string

  /** 需要什麼幫助 */
  helpNeeded: string

  /** 場景描述 */
  scenario?: RescueScenario

  /** 預期的惱人問題 */
  questions: AnnoyingQuestion[]

  /** 其他備註 */
  notes?: string

  /** 已選擇的 Helper (手動配對後填入) */
  assignedHelperId?: string

  /** 建立時間 */
  createdAt: string // ISO 8601

  /** 更新時間 */
  updatedAt: string // ISO 8601
}

// ============================================
// API Contracts
// ============================================

/**
 * POST /api/rescue - 建立救援請求 (Client → Server)
 */
export interface CreateRescueRequest {
  scheduledDate: string
  duration: number
  stressLevel: StressLevel
  location: string
  helpNeeded: string
  scenario?: RescueScenario
  questions?: AnnoyingQuestion[]
  notes?: string
}

/**
 * POST /api/rescue - 建立救援請求 (Server → Client)
 */
export interface CreateRescueResponse {
  success: boolean
  request: RescueRequest
}

/**
 * GET /api/rescue/:id - 取得救援詳情 (Server → Client)
 */
export interface GetRescueResponse {
  request: RescueRequest
}

/**
 * PATCH /api/rescue/:id - 更新救援 (Client → Server)
 */
export interface UpdateRescueRequest {
  scheduledDate?: string
  duration?: number
  stressLevel?: StressLevel
  location?: string
  helpNeeded?: string
  scenario?: RescueScenario
  questions?: AnnoyingQuestion[]
  notes?: string
  assignedHelperId?: string
}

/**
 * PATCH /api/rescue/:id/status - 更新救援狀態 (Client → Server)
 */
export interface UpdateRescueStatusRequest {
  status: RescueRequestStatus
}

/**
 * DELETE /api/rescue/:id - 取消救援 (Server → Client)
 */
export interface CancelRescueResponse {
  success: boolean
}
