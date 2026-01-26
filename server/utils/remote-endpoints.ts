/**
 * 外部後端 API 端點清單
 * 未來後端更動路徑時，工程師僅需修改此處
 */
export const REMOTE_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    LOGOUT: '/Auth/logout'
  },
} as const

export type RemoteEndpoint = typeof REMOTE_ENDPOINTS
