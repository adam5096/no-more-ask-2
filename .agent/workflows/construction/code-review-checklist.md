---
description: code review
---

# Code Review 檢查清單

> **版本**：v1.0  
> **基於**：編程範式與設計原則文檔  
> **目的**：提供標準化的 Code Review 檢查項目，確保程式碼品質對齊相同的編程範式

---

## 使用說明

本檢查清單用於 Code Review 時確保程式碼符合專案的編程範式與設計原則。請在進行 Code Review 時，逐項檢查以下項目。

**檢查方式**：
- ✅ 通過：符合規範
- ⚠️ 建議改進：可接受，但建議優化
- ❌ 需要修改：不符合規範，必須修改

---

## 一、編程範式檢查

### 1.1 函數式編程原則

#### 純函數（Pure Functions）

- [ ] **核心業務邏輯是否為純函數？**
  - 相同輸入是否總是產生相同輸出？
  - 是否有副作用（修改外部狀態、API 呼叫、時間戳等）？
  - 是否依賴外部可變狀態？

- [ ] **副作用是否明確標記和隔離？**
  - 副作用是否集中在 Composable 或 Service Layer？
  - 是否使用註解標記副作用函數？
  - 副作用與純函數邏輯是否分離？

**參考文檔**：`docs/construction/programming-paradigms/01-functional-programming.md`

#### 不可變性（Immutability）

- [ ] **是否避免直接修改參數？**
  - 是否使用展開運算符（`...`）創建新物件？
  - 是否避免直接修改陣列（使用 `map`、`filter` 等）？
  - 是否避免直接修改傳入的 props？

- [ ] **狀態更新是否使用不可變方式？**
  - Vue 的 `ref`、`reactive` 是否正確使用？
  - 是否避免直接修改 `ref.value` 的內部屬性？

**參考文檔**：`docs/construction/programming-paradigms/01-functional-programming.md`

#### 函數組合（Function Composition）

- [ ] **函數是否易於組合？**
  - 函數是否只做一件事？
  - 函數是否可以獨立使用？
  - 複雜邏輯是否透過函數組合實現？

**參考文檔**：`docs/construction/programming-paradigms/01-functional-programming.md`

---

### 1.2 單一職責原則（Single Responsibility）

- [ ] **函數是否只做一件事？**
  - 函數名稱是否清楚表達其單一職責？
  - 函數長度是否超過 50 行？（超過建議拆分）
  - 函數複雜度是否過高？（建議使用工具檢查）

- [ ] **Composables 是否只負責一個業務領域？**
  - 是否避免混合多個業務領域（如：`useDashboard` 包含 requests、helpers、notifications）？
  - 是否拆分為多個單一職責的 Composables？

**範例**：
```typescript
// ✅ 好的：單一職責
export function useRescueRequestDetails(requestId: string) {
  const { data, pending, error } = useFetch(
    `/api/rescue-requests/${requestId}/details`
  )
  return { data, pending, error }
}

// ❌ 避免：多個職責
export function useRescueRequest(requestId: string) {
  const request = useFetch(`/api/rescue-requests/${requestId}`)
  const helper = useFetch(`/api/helpers/${request.data.value?.helperId}`)
  const map = useFetch(`/api/map/${request.data.value?.locationId}`)
  // 太多職責
}
```

**參考文檔**：`docs/construction/programming-paradigms/02-design-principles.md`

---

### 1.3 依賴反轉原則（Dependency Inversion）

- [ ] **是否透過參數注入依賴？**
  - 是否避免硬編碼外部依賴（如：直接使用 `$fetch`）？
  - 是否透過函數參數注入依賴？
  - 是否提供預設實作但允許注入？

- [ ] **是否易於測試和 Mock？**
  - 函數是否可以獨立測試？
  - 依賴是否可以輕鬆 Mock？
  - 是否避免直接 import API 路徑？

**範例**：
```typescript
// ✅ 好的：依賴注入
type Fetcher = (url: string, options?: FetchOptions) => Promise<any>

function getUser(id: string, fetcher: Fetcher = $fetch) {
  return fetcher(`/api/users/${id}`)
}

// ❌ 避免：硬編碼依賴
function getUser(id: string) {
  return $fetch(`/api/users/${id}`) // 無法 Mock
}
```

**參考文檔**：`docs/construction/programming-paradigms/02-design-principles.md`

---

### 1.4 KISS 原則（Keep It Simple, Stupid）

- [ ] **程式碼是否簡單易懂？**
  - 是否避免過度抽象？
  - 是否避免不必要的設計模式？
  - 是否需要特別解釋才能理解？

- [ ] **是否優先選擇最簡單的解決方案？**
  - 在 MVP 階段，是否優先簡單性而非完美性？
  - 是否避免為「未來可能的需求」而過度設計？

**範例**：
```typescript
// ✅ 好的：簡單直接
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // 直接實作計算邏輯
}

// ❌ 避免：過度抽象（MVP 階段）
interface DistanceCalculator {
  calculate(point1: Point, point2: Point): number
}
class HaversineCalculator implements DistanceCalculator { ... }
```

**參考文檔**：`docs/construction/programming-paradigms/02-design-principles.md`

---

## 二、測試檢查

### 2.1 測試覆蓋率

- [ ] **是否包含測試？**
  - 新增功能是否包含對應的測試？
  - 修改現有功能是否更新相關測試？

- [ ] **測試品質是否足夠？**
  - 測試是否涵蓋主要場景（成功、錯誤）？
  - 測試是否易於理解和維護？
  - 測試是否獨立（不依賴其他測試）？

**參考文檔**：`docs/prd/acceptance-criteria.md`

---

### 2.2 測試可測試性

- [ ] **程式碼是否易於測試？**
  - 純函數邏輯是否獨立於副作用？
  - 依賴是否易於 Mock？
  - 函數是否易於隔離測試？

**參考文檔**：測試策略討論與最佳實踐

---

## 三、程式碼品質檢查

### 3.1 可讀性

- [ ] **命名是否清楚表達意圖？**
  - 函數名稱是否以動詞開頭（如：`getUser`、`validateEmail`）？
  - 變數名稱是否清楚表達內容（如：`isLoading`、`userList`）？
  - 組件名稱是否使用 PascalCase 且多詞命名？

- [ ] **程式碼結構是否清晰？**
  - 組件內部順序是否符合規範（imports → props → state → computed → methods）？
  - 函數是否按邏輯順序組織？
  - 複雜邏輯是否有適當註解？

**參考文檔**：`.cursor/rules/code/self-documenting-architecture.mdc`

---

### 3.2 可維護性

- [ ] **程式碼是否易於修改？**
  - 修改一個功能是否影響其他功能？
  - 是否避免重複程式碼（DRY）？
  - 是否使用共用的 Composables 或工具函數？

- [ ] **錯誤處理是否完善？**
  - 是否處理所有可能的錯誤情況？
  - 錯誤訊息是否明確且友善？
  - 錯誤處理是否統一？

**參考文檔**：`docs/construction/programming-paradigms/04-side-effect-strategies.md`

---

### 3.3 TypeScript 類型安全

- [ ] **類型定義是否完整？**
  - 函數參數和返回值是否有明確類型？
  - 是否避免使用 `any`？
  - Props 和 Emits 是否有類型定義？

- [ ] **類型是否正確使用？**
  - 是否使用專案定義的類型（如：`User`、`RescueRequest`）？
  - 是否避免類型斷言（`as`）？

---

## 四、Vue/Nuxt 特定檢查

### 4.1 組件結構

- [ ] **組件內部順序是否符合規範？**
  - 1. Imports（外部依賴）
  - 2. DefineProps / DefineEmits（輸入/輸出契約）
  - 3. Reactive State / Refs（響應式狀態）
  - 4. Computed Properties（計算屬性）
  - 5. Methods / Functions（方法/函數）
  - 6. Watchers（監聽器）
  - 7. Lifecycle Hooks（生命週期鉤子）

**參考文檔**：`.cursor/rules/code/self-documenting-architecture.mdc`

---

### 4.2 Composables 設計

- [ ] **Composables 命名是否符合規範？**
  - 是否使用 `use[Feature]` 命名模式（如：`useAuth`、`useRescueRequest`）？
  - 是否清楚表達其業務領域？

- [ ] **Composables 是否遵循單一職責？**
  - 是否只負責一個業務領域？
  - 是否避免混合多個業務邏輯？

**參考文檔**：`docs/construction/programming-paradigms/03-practical-applications.md`

---

### 4.3 路由與 API

- [ ] **BFF 路徑是否符合命名規範？**
  - 是否使用複數名詞（如：`/api/rescue-requests`）？
  - 路徑嵌套是否不超過 2 層？
  - 是否使用適當的 HTTP 方法（GET、POST、PATCH）？

- [ ] **頁面複雜度分類是否正確？**
  - Simple (1:1)：一個頁面對應一個 BFF 路徑
  - Standard (1:2-3)：一個頁面對應 2-3 個 BFF 路徑
  - Complex (1:N)：一個頁面對應多個獨立 BFF 路徑

**參考文檔**：`docs/construction/nitro/bff-paths.md`

---

## 五、原則衝突處理

### 5.1 原則衝突檢查

- [ ] **如果原則衝突，是否記錄原因？**
  - 是否說明為什麼必須違反某個原則？
  - 是否設定重構時間點？
  - 是否在程式碼中標註註解？

**參考文檔**：`docs/construction/programming-paradigms/03-practical-applications.md`

---

## 六、Code Review 流程建議

### 6.1 Review 前準備

1. **開發者自檢**：
   - 使用本檢查清單進行自我檢查
   - 確保所有檢查項目都通過或已記錄原因

2. **提交 PR**：
   - 填寫 PR 模板中的所有項目
   - 提供清晰的變更說明

### 6.2 Review 執行

1. **第一輪：快速檢查**
   - 檢查 PR 模板是否完整填寫
   - 檢查是否有明顯的錯誤或問題

2. **第二輪：詳細檢查**
   - 使用本檢查清單逐項檢查
   - 特別關注編程範式和測試相關項目

3. **第三輪：整體檢查**
   - 檢查程式碼整體結構和設計
   - 檢查是否符合專案架構規範

### 6.3 Review 後處理

1. **記錄 Review 結果**：
   - 標記通過的項目
   - 記錄需要改進的項目
   - 記錄必須修改的項目

2. **提供具體建議**：
   - 指出問題的具體位置
   - 提供改進建議或範例
   - 參考相關文檔

3. **追蹤改進**：
   - 確保所有必須修改的項目都已處理
   - 追蹤建議改進項目的後續處理

---

## 七、檢查清單快速參考

### 必檢項目（必須通過）

- [ ] 核心業務邏輯為純函數
- [ ] 函數符合單一職責原則
- [ ] 依賴透過參數注入
- [ ] 包含對應的測試
- [ ] 類型定義完整
- [ ] 組件結構符合規範

### 建議改進項目（可接受，但建議優化）

- [ ] 函數長度超過 50 行（建議拆分）
- [ ] 使用 `any` 類型（建議定義明確類型）
- [ ] 測試覆蓋率不足（建議補充測試）

---

## 相關文檔

- **編程範式**：`docs/construction/programming-paradigms/index.md`
- **設計原則**：`docs/construction/programming-paradigms/02-design-principles.md`
- **實際應用**：`docs/construction/programming-paradigms/03-practical-applications.md`
- **副作用處理**：`docs/construction/programming-paradigms/04-side-effect-strategies.md`
- **驗收標準**：`docs/prd/acceptance-criteria.md`
- **BFF 路徑設計**：`docs/construction/nitro/bff-paths.md`

---

**文檔版本**：v1.0  
**最後更新**：2025  
**維護者**：待指定

