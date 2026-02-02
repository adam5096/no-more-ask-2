# B1-B6 情緒地景 (Emotional Landscape) ORCA Discovery

**日期**: 2026-02-03
**版本**: v1.0 (Side Project Experimental)

---

## 1. 核心願景 (Vision)
這是一個集體情緒地圖，使用者可以在地圖上發布「情緒標籤雲」。這不是一個商業媒合平台，而是一個視覺化、幽默、且具有「情緒演化」機制的社交實驗空間。

---

## 2. 物件模型 (Objects)

### Vibe (情緒標籤)
*   **描述**: 使用者發布的最小情緒單位。
*   **屬性**:
    *   `id`: string
    *   `content`: string (內容)
    *   `type`: 'anxious' | 'roast' | 'flex' | 'disturbed' (焦慮, 吐槽, 炫耀, 困擾)
    *   `location`: GeoPoint (經緯度)
    *   `isAnonymous`: boolean (是否隱藏暱稱)
    *   `nickname`: string (發布者暱稱，若匿名則隱藏)
    *   `lifespan`: number (壽命，分鐘為單位，最大 720 分鐘)
    *   `createdAt`: ISO string

### EvolutionState (演化狀態)
*   **描述**: 基於「個人」累計的標籤數量，在地圖上呈現的進階樣式。
*   **觸發條件**: 同一用戶在有效時間內，同類型 Vibe 累積超過閾值。
*   **樣式範例**: 
    *   焦慮 x 10 → **「烏雲籠罩」 (ChaosCloud)**
    *   炫耀 x 10 → **「金光閃閃」 (GlitterZone)**

---

## 3. 使用者與圖層 (User & Layers)

### 圖層設計 (Layers)
1.  **Public Vibes**: 所有使用者的匿名/非匿名標籤。
2.  **My Emotional Path**: 僅顯示我自己的情緒路徑與演化狀態。
3.  **Roast Only**: 僅過濾出吐槽類的標籤。

---

## 4. 練習技術目標 (Technical Goals)
1.  **Temporal Logic**: 處理標籤隨時間「蒸發」的邏輯。
2.  **Aggregation**: 使用 BFF 處理個人標籤的累計與層級計算。
3.  **Visualization**: 使用動態樣式 (CSS Filter, Canvas) 呈現不同階段的情緒標籤。

---

## 5. 生命週期規範 (Evaporation)
*   預設壽命: 120 分鐘。
*   用戶可調範圍: 30 ~ 720 分鐘。
*   視覺呈現: 接近失效時，標籤縮小。
