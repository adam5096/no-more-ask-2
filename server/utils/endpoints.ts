/**
 * 外部後端 API 端點清單 (Remote API)
 * 此檔案僅在伺服器端 (Nitro) 執行，不會被打包進前端 JS。
 */
export const REMOTE_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    LOGOUT: '/Auth/logout'
  }
} as const

export type RemoteEndpoint = typeof REMOTE_ENDPOINTS
