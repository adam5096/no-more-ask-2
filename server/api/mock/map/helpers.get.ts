import type { GetMapHelpersResponse, HelperLocation } from '~/types/map'

// Mock Helper 位置 (僅顯示位置公開的 Helper)
const mockHelpers: HelperLocation[] = [
  {
    id: 'helper-001',
    nickname: '專業閒人阿華',
    rating: 4.8,
    location: { latitude: 25.0421, longitude: 121.5520 },
    isLocationPublic: true
  },
  {
    id: 'helper-002',
    nickname: '傾聽者小美',
    rating: 4.5,
    location: { latitude: 25.0580, longitude: 121.5380 },
    isLocationPublic: true
  },
  {
    id: 'helper-003',
    nickname: '溫暖大叔老王',
    rating: 4.9,
    location: { latitude: 25.0720, longitude: 121.5190 },
    isLocationPublic: true
  }
]

export default defineEventHandler(async (_event): Promise<GetMapHelpersResponse> => {
  // TODO: 驗證用戶身份
  await new Promise(resolve => setTimeout(resolve, 200))

  // 只回傳位置公開的 Helper
  const publicHelpers = mockHelpers.filter(h => h.isLocationPublic)

  return {
    helpers: publicHelpers
  }
})
