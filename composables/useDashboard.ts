// Dashboard 資料抓取 Composable
// 遵循專案 Composable 規範：使用 useAsyncData 進行 SSR 友善的資料載入

import type { GetDashboardResponse } from '~/types/dashboard'

/**
 * useDashboard - 儀表板資料獲取 Composable
 * 
 * 設計原則：
 * 1. 使用 useAsyncData 確保 SSR 與 Hydration 一致性
 * 2. 提供 Loading / Error / Data 三態管理
 * 3. 資料來源為 Mock API，未來可無縫切換至正式 API
 */
export const useDashboard = () => {
  const {
    data: dashboardData,
    status,
    error,
    refresh
  } = useAsyncData<GetDashboardResponse>(
    'dashboard', // Unique key for caching
    () => $fetch<GetDashboardResponse>('/api/mock/dashboard'),
    {
      // 預設不立即執行，由呼叫端控制
      lazy: true
    }
  )

  // Computed: 便捷存取子物件
  const user = computed(() => dashboardData.value?.user ?? null)
  const rescueRequests = computed(() => dashboardData.value?.rescueRequests ?? [])
  const notifications = computed(() => dashboardData.value?.notifications ?? { unreadCount: 0, recent: [] })

  // Loading state
  const isLoading = computed(() => status.value === 'pending')

  return {
    // Raw data
    dashboardData,
    
    // Computed accessors
    user,
    rescueRequests,
    notifications,
    
    // State
    isLoading,
    error,
    
    // Actions
    refresh
  }
}
