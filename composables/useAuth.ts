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

  // 用戶基本資訊持久化：解決重新整理後 UI 狀態丟失
  const userInfoCookie = useCookie<User | null>('user_info', {
    default: () => null,
    secure: true,
    sameSite: 'strict'
  })

  // 用戶狀態：使用 useState 儲存用戶資料（跨元件共享）
  // 初始化時優先從 Cookie 恢復，確保補水一致性
  const user = useState<User | null>('user', () => userInfoCookie.value)

  // 認證狀態：使用 computed 自動計算（永遠與實際狀態同步）
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  // 登入方法：發送 API 請求並儲存狀態
  const login = async (credentials: { email: string; password: string }) => {
    const response = await $fetch<{ token: string; email: string; userId: string }>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: credentials
      }
    )

    // 儲存狀態到記憶體與 Cookie
    const userData = {
      email: response.email,
      userId: response.userId
    }
    
    token.value = response.token
    user.value = userData
    userInfoCookie.value = userData

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
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: userData
      }
    )

    // 儲存狀態
    const newUser = {
      email: response.email,
      userId: response.userId
    }
    user.value = newUser
    userInfoCookie.value = newUser

    return response
  }

  // 登出方法：調用 BFF API 後清空 token 和用戶狀態
  const logout = async () => {
    try {
      // 根據 /useFetch 規範：在事件中使用 $fetch
      // 確保 API 響應後才進行本地銷毀
      await $fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST'
      })
      
      // 清空本地狀態
      token.value = null
      user.value = null
      userInfoCookie.value = null
      
      // 跳轉至首頁
      await navigateTo('/')
    } catch (error) {
      // 防禦性處理：即使 API 失敗，若 token 已無效也應清空本地
      console.error('登出 API 失敗:', error)
      // 視專案治理政策決定是否強制清空
      token.value = null
      user.value = null
      userInfoCookie.value = null
      await navigateTo('/')
    }
  }

  // 獲取用戶資料（可選：從 API 獲取）
  const fetchUser = async () => {
    // 如果 token 存在但用戶資料為空，可以從 API 獲取
    if (token.value && !user.value) {
      // TODO: 實作從 API 獲取用戶資料的邏輯
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
