// Dashboard Data Contract (Greenfield Strategy)
// 此檔案作為前後端協作的 Contract，定義 Dashboard 相關的資料結構。
// 命名規範：*Request (Client -> Server), *Response (Server -> Client)

// ============================================
// Core Objects (ORCA Blue Notes)
// ============================================

/**
 * User Object - 最小化用戶資訊，用於儀表板顯示
 */
export interface UserMinimal {
  id: string
  nickname: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string
}

export type UserRole = 'escapee' | 'helper' | 'woke_elder' | 'silent_buffer' | 'urban_loner'

export type UserStatus = 'online' | 'offline' | 'busy'

/**
 * RescueRequest Object - 救援請求預覽，用於儀表板列表
 */
export interface RescueRequestPreview {
  id: string
  type: RescueRequestType
  stressLevel: number // 1-5
  status: RescueRequestStatus
  createdAt: string // ISO 8601
  matchedHelper?: HelperMinimal
}

export type RescueRequestType = 'emergency' | 'scheduled' | 'consultation'

export type RescueRequestStatus = 'pending' | 'matched' | 'in_progress' | 'completed' | 'cancelled'

/**
 * Helper Object - 最小化 Helper 資訊
 */
export interface HelperMinimal {
  id: string
  nickname: string
  avatarUrl?: string
  rating: number // 0-5
}

/**
 * Notification Object - 通知預覽
 */
export interface NotificationPreview {
  id: string
  type: NotificationType
  title: string
  isRead: boolean
  createdAt: string // ISO 8601
}

export type NotificationType = 'rescue_match' | 'survival_check' | 'gathering_invite' | 'helper_request'

// ============================================
// API Contracts (Request / Response)
// ============================================

/**
 * GET /api/dashboard - 儀表板聚合資料回應
 */
export interface GetDashboardResponse {
  user: UserMinimal
  rescueRequests: RescueRequestPreview[]
  notifications: {
    unreadCount: number
    recent: NotificationPreview[]
  }
}

/**
 * PATCH /api/user/profile - 更新用戶資料請求
 */
export interface UpdateProfileRequest {
  nickname?: string
  avatarUrl?: string
  status?: UserStatus
}

/**
 * PATCH /api/user/profile - 更新用戶資料回應
 */
export interface UpdateProfileResponse {
  success: boolean
  user: UserMinimal
}
