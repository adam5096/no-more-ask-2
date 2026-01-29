/**
 * API 端點統一彙整
 * 包含前端呼叫 BFF 的端點以及 BFF 呼叫外部後端的端點
 */

// 前端呼叫 BFF 的端點 (Local API)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout'
  }
} as const

// BFF 代理呼叫外部後端的端點 (Remote API)
// 保持與 server/utils/remote-endpoints.ts 一致，或未來整合至此
export const REMOTE_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    LOGOUT: '/Auth/logout'
  }
} as const

export type RemoteEndpoint = typeof REMOTE_ENDPOINTS
