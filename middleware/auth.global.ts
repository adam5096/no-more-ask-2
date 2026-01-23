// 全域導航守衛：檢查認證狀態
// 若無 token 且非首頁，則跳轉至首頁

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // 如果未登入且目標頁面不是首頁，則跳轉至首頁
  if (!isAuthenticated.value && to.path !== '/') {
    return navigateTo('/')
  }
})
