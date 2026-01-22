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

  // 登入方法：儲存 token 和用戶資料
  const login = (authToken: string, userData: User) => {
    token.value = authToken
    user.value = userData
  }

  // 註冊方法：儲存 token 和用戶資料（與登入相同邏輯）
  const register = (authToken: string, userData: User) => {
    token.value = authToken
    user.value = userData
  }

  // 登出方法：清空 token 和用戶狀態
  const logout = () => {
    token.value = null
    user.value = null
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
