import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

/**
 * 遠端 API 請求封裝
 * 自動注入 Base URL，並可在此處處理統一的實例化標頭或錯誤邏輯
 */
export const $remoteFetch = <T>(
  path: NitroFetchRequest,
  options: NitroFetchOptions<NitroFetchRequest> = {}
) => {
  const config = useRuntimeConfig()
  const baseURL = config.remoteApiBase

  return $fetch<T>(path, {
    baseURL,
    ...options,
  })
}
