import type { FetchOptions } from 'ofetch'

/**
 * 遠端 API 請求封裝
 * 自動注入 Base URL，並可在此處處理統一的實例化標頭或錯誤邏輯
 */
export const $remoteFetch = <T>(path: string, options: FetchOptions = {}) => {
  const config = useRuntimeConfig()
  const baseURL = config.remoteApiBase

  return $fetch<T>(path, {
    baseURL,
    ...options,
    // 如果未來需要統一處理 401 或日誌，可以在這裡擴充
  })
}
