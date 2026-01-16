# 設計原則

版本：v1.0
建立日期：2025
目的：定義本專案適用的設計原則，包括 SOLID 的函數式對應與 KISS 原則

---

## 概述

雖然 SOLID 原則主要針對物件導向編程，但其核心概念在函數式編程中也有對應。我們透過函數的單一職責、依賴注入和模組導出來達成類似的設計目標。同時，KISS 原則幫助我們避免過度設計，特別是在 MVP 階段。

### 原則層級關係

本專案的原則分為兩個層級：

- 第一層：設計範式（主要原則）
  - 函數式編程（詳見 01-functional-programming.md）

- 第二層：設計指導（輔助原則）
  - SOLID 的函數式對應
  - KISS 原則

### 原則應用方式

主要原則與輔助原則應該同時應用：

- 主要原則：決定整體風格（函數式編程）
- 輔助原則：幫助優化設計（單一職責、依賴反轉等）

當原則衝突時：
- 主要原則優先（保持函數式風格）
- 但盡量不違反輔助原則
- 如果必須違反，記錄原因並設定重構時間點

---

## 單一職責（Single Responsibility）

### 定義

單一職責原則是指一個函數或模組應該只負責一件事。在函數式編程中，這意味著每個函數應該只做一個特定的任務。

### 函數式編程中的對應

在函數式編程中，單一職責原則天然符合：
- 每個函數只做一件事
- 函數可以組合來完成複雜任務
- 函數易於測試和重用

### 範例

#### 好的範例：單一職責

```typescript
// 每個函數只做一件事
function getUser(id: string): Promise<User> {
  return $fetch(`/api/users/${id}`)
}

function validateUser(user: User): boolean {
  return user.email !== null && user.nickname !== null
}

function formatUser(user: User): FormattedUser {
  return {
    ...user,
    displayName: `${user.nickname} (${user.email})`
  }
}

// 組合使用
async function processUser(id: string): Promise<FormattedUser | null> {
  const user = await getUser(id)
  
  if (!validateUser(user)) {
    return null
  }
  
  return formatUser(user)
}
```

#### 避免的範例：違反單一職責

```typescript
// 錯誤：一個函數做多件事
async function processUser(id: string): Promise<FormattedUser | null> {
  // 1. 獲取資料
  const user = await $fetch(`/api/users/${id}`)
  
  // 2. 驗證資料
  if (!user.email || !user.nickname) {
    return null
  }
  
  // 3. 格式化資料
  const formatted = {
    ...user,
    displayName: `${user.nickname} (${user.email})`
  }
  
  // 4. 發送通知（額外的職責）
  await sendNotification(user.id, 'User processed')
  
  return formatted
}
```

#### 在 Composables 中的應用

```typescript
// 好的範例：單一職責的 Composable
export function useRescueRequestDetails(requestId: string) {
  // 只負責獲取救援請求詳情
  const { data, pending, error } = useFetch(
    `/api/rescue-requests/${requestId}/details`
  )
  
  return { data, pending, error }
}

// 錯誤範例：一個 Composable 做多件事
export function useRescueRequest(requestId: string) {
  // 獲取請求
  const request = useFetch(`/api/rescue-requests/${requestId}`)
  
  // 獲取 Helper（額外的職責）
  const helper = computed(() => 
    request.data.value?.matchedHelperId 
      ? useFetch(`/api/helpers/${request.data.value.matchedHelperId}`)
      : null
  )
  
  // 獲取地圖（額外的職責）
  const map = useFetch(`/api/map/${request.data.value?.locationId}`)
  
  // 更新請求（額外的職責）
  async function updateRequest(data: any) { ... }
  
  // 發送通知（額外的職責）
  async function sendNotification() { ... }
  
  return { request, helper, map, updateRequest, sendNotification }
}
```

### 最佳實踐

1. 函數名稱應該清楚表達其單一職責
   - 例如：`getUser`、`validateUser`、`formatUser`
   - 避免：`processUserData`（可能包含多個職責）

2. 如果函數超過 50 行，考慮拆分
   - 長函數通常違反單一職責
   - 拆分為多個小函數

3. 在 Composables 中保持單一職責
   - 一個 Composable 只負責一個業務領域
   - 例如：`useRescueRequest`、`useHelper`、`useNotification`

### 常見錯誤

1. 函數名稱模糊
   ```typescript
   // 錯誤：名稱不清楚
   function process(data: any): any {
     // 做了很多事
   }
   
   // 正確：名稱清楚表達職責
   function validateAndFormatUser(user: User): FormattedUser {
     // 雖然做了兩件事，但名稱清楚表達
   }
   ```

2. 在 Composables 中混合多個業務領域
   ```typescript
   // 錯誤：混合多個業務領域
   export function useDashboard() {
     const requests = useFetch('/api/requests')
     const helpers = useFetch('/api/helpers')
     const notifications = useFetch('/api/notifications')
     const gatherings = useFetch('/api/gatherings')
     // 太多職責
   }
   
   // 正確：拆分為多個 Composables
   export function useDashboardRequests() { ... }
   export function useDashboardHelpers() { ... }
   export function useDashboardNotifications() { ... }
   ```

---

## 依賴反轉（Dependency Inversion）

### 定義

依賴反轉原則是指高層模組不應該依賴低層模組，兩者都應該依賴抽象。在函數式編程中，這意味著透過函數參數注入依賴，而非硬編碼依賴。

### 函數式編程中的對應

在函數式編程中，依賴反轉透過以下方式實現：
- 高階函數：接受函數作為參數
- 依賴注入：透過參數注入依賴
- 函數簽名：定義抽象介面

### 範例

#### 好的範例：依賴注入

```typescript
// 定義抽象介面（函數簽名）
type Fetcher = (url: string, options?: FetchOptions) => Promise<any>

// 高階函數：接受 Fetcher 作為參數
function createUserService(fetcher: Fetcher) {
  return {
    getUser: (id: string) => fetcher(`/api/users/${id}`),
    updateUser: (id: string, data: User) => 
      fetcher(`/api/users/${id}`, { method: 'PUT', body: data })
  }
}

// 使用：注入不同的 Fetcher
const httpUserService = createUserService($fetch)
const mockUserService = createUserService(mockFetcher)

// 在測試中使用 Mock
const testService = createUserService(mockFetcher)
```

#### 避免的範例：硬編碼依賴

```typescript
// 錯誤：硬編碼依賴
function createUserService() {
  return {
    getUser: (id: string) => $fetch(`/api/users/${id}`), // 硬編碼 $fetch
    updateUser: (id: string, data: User) => 
      $fetch(`/api/users/${id}`, { method: 'PUT', body: data })
  }
}

// 問題：無法在測試中使用 Mock
// 問題：無法切換不同的 Fetcher 實作
```

#### 在 Composables 中的應用

```typescript
// 好的範例：依賴注入
export function useRescueRequestDetails(
  requestId: string,
  fetcher: Fetcher = $fetch // 預設值，但可以注入
) {
  const { data, pending, error } = useAsyncData(
    `rescue-request-${requestId}`,
    () => fetcher(`/api/rescue-requests/${requestId}/details`)
  )
  
  return { data, pending, error }
}

// 使用：可以注入不同的 Fetcher
const { data } = useRescueRequestDetails('123', $fetch)
const { data: mockData } = useRescueRequestDetails('123', mockFetcher)
```

### 最佳實踐

1. 透過參數注入依賴
   - 不要硬編碼外部依賴
   - 使用函數參數或預設值

2. 定義清晰的函數簽名
   - 使用 TypeScript 類型定義抽象介面
   - 例如：`type Fetcher = (url: string) => Promise<any>`

3. 提供預設實作
   - 為常用依賴提供預設值
   - 例如：`fetcher: Fetcher = $fetch`

### 常見錯誤

1. 在函數內部直接使用全局依賴
   ```typescript
   // 錯誤：直接使用全局依賴
   function getUser(id: string) {
     return $fetch(`/api/users/${id}`) // 硬編碼 $fetch
   }
   
   // 正確：透過參數注入
   function getUser(id: string, fetcher: Fetcher = $fetch) {
     return fetcher(`/api/users/${id}`)
   }
   ```

2. 在 Composables 中硬編碼 API 路徑
   ```typescript
   // 錯誤：硬編碼 API 路徑
   export function useRescueRequest(id: string) {
     return useFetch(`/api/rescue-requests/${id}`) // 硬編碼路徑
   }
   
   // 正確：可配置的路徑
   export function useRescueRequest(
     id: string,
     basePath: string = '/api/rescue-requests'
   ) {
     return useFetch(`${basePath}/${id}`)
   }
   ```

---

## 介面隔離（Interface Segregation）

### 定義

介面隔離原則是指客戶端不應該依賴它不需要的介面。在函數式編程中，這意味著只導出必要的函數，隱藏實作細節。

### 函數式編程中的對應

在函數式編程中，介面隔離透過以下方式實現：
- 模組導出：只導出必要的函數
- 私有函數：不導出內部實作函數
- 函數簽名：只暴露必要的參數

### 範例

#### 好的範例：只導出必要的函數

```typescript
// 內部函數：不導出
function validateEmail(email: string): boolean {
  return email.includes('@') && email.includes('.')
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// 公開函數：只導出必要的
export function processEmail(email: string): string | null {
  const sanitized = sanitizeEmail(email)
  
  if (!validateEmail(sanitized)) {
    return null
  }
  
  return sanitized
}

// 客戶端只需要 processEmail，不需要知道內部實作
```

#### 避免的範例：導出過多函數

```typescript
// 錯誤：導出所有函數
export function validateEmail(email: string): boolean { ... }
export function sanitizeEmail(email: string): string { ... }
export function formatEmail(email: string): string { ... }
export function processEmail(email: string): string | null { ... }

// 問題：客戶端可能直接使用內部函數
// 問題：如果內部實作改變，會影響所有使用內部函數的地方
```

#### 在 Composables 中的應用

```typescript
// 好的範例：只導出必要的 API
export function useRescueRequestDetails(requestId: string) {
  // 內部狀態：不導出
  const internalCache = ref<Map<string, any>>(new Map())
  
  // 內部函數：不導出
  function getCachedData(key: string) {
    return internalCache.value.get(key)
  }
  
  function setCachedData(key: string, value: any) {
    internalCache.value.set(key, value)
  }
  
  // 公開 API：只導出必要的
  const { data, pending, error, refresh } = useFetch(
    `/api/rescue-requests/${requestId}/details`
  )
  
  return {
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),
    refresh
    // 不導出 internalCache、getCachedData、setCachedData
  }
}
```

### 最佳實踐

1. 只導出必要的函數
   - 內部實作函數不應該導出
   - 只導出客戶端需要的 API

2. 使用 readonly 保護資料
   - 對於不需要修改的資料，使用 `readonly()` 包裝
   - 防止客戶端意外修改

3. 隱藏實作細節
   - 內部狀態和函數不應該暴露
   - 只暴露必要的介面

### 常見錯誤

1. 導出所有函數
   ```typescript
   // 錯誤：導出所有函數
   export function validateEmail(email: string): boolean { ... }
   export function sanitizeEmail(email: string): string { ... }
   export function processEmail(email: string): string | null { ... }
   
   // 正確：只導出必要的
   export function processEmail(email: string): string | null { ... }
   // validateEmail 和 sanitizeEmail 不導出
   ```

2. 暴露內部狀態
   ```typescript
   // 錯誤：暴露內部狀態
   export function useRescueRequest(id: string) {
     const cache = ref({})
     const data = ref(null)
     
     return { cache, data } // 暴露了 cache
   }
   
   // 正確：只暴露必要的
   export function useRescueRequest(id: string) {
     const cache = ref({}) // 內部狀態
     const data = ref(null)
     
     return { data: readonly(data) } // 只暴露 data
   }
   ```

---

## KISS 原則（Keep It Simple, Stupid）

### 定義

KISS 原則是指保持簡單，避免不必要的複雜。在 MVP 階段，這意味著優先選擇最簡單的解決方案，而非最完美的解決方案。

### 與函數式編程的關係

KISS 原則與函數式編程相輔相成：
- 函數式編程透過純函數和組合降低複雜度
- KISS 原則幫助我們避免過度抽象
- 兩者共同目標：保持程式碼簡單易懂

### 範例

#### 好的範例：簡單直接的解決方案

```typescript
// 簡單直接：直接計算距離
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 使用
const distance = calculateDistance(25.0, 121.5, 24.0, 120.5)
```

#### 避免的範例：過度抽象

```typescript
// 過度抽象：引入不必要的複雜度
interface DistanceCalculator {
  calculate(point1: Point, point2: Point): number
}

class HaversineCalculator implements DistanceCalculator {
  calculate(point1: Point, point2: Point): number { ... }
}

class EuclideanCalculator implements DistanceCalculator {
  calculate(point1: Point, point2: Point): number { ... }
}

class DistanceCalculatorFactory {
  create(type: 'haversine' | 'euclidean'): DistanceCalculator { ... }
}

// 問題：在 MVP 階段，我們只需要一種計算方式
// 問題：引入了不必要的抽象層
```

#### 在 Composables 中的應用

```typescript
// 好的範例：簡單直接的 Composable
export function useRescueRequestDetails(requestId: string) {
  const { data, pending, error } = useFetch(
    `/api/rescue-requests/${requestId}/details`
  )
  
  return { data, pending, error }
}

// 避免的範例：過度抽象
export function useRescueRequestDetails(requestId: string) {
  // 引入策略模式（過度設計）
  const strategy = useRequestFetchStrategy('standard')
  const cache = useRequestCache('memory')
  const validator = useRequestValidator('strict')
  
  // 問題：在 MVP 階段，這些抽象都是不必要的
}
```

### 最佳實踐

1. 優先選擇最簡單的解決方案
   - 如果一個簡單函數就能解決問題，不要引入複雜的抽象
   - 在 MVP 階段，簡單性優先於完美性

2. 避免過早抽象
   - 不要為了「未來可能的需求」而過度設計
   - 當真正需要時，再進行抽象

3. 保持函數簡短
   - 函數長度限制：50 行
   - 如果超過，考慮拆分

4. 可解釋性測試
   - 如果無法在 30 秒內解釋清楚，可能過於複雜
   - 考慮簡化或重構

### 常見錯誤

1. 過度抽象
   ```typescript
   // 錯誤：過度抽象
   function createDataProcessor<T>(
     fetcher: Fetcher<T>,
     transformer: Transformer<T>,
     validator: Validator<T>,
     cache: Cache<T>
   ) {
     // 複雜的抽象層
   }
   
   // 正確：簡單直接
   function fetchAndProcessData(url: string) {
     const data = await $fetch(url)
     return transformData(data)
   }
   ```

2. 引入不必要的設計模式
   ```typescript
   // 錯誤：引入策略模式（但只有一種策略）
   interface MatchingStrategy {
     match(request: RescueRequest, helpers: Helper[]): Helper
   }
   
   class SimpleMatchingStrategy implements MatchingStrategy {
     match(request: RescueRequest, helpers: Helper[]): Helper {
       // 只有一種實作
     }
   }
   
   // 正確：直接實作
   function matchHelper(
     request: RescueRequest,
     helpers: Helper[]
   ): Helper {
     // 直接實作匹配邏輯
   }
   ```

---

## 原則之間的關係

### 協同作用

這些原則不是孤立的，而是相互協同：

1. 單一職責 + KISS
   - 單一職責幫助我們保持函數簡單
   - KISS 幫助我們避免過度拆分

2. 依賴反轉 + 介面隔離
   - 依賴反轉透過參數注入依賴
   - 介面隔離確保只注入必要的依賴

3. 函數式編程 + 所有輔助原則
   - 函數式編程提供整體風格
   - 輔助原則幫助優化設計

### 衝突處理

當原則衝突時，參考以下優先級：

1. 主要原則優先（函數式編程）
2. KISS 原則（在 MVP 階段特別重要）
3. 其他輔助原則

例如：
- 如果函數式編程與單一職責衝突，優先保持函數式風格
- 如果單一職責與 KISS 衝突，在 MVP 階段優先 KISS

---

## 總結

設計原則幫助我們優化函數式編程的實作：

1. 單一職責：每個函數只做一件事
2. 依賴反轉：透過參數注入依賴
3. 介面隔離：只導出必要的函數
4. KISS 原則：保持簡單，避免過度設計

在實作時，應該：
- 同時應用主要原則和輔助原則
- 當原則衝突時，主要原則優先
- 在 MVP 階段，KISS 原則特別重要

---

文檔版本：v1.0
最後更新：2025
維護者：待指定

