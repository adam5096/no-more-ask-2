import type { GetMapRescueRequestsResponse, RescueRequestLocation } from '~/types/map'

// Mock 救援請求位置 (個人圖層)
const mockRequests: RescueRequestLocation[] = [
  {
    id: 'rescue-001',
    type: 'emergency',
    stressLevel: 4,
    status: 'pending',
    createdAt: new Date().toISOString(),
    location: { latitude: 25.0330, longitude: 121.5654 },
    districtId: 'taipei-xinyi'
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
    },
    location: { latitude: 25.0264, longitude: 121.5435 },
    districtId: 'taipei-daan'
  }
]

export default defineEventHandler(async (_event): Promise<GetMapRescueRequestsResponse> => {
  // TODO: 驗證用戶身份，只回傳該用戶的請求
  await new Promise(resolve => setTimeout(resolve, 250))

  return {
    requests: mockRequests
  }
})
