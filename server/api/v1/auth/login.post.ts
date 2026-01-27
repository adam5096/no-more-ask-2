// BFF 層：會員登入 API 代理
// 代理外部後端 API

import { toApiError } from '~/types/api-error'

// 型別定義
interface LoginDTO {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  email: string
  userId: string
}

export default defineEventHandler(async (event) => {
  try {
    // 讀取請求體
    const body = await readBody<LoginDTO>(event)

    // 代理請求至外部後端 API
    const response = await $remoteFetch<LoginResponse>(
      REMOTE_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body
      }
    )

    // 返回成功回應（包含 token，由前端 composable 處理存儲）
    return response
  } catch (err: unknown) {
    const error = toApiError(err)
    // 統一錯誤處理
    // 處理欄位級別錯誤或認證錯誤
    if (error.data?.errors || error.statusCode === 401) {
      throw createError({
        statusCode: error.statusCode || 400,
        statusMessage: error.statusMessage || 'Authentication Failed',
        data: {
          errors: error.data?.errors || { message: ['帳號或密碼錯誤'] }
        }
      })
    }

    // 處理一般錯誤
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: {
        message: error.data?.message || error.message || '登入失敗，請稍後再試'
      }
    })
  }
})
