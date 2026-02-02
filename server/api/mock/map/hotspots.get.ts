import type { GetHotspotsResponse, HotspotAggregate } from '~/types/map'

// Mock 熱點資料 (台北市各區)
const mockHotspots: HotspotAggregate[] = [
  {
    districtId: 'taipei-daan',
    districtName: '大安區',
    center: { latitude: 25.0264, longitude: 121.5435 },
    count: 12,
    avgStressLevel: 3.2
  },
  {
    districtId: 'taipei-xinyi',
    districtName: '信義區',
    center: { latitude: 25.0330, longitude: 121.5654 },
    count: 8,
    avgStressLevel: 2.8
  },
  {
    districtId: 'taipei-zhongshan',
    districtName: '中山區',
    center: { latitude: 25.0685, longitude: 121.5266 },
    count: 15,
    avgStressLevel: 3.5
  },
  {
    districtId: 'taipei-songshan',
    districtName: '松山區',
    center: { latitude: 25.0608, longitude: 121.5576 },
    count: 6,
    avgStressLevel: 2.3
  },
  {
    districtId: 'taipei-neihu',
    districtName: '內湖區',
    center: { latitude: 25.0830, longitude: 121.5888 },
    count: 4,
    avgStressLevel: 1.9
  }
]

export default defineEventHandler(async (_event): Promise<GetHotspotsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    hotspots: mockHotspots,
    updatedAt: new Date().toISOString()
  }
})
