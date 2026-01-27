// BFF 層：會員註冊 API 代理
// 代理外部後端 API

import { toApiError, type FieldErrors } from '~/types/api-error'

// 型別定義
interface RegisterDTO {
  email: string
  password: string
  firstName: string
  lastName: string
  displayName: string | null
}

interface RegisterResponse {
  email: string
  userId: string
  token?: string
}

// FieldErrors 從 ~/types/api-error 導入

export default defineEventHandler(async (event) => {
  try {
    // 讀取請求體
    const body = await readBody<RegisterDTO>(event)

    // 處理 displayName：空值轉換為 null
    const processedBody: RegisterDTO = {
      ...body,
      displayName: body.displayName?.trim() || null
    }

    // 代理請求至外部後端 API
    const response = await $remoteFetch<RegisterResponse>(
      REMOTE_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: processedBody
      }
    )

    // 返回成功回應（僅返回必要資訊）
    return {
      email: response.email,
      userId: response.userId
    }
  } catch (err: unknown) {
    const error = toApiError(err)
    // 統一錯誤處理
    // 處理欄位級別錯誤
    if (error.data?.errors) {
      throw createError({
        statusCode: error.statusCode || 400,
        statusMessage: error.statusMessage || 'Validation Error',
        data: {
          errors: error.data.errors as FieldErrors
        }
      })
    }

    // 處理一般錯誤
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: {
        message: error.data?.message || error.message || '註冊失敗，請稍後再試'
      }
    })
  }
})
