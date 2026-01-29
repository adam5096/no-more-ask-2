// 全域導航守衛：檢查認證狀態
// 若無 token 且非首頁，則跳轉至首頁

/**
 * 權限決策邏輯 (純函數)
 * 將導航意圖與狀態轉換為明確的動作
 */
export type AuthAction = 'allow' | 'redirect-home'

export function resolveAuthAction(
  meta: { public?: boolean; devOnly?: boolean },
  path: string,
  matchedCount: number,
  auth: { isAuthenticated: boolean; isDev: boolean }
): AuthAction {
  // 1. 公開頁面檢查 (顯式宣告 public: true)
  if (meta.public === true) {
    return 'allow'
  }

  // 2. 開發期繞過檢查 (僅在開發環境且宣告 devOnly: true 時生效)
  if (auth.isDev && meta.devOnly === true) {
    return 'allow'
  }

  // 3. 預設例外：首頁 (可視為隱性公開)
  if (path === '/') {
    return 'allow'
  }

  // 4. 404 智慧攔截：已登入者放行至 error.vue (UX 優化)
  // 此處邏輯隱含了 path 不為 / 且非 public 的前提
  if (matchedCount === 0 && auth.isAuthenticated) {
    return 'allow'
  }

  // 5. 安全檢查：未登入者或嘗試探測不存在路徑者，一律重定向至首頁
  if (!auth.isAuthenticated || matchedCount === 0) {
    return 'redirect-home'
  }

  return 'allow'
}

/**
 * 全域導航守衛
 * 負責注入 Nuxt 環境依賴並執行決策動作
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  const action = resolveAuthAction(
    to.meta as any,
    to.path,
    to.matched.length,
    {
      isAuthenticated: !!isAuthenticated.value,
      isDev: !!import.meta.dev
    }
  )

  if (action === 'redirect-home') {
    return navigateTo('/')
  }
})
