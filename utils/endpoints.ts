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
