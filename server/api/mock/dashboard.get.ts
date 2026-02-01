import type { GetDashboardResponse } from '~/types/dashboard'

// Mock Dashboard Data
// 遵循 Greenfield Strategy，由前端定義理想資料結構
// 此 Mock API 作為後端實作的 Reference Spec

export default defineEventHandler(async (_event): Promise<GetDashboardResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    user: {
      id: 'user-mock-001',
      nickname: '焦慮小明',
      role: 'escapee',
      status: 'online',
      avatarUrl: undefined
    },
    rescueRequests: [
      {
        id: 'rescue-001',
        type: 'emergency',
        stressLevel: 4,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rescue-002',
        type: 'scheduled',
        stressLevel: 2,
        status: 'matched',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        matchedHelper: {
          id: 'helper-001',
          nickname: '專業閒人阿華',
          rating: 4.8
        }
      }
    ],
    notifications: {
      unreadCount: 3,
      recent: [
        {
          id: 'notif-001',
          type: 'rescue_match',
          title: '已為您匹配到 Helper！',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'notif-002',
          type: 'survival_check',
          title: '生存確認：今天還好嗎？',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    }
  }
})
