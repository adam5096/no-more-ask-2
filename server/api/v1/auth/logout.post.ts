// BFF 層：會員登出 API 代理
// 代理外部後端 API：https://lazypeople.zeabur.app/api/Auth/logout

export default defineEventHandler(async (event) => {
  try {
    // 從 cookie 讀取 token
    const token = getCookie(event, 'auth_token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        data: {
          message: '未提供認證 token'
        }
      })
    }

    // 代理請求至外部後端 API，在 Header 中帶上 token
    const response = await $fetch<{ message: string }>(
      'https://lazypeople.zeabur.app/api/Auth/logout',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // 返回成功回應
    return response
  } catch (error: any) {
    // 統一錯誤處理
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Logout Failed',
      data: {
        message: error.data?.message || error.message || '登出失敗，請稍後再試'
      }
    })
  }
})
