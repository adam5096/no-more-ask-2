# 實際應用案例

版本：v1.0
建立日期：2025
目的：提供實際應用案例與原則衝突處理機制

---

## 重要說明

本文檔中的所有範例都是參考模型，實際實作應根據真實工程需求調整。範例的目的是展示原則的應用方式，而非提供可直接使用的程式碼。

---

## Composables 設計模式

### 基本模式

#### 模式 1：簡單資料獲取

```typescript
// 參考模型：簡單的資料獲取 Composable
// 實際實作應根據真實 API 結構調整

export function useRescueRequestDetails(requestId: string) {
  // 單一職責：只負責獲取救援請求詳情
  // 純函數：相同輸入產生相同輸出
  // 依賴反轉：依賴 useFetch（可替換）
  
  const { data, pending, error, refresh } = useFetch(
    `/api/rescue-requests/${requestId}/details`,
    {
      key: `rescue-request-${requestId}`,
      transform: (data: any) => ({
        request: data.request,
        matchedHelper: data.matchedHelper,
        mapLocation: data.mapLocation
      })
    }
  )
  
  // 介面隔離：只導出必要的資料
  return {
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),
    refresh
  }
}
```

#### 模式 2：帶有副作用的操作

```typescript
// 參考模型：帶有副作用的操作
// 實際實作應根據真實業務邏輯調整

export function useRescueRequestActions(requestId: string) {
  // 分離純函數和副作用
  const request = useRescueRequestDetails(requestId)
  
  // 純函數：計算是否可以取消
  const canCancel = computed(() => {
    if (!request.data.value) return false
    return request.data.value.status === 'pending'
  })
  
  // 副作用：取消請求
  async function cancelRequest() {
    if (!canCancel.value) return
    
    try {
      await $fetch(`/api/rescue-requests/${requestId}`, {
        method: 'PATCH',
        body: { status: 'cancelled' }
      })
      
      // 重新獲取資料
      await request.refresh()
    } catch (error) {
      console.error('Failed to cancel request:', error)
      throw error
    }
  }
  
  return {
    canCancel: readonly(canCancel),
    cancelRequest
  }
}
```

#### 模式 3：組合多個 Composables

```typescript
// 參考模型：組合多個 Composables
// 實際實作應根據真實業務需求調整

export function useRescueRequestPage(requestId: string) {
  // 單一職責：每個 Composable 只負責一件事
  const request = useRescueRequestDetails(requestId)
  const helper = computed(() => 
    request.data.value?.matchedHelperId
      ? useHelperDetails(request.data.value.matchedHelperId)
      : null
  )
  const notifications = useNotifications({ relatedRequestId: requestId })
  
  // 組合使用
  return {
    request: readonly(request.data),
    helper: readonly(helper.value?.data),
    notifications: readonly(notifications.data),
    pending: computed(() => 
      request.pending.value || 
      helper.value?.pending.value || 
      notifications.pending.value
    )
  }
}
```

### 進階模式

#### 模式 4：高階函數創建 Composables

```typescript
// 參考模型：使用高階函數創建相似的 Composables
// 實際實作應根據真實需求調整

function createDetailsComposable<T>(
  resourceName: string,
  transform?: (data: any) => T
) {
  return function useDetails(id: string) {
    const { data, pending, error, refresh } = useFetch(
      `/api/${resourceName}/${id}/details`,
      {
        key: `${resourceName}-${id}`,
        transform
      }
    )
    
    return {
      data: readonly(data),
      pending: readonly(pending),
      error: readonly(error),
      refresh
    }
  }
}

// 使用：創建不同的 Composables
export const useRescueRequestDetails = createDetailsComposable<RescueRequest>(
  'rescue-requests',
  (data) => data.request
)

export const useHelperDetails = createDetailsComposable<Helper>(
  'helpers',
  (data) => data.helper
)
```

---

## 實際應用案例

### 案例 1：救援請求匹配邏輯

#### 需求

實作 Helper 匹配邏輯，根據地理位置和技能匹配最適合的 Helper。

#### 參考實作

```typescript
// 參考模型：救援請求匹配邏輯
// 實際實作應根據真實匹配演算法調整

// 純函數：計算匹配分數
function calculateMatchScore(
  request: RescueRequest,
  helper: Helper
): number {
  // 距離分數（越近分數越高）
  const distance = calculateDistance(
    request.location.lat,
    request.location.lng,
    helper.location.lat,
    helper.location.lng
  )
  const distanceScore = 1 / (1 + distance / 1000) // 標準化到 0-1
  
  // 技能匹配分數
  const skillMatch = request.requiredSkills.filter(skill =>
    helper.skills.includes(skill)
  ).length / request.requiredSkills.length
  
  // 狀態分數
  const statusScore = helper.status === 'online' ? 1 : 0.5
  
  // 綜合分數
  return distanceScore * 0.4 + skillMatch * 0.4 + statusScore * 0.2
}

// 純函數：匹配 Helper
function matchHelper(
  request: RescueRequest,
  helpers: Helper[]
): Helper | null {
  if (helpers.length === 0) return null
  
  // 計算所有 Helper 的分數
  const scores = helpers.map(helper => ({
    helper,
    score: calculateMatchScore(request, helper)
  }))
  
  // 找出分數最高的
  const bestMatch = scores.reduce((best, current) =>
    current.score > best.score ? current : best
  )
  
  return bestMatch.score > 0.5 ? bestMatch.helper : null
}

// Composable：使用匹配邏輯
export function useHelperMatching(request: RescueRequest) {
  const { data: helpers } = useHelperList({
    location: request.location,
    status: 'online'
  })
  
  // 使用純函數進行匹配
  const matchedHelper = computed(() => {
    if (!helpers.value || helpers.value.length === 0) return null
    return matchHelper(request, helpers.value)
  })
  
  return {
    matchedHelper: readonly(matchedHelper)
  }
}
```

#### 設計決策說明

1. 純函數優先
   - `calculateMatchScore` 和 `matchHelper` 都是純函數
   - 易於測試和除錯

2. 單一職責
   - `calculateMatchScore` 只負責計算分數
   - `matchHelper` 只負責匹配邏輯
   - `useHelperMatching` 只負責整合

3. KISS 原則
   - 使用簡單的加權平均計算分數
   - 不引入複雜的機器學習模型（MVP 階段）

### 案例 2：表單驗證與處理

#### 需求

實作救援請求表單的驗證與提交邏輯。

#### 參考實作

```typescript
// 參考模型：表單驗證與處理
// 實際實作應根據真實表單結構調整

// 純函數：驗證表單資料
function validateRescueRequestForm(
  form: RescueRequestForm
): ValidationResult {
  const errors: Record<string, string> = {}
  
  // 驗證請求類型
  if (!form.requestType) {
    errors.requestType = '請選擇請求類型'
  }
  
  // 驗證壓力等級
  if (form.stressLevel < 1 || form.stressLevel > 5) {
    errors.stressLevel = '壓力等級必須在 1-5 之間'
  }
  
  // 驗證地理位置
  if (!form.location || !form.location.lat || !form.location.lng) {
    errors.location = '請選擇地理位置'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// 純函數：轉換表單資料為 API 格式
function transformFormToRequest(
  form: RescueRequestForm
): CreateRescueRequestRequest {
  return {
    requestType: form.requestType,
    stressLevel: form.stressLevel,
    budget: form.budget,
    description: form.description,
    location: {
      lat: form.location.lat,
      lng: form.location.lng,
      address: form.location.address
    }
  }
}

// Composable：表單處理
export function useRescueRequestForm() {
  const form = ref<RescueRequestForm>({
    requestType: null,
    stressLevel: 3,
    budget: null,
    description: '',
    location: null
  })
  
  // 衍生狀態：驗證結果
  const validation = computed(() => validateRescueRequestForm(form.value))
  
  // 衍生狀態：是否可以提交
  const canSubmit = computed(() => validation.value.isValid)
  
  // 副作用：提交表單
  async function submitForm() {
    if (!canSubmit.value) return
    
    try {
      const requestData = transformFormToRequest(form.value)
      const result = await $fetch('/api/rescue-requests', {
        method: 'POST',
        body: requestData
      })
      
      return result
    } catch (error) {
      console.error('Failed to submit form:', error)
      throw error
    }
  }
  
  return {
    form,
    validation: readonly(validation),
    canSubmit: readonly(canSubmit),
    submitForm
  }
}
```

#### 設計決策說明

1. 分離純函數和副作用
   - `validateRescueRequestForm` 和 `transformFormToRequest` 是純函數
   - `submitForm` 處理副作用（API 呼叫）

2. 使用衍生狀態
   - `validation` 和 `canSubmit` 是衍生狀態
   - 不需要手動同步

3. 單一職責
   - 驗證、轉換、提交分別由不同函數處理

### 案例 3：資料過濾與排序

#### 需求

實作救援請求列表的過濾與排序功能。

#### 參考實作

```typescript
// 參考模型：資料過濾與排序
// 實際實作應根據真實需求調整

// 純函數：過濾請求
function filterRequests(
  requests: RescueRequest[],
  filters: RequestFilters
): RescueRequest[] {
  return requests.filter(request => {
    // 狀態過濾
    if (filters.status && request.status !== filters.status) {
      return false
    }
    
    // 壓力等級過濾
    if (filters.minStressLevel && request.stressLevel < filters.minStressLevel) {
      return false
    }
    
    // 日期範圍過濾
    if (filters.startDate && request.createdAt < filters.startDate) {
      return false
    }
    
    if (filters.endDate && request.createdAt > filters.endDate) {
      return false
    }
    
    return true
  })
}

// 純函數：排序請求
function sortRequests(
  requests: RescueRequest[],
  sortBy: 'date' | 'stressLevel' | 'budget'
): RescueRequest[] {
  const sorted = [...requests] // 不可變操作
  
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      )
    case 'stressLevel':
      return sorted.sort((a, b) => b.stressLevel - a.stressLevel)
    case 'budget':
      return sorted.sort((a, b) => 
        (b.budget || 0) - (a.budget || 0)
      )
    default:
      return sorted
  }
}

// Composable：列表管理
export function useRescueRequestList() {
  const { data: allRequests } = useFetch<RescueRequest[]>(
    '/api/rescue-requests'
  )
  
  const filters = ref<RequestFilters>({
    status: null,
    minStressLevel: null,
    startDate: null,
    endDate: null
  })
  
  const sortBy = ref<'date' | 'stressLevel' | 'budget'>('date')
  
  // 衍生狀態：過濾後的請求
  const filteredRequests = computed(() => {
    if (!allRequests.value) return []
    return filterRequests(allRequests.value, filters.value)
  })
  
  // 衍生狀態：排序後的請求
  const sortedRequests = computed(() => {
    return sortRequests(filteredRequests.value, sortBy.value)
  })
  
  return {
    requests: readonly(sortedRequests),
    filters,
    sortBy,
    updateFilters: (newFilters: RequestFilters) => {
      filters.value = { ...filters.value, ...newFilters }
    },
    updateSortBy: (newSortBy: typeof sortBy.value) => {
      sortBy.value = newSortBy
    }
  }
}
```

#### 設計決策說明

1. 純函數組合
   - `filterRequests` 和 `sortRequests` 都是純函數
   - 可以獨立測試和重用

2. 不可變操作
   - `sortRequests` 創建新陣列，不修改原陣列

3. 衍生狀態
   - `filteredRequests` 和 `sortedRequests` 是衍生狀態
   - 自動響應 `filters` 和 `sortBy` 的變化

---

## 原則衝突處理

### 衝突類型

#### 類型 1：純函數 vs 單一職責

**情況：** 需要同時獲取多個資料來源

```typescript
// 衝突：一個函數做多件事（違反單一職責）
// 但保持函數式風格（符合主要原則）

// 方案 1：拆分為多個函數（推薦）
function useRescueRequest(requestId: string) {
  return useFetch(`/api/rescue-requests/${requestId}`)
}

function useHelper(helperId: string) {
  return useFetch(`/api/helpers/${helperId}`)
}

// 在頁面中組合使用
const request = useRescueRequest(requestId)
const helper = computed(() => 
  request.data.value?.matchedHelperId
    ? useHelper(request.data.value.matchedHelperId)
    : null
)

// 方案 2：如果必須聚合，記錄原因
// 理由：BFF 已經聚合，前端不需要再次拆分
// 重構時間點：如果未來需要獨立載入，再拆分
export function useRescueRequestDetails(requestId: string) {
  // 雖然獲取了多個資料，但 BFF 已聚合
  const { data } = useFetch(`/api/rescue-requests/${requestId}/details`)
  // 資料包含：request, helper, mapLocation
  return { data }
}
```

#### 類型 2：KISS vs 依賴反轉

**情況：** MVP 階段是否需要依賴注入？

```typescript
// 衝突：KISS 要求簡單，但依賴反轉要求抽象

// 方案 1：MVP 階段優先 KISS（推薦）
export function useRescueRequestDetails(requestId: string) {
  // 直接使用 $fetch，不引入抽象層
  const { data } = useFetch(`/api/rescue-requests/${requestId}`)
  return { data }
}

// 方案 2：如果未來需要，再引入依賴注入
// 記錄：未來如果需要支援 Mock 或不同環境，再重構
// 重構時間點：當需要測試或切換環境時
```

#### 類型 3：函數式編程 vs 效能

**情況：** 大量資料處理是否需要優化？

```typescript
// 衝突：函數式風格可能影響效能

// 方案 1：保持函數式風格，必要時優化（推薦）
function processLargeDataset(data: Data[]) {
  // 使用函數式方法
  return data
    .filter(item => item.isActive)
    .map(item => transformItem(item))
    .sort((a, b) => a.priority - b.priority)
}

// 方案 2：如果效能成為問題，再優化
// 記錄：如果資料量超過 1000 筆，考慮使用 for 迴圈
// 重構時間點：當效能測試發現問題時
```

### 決策流程

```
遇到原則衝突
    ↓
判斷衝突類型
    ↓
參考優先級：
1. 主要原則（函數式編程）
2. KISS 原則（MVP 階段）
3. 其他輔助原則
    ↓
選擇方案
    ↓
記錄決策原因
    ↓
設定重構時間點（如需要）
```

### 決策記錄模板

```markdown
## 原則衝突記錄

### 日期：2025-01-20
### 位置：useRescueRequestDetails
### 衝突類型：純函數 vs 單一職責

**衝突描述：**
需要同時獲取 request、helper、mapLocation，但這違反單一職責。

**決策：**
選擇方案 1：拆分為多個函數

**理由：**
1. 符合單一職責原則
2. 每個函數可以獨立測試
3. 未來可以獨立載入，提升效能

**重構時間點：**
無（已採用最佳方案）
```

---

## Code Review 檢查清單

### 函數式編程檢查

- [ ] 是否優先使用純函數？
- [ ] 是否保持資料不可變？
- [ ] 是否使用函數組合而非類別繼承？
- [ ] 是否使用高階函數實現依賴注入？

### 設計原則檢查

- [ ] 每個函數是否只做一件事？（單一職責）
- [ ] 是否透過參數注入依賴？（依賴反轉）
- [ ] 是否只導出必要的函數？（介面隔離）
- [ ] 解決方案是否足夠簡單？（KISS）

### Composables 檢查

- [ ] Composable 是否只負責一個業務領域？
- [ ] 是否分離純函數和副作用？
- [ ] 是否使用衍生狀態而非手動同步？
- [ ] 是否使用 readonly 保護資料？

### 可測試性檢查

- [ ] 純函數是否易於單元測試？
- [ ] 副作用是否分離到專門的函數？
- [ ] 是否可以使用 Mock 進行測試？

---

## 總結

實際應用時應該：

1. 參考範例，但根據真實需求調整
2. 遇到原則衝突時，參考優先級決策
3. 記錄決策原因，便於未來重構
4. 使用檢查清單進行 Code Review

記住：範例是參考模型，實際實作應根據真實工程需求調整。

---

文檔版本：v1.0
最後更新：2025
維護者：待指定

