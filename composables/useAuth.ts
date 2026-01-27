// 認證邏輯層：Token 管理、用戶狀態、認證狀態
// 根據專案規範：使用 useCookie 作為 token 的單一真相來源

interface User {
  email: string
  userId: string
}

export const useAuth = () => {
  // Token 管理：使用 useCookie 作為單一真相來源（SSR 友善）
  const token = useCookie<string | null>('auth_token', {
    default: () => null,
    secure: true,
    sameSite: 'strict',
    httpOnly: false // 需要在前端讀取
  })

  // 用戶狀態：使用 useState 儲存用戶資料（跨元件共享）
  const user = useState<User | null>('user', () => null)

  // 認證狀態：使用 computed 自動計算（永遠與實際狀態同步）
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  // 登入方法：發送 API 請求並儲存狀態
  const login = async (credentials: { email: string; password: string }) => {
    const response = await $fetch<{ token: string; email: string; userId: string }>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: credentials
      }
    )

    // 儲存狀態
    token.value = response.token
    user.value = {
      email: response.email,
      userId: response.userId
    }

    return response
  }

  // 註冊方法：發送 API 請求並儲存狀態
  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    displayName?: string
  }) => {
    const response = await $fetch<{ email: string; userId: string }>(
      '/api/v1/auth/register',
      {
        method: 'POST',
        body: userData
      }
    )

    // 儲存狀態
    user.value = {
      email: response.email,
      userId: response.userId
    }

    return response
  }

  // 登出方法：調用 BFF API 後清空 token 和用戶狀態
  const logout = async () => {
    try {
      // 調用 BFF 登出 API
      await $fetch('/api/v1/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      // 即使 API 失敗，仍然清空本地狀態（防止卡在已登出但前端顯示已登入）
      console.error('登出 API 失敗:', error)
    } finally {
      // 清空本地狀態
      token.value = null
      user.value = null
      
      // 跳轉至首頁
      await navigateTo('/')
    }
  }

  // 獲取用戶資料（可選：從 API 獲取）
  const fetchUser = async () => {
    // 如果 token 存在但用戶資料為空，可以從 API 獲取
    if (token.value && !user.value) {
      // TODO: 實作從 API 獲取用戶資料的邏輯
      // const userData = await $fetch('/api/v1/user/profile')
      // user.value = userData
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser
  }
}
