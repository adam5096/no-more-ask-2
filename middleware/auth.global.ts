// 全域導航守衛：檢查認證狀態
// 若無 token 且非首頁，則跳轉至首頁

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // 1. 公開頁面檢查 (顯式宣告 public: true)
  if (to.meta.public === true) {
    return
  }

  // 2. 開發期繞過檢查 (僅在開發環境且宣告 devOnly: true 時生效)
  if (import.meta.dev && to.meta.devOnly === true) {
    return
  }

  // 3. 預設例外：首頁 (可視為隱性公開，或強制要求首頁也加 public: true)
  if (to.path === '/') {
    return
  }

  // 4. 認證檢查：未登入者重定向至首頁
  if (!isAuthenticated.value) {
    return navigateTo('/')
  }
})

