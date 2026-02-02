// B6 實況地圖 ORCA 物件模型 (v1)
// 依據 ORCA Discovery 訪談結果定義

// ============================================
// 擴展現有物件
// ============================================

/**
 * RescueRequest 擴展 - 加入地理位置
 * 原物件位於 types/dashboard.ts
 */
export interface RescueRequestLocation {
  /** 原有 RescueRequest 的所有屬性 */
  // ...extends RescueRequestPreview

  /** 地理位置 (WGS84) */
  location: GeoPoint

  /** 區域 ID (用於熱點聚合) */
  districtId: string
}

/**
 * Helper 擴展 - 加入地理位置與隱私設定
 * 原物件位於 types/dashboard.ts
 */
export interface HelperLocation {
  /** 原有 Helper 的所有屬性 */
  // ...extends HelperMinimal

  /** 地理位置 (WGS84) */
  location?: GeoPoint

  /** 位置是否公開 (預設 true = Opt-out) */
  isLocationPublic: boolean
}

// ============================================
// 新增物件
// ============================================

/**
 * 地理座標點
 */
export interface GeoPoint {
  latitude: number   // 緯度 -90 ~ 90
  longitude: number  // 經度 -180 ~ 180
}

/**
 * 地圖圖層
 * 
 * ORCA 定義：
 * - Object: Layer
 * - Relationships: hasMany DataPoint (RescueRequest | Helper | Hotspot)
 * - CTAs: toggle, reorder
 * - Attributes: 如下
 */
export interface Layer {
  id: string
  
  /** 圖層顯示名稱 */
  name: string
  
  /** 圖層類型 */
  type: LayerType
  
  /** 資料來源類型 */
  dataSource: LayerDataSource
  
  /** 可見性 (用戶可 toggle) */
  visibility: 'visible' | 'hidden'
  
  /** 圖層疊加順序 (數字越大越上層) */
  order: number
  
  /** 存取權限 */
  accessLevel: LayerAccessLevel
}

export type LayerType = 'public' | 'personal'

export type LayerDataSource = 'rescue_request' | 'helper' | 'hotspot'

export type LayerAccessLevel = 'anonymous' | 'authenticated'

/**
 * 用戶圖層偏好設定 (N:N 中間表)
 * 
 * ORCA 定義：
 * - Relationships: belongsTo User, belongsTo Layer
 */
export interface UserLayerPreference {
  userId: string
  layerId: string
  
  /** 用戶自訂的可見性 */
  visibility: 'visible' | 'hidden'
  
  /** 用戶自訂的排序 */
  customOrder?: number
}

/**
 * 熱點聚合結果 (非物件，是計算結果)
 * 
 * 來源：BFF 對 RescueRequest 做 GROUP BY district
 */
export interface HotspotAggregate {
  /** 區域 ID */
  districtId: string
  
  /** 區域名稱 */
  districtName: string
  
  /** 區域中心點 (用於地圖顯示) */
  center: GeoPoint
  
  /** 救援請求數量 */
  count: number
  
  /** 平均壓力等級 */
  avgStressLevel: number
}

// ============================================
// API Contracts
// ============================================

/**
 * GET /api/map/layers - 取得可用圖層列表
 */
export interface GetMapLayersResponse {
  layers: Layer[]
}

/**
 * GET /api/map/hotspots - 取得熱點聚合資料
 * Query: ?districtIds=xxx,yyy
 */
export interface GetHotspotsResponse {
  hotspots: HotspotAggregate[]
  updatedAt: string // ISO 8601
}

/**
 * GET /api/map/rescue-requests - 取得地圖上的救援請求
 * Query: ?bounds=lat1,lng1,lat2,lng2
 */
export interface GetMapRescueRequestsResponse {
  requests: RescueRequestLocation[]
}

/**
 * GET /api/map/helpers - 取得地圖上的 Helper 位置
 * Query: ?bounds=lat1,lng1,lat2,lng2
 * 需認證
 */
export interface GetMapHelpersResponse {
  helpers: HelperLocation[]
}

/**
 * PATCH /api/user/layer-preferences - 更新用戶圖層偏好
 */
export interface UpdateLayerPreferenceRequest {
  layerId: string
  visibility?: 'visible' | 'hidden'
  customOrder?: number
}
