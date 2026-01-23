// BFF 層：會員註冊 API 代理
// 代理外部後端 API：https://lazypeople.zeabur.app/api/Auth/register

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

interface FieldErrors {
  email?: string[]
  password?: string[]
  firstName?: string[]
  lastName?: string[]
  displayName?: string[]
}

interface ErrorResponse {
  errors?: FieldErrors
  message?: string
}

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
    const response = await $fetch<RegisterResponse>(
      'https://lazypeople.zeabur.app/api/Auth/register',
      {
        method: 'POST',
        body: processedBody,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    // 返回成功回應（移除 token，僅返回必要資訊）
    const { token, ...safeResponse } = response
    return safeResponse
  } catch (error: any) {
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
