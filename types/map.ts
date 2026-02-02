// B6 情緒地景 ORCA 物件模型 (v1)
// 專注於情緒視覺化、標籤雲與個人演化機制

// ============================================
// Core Objects
// ============================================

/**
 * 地理座標點
 */
export interface GeoPoint {
  latitude: number   // 緯度 -90 ~ 90
  longitude: number  // 經度 -180 ~ 180
}

/**
 * 情緒分類 (Vibe Type)
 */
export type VibeType = 'anxious' | 'roast' | 'flex' | 'disturbed'

/**
 * 情緒標籤 (Vibe Object)
 */
export interface Vibe {
  id: string
  userId: string
  content: string
  type: VibeType
  
  // 位置資訊
  location: GeoPoint
  
  // 顯示資訊
  isAnonymous: boolean
  nickname?: string  // 若 isAnonymous 為 true 則不顯示
  
  // 生命週期
  createdAt: string  // ISO 8601
  lifespan: number   // 壽命長度 (分鐘)，最大 720
  
  // 演化狀態 (僅針對個人圖層)
  evolutionLevel: number // 0: 一般, 1: 堆疊中, 2: 已演化
}

/**
 * 地圖圖層 (Layer)
 */
export interface MapLayer {
  id: string
  name: string
  type: 'public' | 'personal'
  dataSource: 'all_vibes' | 'my_vibes' | 'roast_only'
  visibility: 'visible' | 'hidden'
  order: number
}

// ============================================
// API Contracts
// ============================================

/**
 * GET /api/vibe/stream - 取得地圖情緒串流
 */
export interface GetVibeStreamResponse {
  vibes: Vibe[]
  activeEvolutions: {
    userId: string
    type: VibeType
    level: number
    center: GeoPoint
  }[]
}

/**
 * POST /api/vibe/create - 發布心情標籤
 */
export interface CreateVibeRequest {
  content: string
  type: VibeType
  location: GeoPoint
  isAnonymous: boolean
  lifespan?: number // 30 - 720
}

/**
 * POST /api/vibe/create - 回應
 */
export interface CreateVibeResponse {
  success: boolean
  vibe: Vibe
}
