import type { GetMapLayersResponse, Layer } from '~/types/map'

// Mock 圖層定義
const mockLayers: Layer[] = [
  {
    id: 'layer-hotspot',
    name: '熱點分佈',
    type: 'public',
    dataSource: 'hotspot',
    visibility: 'visible',
    order: 1,
    accessLevel: 'anonymous'
  },
  {
    id: 'layer-my-requests',
    name: '我的救援請求',
    type: 'personal',
    dataSource: 'rescue_request',
    visibility: 'visible',
    order: 2,
    accessLevel: 'authenticated'
  },
  {
    id: 'layer-helpers',
    name: '附近 Helper',
    type: 'personal',
    dataSource: 'helper',
    visibility: 'visible',
    order: 3,
    accessLevel: 'authenticated'
  }
]

export default defineEventHandler(async (_event): Promise<GetMapLayersResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  return {
    layers: mockLayers
  }
})
