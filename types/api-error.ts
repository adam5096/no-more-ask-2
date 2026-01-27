// 共用 API 錯誤類型定義
// 用於 BFF 層統一錯誤處理

export interface FieldErrors {
  email?: string[]
  password?: string[]
  firstName?: string[]
  lastName?: string[]
  displayName?: string[]
  message?: string[]
}

export interface ApiError {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: {
    errors?: FieldErrors
    message?: string
  }
}

/**
 * 將 unknown 錯誤轉換為 ApiError
 */
export function toApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null) {
    return error as ApiError
  }
  return { message: String(error) }
}
