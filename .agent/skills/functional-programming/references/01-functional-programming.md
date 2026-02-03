---
description: 函數式編程原則：定義本專案適用的函數式編程原則與實作方式
---

## 概述

函數式編程是本專案的主要設計範式。我們優先使用函數而非類別，透過純函數、不可變性和函數組合來構建應用程式。這符合 Vue 3 Composition API 和 Nuxt 3 的設計理念。

### 為什麼選擇函數式編程？

1. 符合現代前端開發趨勢
   - Vue 3 Composition API 採用函數式風格
   - React Hooks 也是函數式設計
   - 函數式編程在前端領域已成為主流

2. 提升程式碼品質
   - 純函數易於測試和除錯
   - 不可變性減少副作用
   - 函數組合提高重用性

3. 符合專案需求
   - MVP 階段需要快速迭代
   - 函數式編程降低複雜度
   - 與 Nuxt 3 的設計理念一致

### 核心概念

函數式編程的核心概念包括：
- 函數是第一等公民（Functions as First-Class Citizens）
- 純函數（Pure Functions）
- 不可變性（Immutability）
- 函數組合（Function Composition）
- 高階函數（Higher-Order Functions）

---

## 純函數（Pure Functions）

### 定義

純函數是指滿足以下條件的函數：
1. 相同輸入總是產生相同輸出
2. 沒有副作用（不修改外部狀態）
3. 不依賴外部可變狀態

### 範例

#### 好的範例：純函數

```typescript
// 純函數：計算距離
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // 地球半徑（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 純函數：驗證用戶資料
function validateUser(user: User): ValidationResult {
  const errors: string[] = []
  
  if (!user.email || !user.email.includes('@')) {
    errors.push('Email 格式不正確')
  }
  
  if (!user.nickname || user.nickname.length < 2) {
    errors.push('暱稱至少需要 2 個字元')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
```

#### 避免的範例：非純函數

```typescript
// 非純函數：有副作用（修改外部狀態）
let cache: Record<string, any> = {}

function getUser(id: string): User {
  if (cache[id]) {
    return cache[id] // 依賴外部可變狀態
  }
  const user = fetchUser(id)
  cache[id] = user // 修改外部狀態
  return user
}

// 非純函數：依賴外部可變狀態
let currentUser: User | null = null

function isCurrentUser(user: User): boolean {
  return currentUser?.id === user.id // 依賴外部可變狀態
}
```

### 最佳實踐

1. 優先使用純函數
   - 將副作用（API 呼叫、狀態更新）分離到專門的函數
   - 保持計算邏輯的純粹性

2. 標記副作用
   - 如果必須使用副作用，在函數名稱或註解中明確標記
   - 例如：`fetchUserData`、`updateUserCache`

3. 測試友善
   - 純函數易於單元測試
   - 不需要 Mock 外部依賴

### 常見錯誤

1. 在純函數中修改輸入參數
   ```typescript
   // 錯誤：修改輸入參數
   function processUser(user: User): User {
     user.name = user.name.trim() // 修改了輸入
     return user
   }
   
   // 正確：創建新物件
   function processUser(user: User): User {
     return {
       ...user,
       name: user.name.trim()
     }
   }
   ```

2. 在純函數中執行副作用
   ```typescript
   // 錯誤：在純函數中執行副作用
   function calculateTotal(items: Item[]): number {
     console.log('計算總額') // 副作用
     return items.reduce((sum, item) => sum + item.price, 0)
   }
   
   // 正確：分離副作用
   function calculateTotal(items: Item[]): number {
     return items.reduce((sum, item) => sum + item.price, 0)
   }
   
   // 在呼叫處處理副作用
   const total = calculateTotal(items)
   console.log('計算總額', total)
   ```

---

## 不可變性（Immutability）

### 定義

不可變性是指資料一旦創建就不能被修改。任何變更都應該創建新的資料結構，而不是修改原有的。

### 範例

#### 好的範例：不可變操作

```typescript
// 更新物件：創建新物件
const user: User = { id: '1', name: 'John', email: 'john@example.com' }

// 錯誤：直接修改
// user.name = 'Jane' // 違反不可變性

// 正確：創建新物件
const updatedUser = {
  ...user,
  name: 'Jane'
}

// 更新陣列：創建新陣列
const items: Item[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' }
]

// 錯誤：直接修改
// items.push({ id: '3', name: 'Item 3' }) // 違反不可變性

// 正確：創建新陣列
const newItems = [
  ...items,
  { id: '3', name: 'Item 3' }
]

// 或者使用函數式方法
const newItems = items.concat({ id: '3', name: 'Item 3' })
```

#### Vue 3 中的不可變性

```typescript
// 在 Composables 中使用不可變性
export function useRescueRequest(requestId: string) {
  const request = ref<RescueRequest | null>(null)
  
  // 更新請求狀態：創建新物件
  function updateRequestStatus(status: RequestStatus) {
    if (!request.value) return
    
    // 正確：創建新物件
    request.value = {
      ...request.value,
      status,
      updatedAt: new Date()
    }
  }
  
  return {
    request: readonly(request),
    updateRequestStatus
  }
}
```

### 最佳實踐

1. 使用展開運算符
   - 物件：`{ ...obj, key: value }`
   - 陣列：`[...array, item]` 或 `array.concat(item)`

2. 使用 Vue 3 的 readonly
   - 對於不需要修改的響應式資料，使用 `readonly()` 包裝
   - 防止意外修改

3. 深層更新
   - 對於巢狀物件，需要深層展開
   - 考慮使用 `structuredClone()` 或工具函數

### 常見錯誤

1. 直接修改響應式資料
   ```typescript
   // 錯誤：直接修改
   const user = ref({ name: 'John' })
   user.value.name = 'Jane' // 雖然 Vue 3 允許，但違反不可變性原則
   
   // 正確：創建新物件
   user.value = { ...user.value, name: 'Jane' }
   ```

2. 在陣列操作中修改原陣列
   ```typescript
   // 錯誤：使用會修改原陣列的方法
   const items = ref([1, 2, 3])
   items.value.push(4) // 修改了原陣列
   
   // 正確：創建新陣列
   items.value = [...items.value, 4]
   ```

---

## 函數組合（Function Composition）

### 定義

函數組合是指將多個小函數組合成一個大函數，每個小函數負責一個特定的任務。

### 範例

#### 基本組合

```typescript
// 小函數：單一職責
function validateEmail(email: string): boolean {
  return email.includes('@') && email.includes('.')
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function formatEmail(email: string): string {
  return `Email: ${email}`
}

// 組合函數：依序執行
function processEmail(email: string): string | null {
  const sanitized = sanitizeEmail(email)
  
  if (!validateEmail(sanitized)) {
    return null
  }
  
  return formatEmail(sanitized)
}
```

#### 使用 pipe 模式

```typescript
// 定義 pipe 工具函數
function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (value: T) => fns.reduce((acc, fn) => fn(acc), value)
}

// 使用 pipe 組合函數
const processUser = pipe(
  sanitizeEmail,
  validateEmail,
  formatEmail
)

const result = processUser('  JOHN@EXAMPLE.COM  ')
```

#### 在 Composables 中的組合

```typescript
// 小函數：獲取資料
function fetchRequest(id: string): Promise<RescueRequest> {
  return $fetch(`/api/rescue-requests/${id}`)
}

// 小函數：轉換資料
function transformRequest(request: RescueRequest): TransformedRequest {
  return {
    ...request,
    displayStatus: getStatusText(request.status),
    formattedDate: formatDate(request.createdAt)
  }
}

// 小函數：驗證資料
function validateRequest(request: RescueRequest): boolean {
  return request.id !== null && request.userId !== null
}

// 組合函數：完整的資料處理流程
export async function useRescueRequestDetails(id: string) {
  const request = await fetchRequest(id)
  
  if (!validateRequest(request)) {
    throw new Error('Invalid request')
  }
  
  return transformRequest(request)
}
```

### 最佳實踐

1. 保持函數小而專注
   - 每個函數只做一件事
   - 易於測試和重用

2. 使用明確的函數名稱
   - 函數名稱應該清楚表達其功能
   - 例如：`validateEmail`、`sanitizeInput`、`formatDate`

3. 組合而非繼承
   - 優先使用函數組合
   - 避免使用類別繼承

### 常見錯誤

1. 函數過於複雜
   ```typescript
   // 錯誤：一個函數做太多事
   function processUserData(user: User): ProcessedUser {
     // 驗證
     if (!user.email.includes('@')) throw new Error('Invalid email')
     // 清理
     user.email = user.email.trim().toLowerCase()
     // 格式化
     user.name = user.name.toUpperCase()
     // 轉換
     return { ...user, displayName: `${user.name} (${user.email})` }
   }
   
   // 正確：拆分為多個小函數
   function validateUser(user: User): boolean { ... }
   function sanitizeUser(user: User): User { ... }
   function formatUser(user: User): ProcessedUser { ... }
   
   function processUserData(user: User): ProcessedUser {
     if (!validateUser(user)) throw new Error('Invalid user')
     const sanitized = sanitizeUser(user)
     return formatUser(sanitized)
   }
   ```

---

## 高階函數（Higher-Order Functions）

### 定義

高階函數是指接受函數作為參數，或返回函數作為結果的函數。

### 範例

#### 接受函數作為參數

```typescript
// 高階函數：過濾陣列
function filterRequests(
  requests: RescueRequest[],
  predicate: (request: RescueRequest) => boolean
): RescueRequest[] {
  return requests.filter(predicate)
}

// 使用
const pendingRequests = filterRequests(
  allRequests,
  (request) => request.status === 'pending'
)

const highPriorityRequests = filterRequests(
  allRequests,
  (request) => request.stressLevel >= 4
)
```

#### 返回函數

```typescript
// 高階函數：創建過濾器
function createStatusFilter(status: RequestStatus) {
  return (request: RescueRequest) => request.status === status
}

// 使用
const pendingFilter = createStatusFilter('pending')
const matchedFilter = createStatusFilter('matched')

const pendingRequests = allRequests.filter(pendingFilter)
const matchedRequests = allRequests.filter(matchedFilter)
```

#### 在 Composables 中的應用

```typescript
// 高階函數：創建 Fetcher
function createFetcher<T>(baseConfig: FetchConfig) {
  return async (url: string, options?: FetchOptions): Promise<T> => {
    return $fetch<T>(url, {
      ...baseConfig,
      ...options
    })
  }
}

// 使用：創建不同類型的 Fetcher
const apiFetcher = createFetcher<RescueRequest>({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

const publicFetcher = createFetcher<any>({
  baseURL: '/public',
  headers: {}
})

// 在 Composables 中使用
export function useRescueRequest(id: string) {
  const { data, pending, error } = useAsyncData(
    `rescue-request-${id}`,
    () => apiFetcher(`/rescue-requests/${id}`)
  )
  
  return { data, pending, error }
}
```

#### 依賴注入模式

```typescript
// 高階函數：依賴注入
function createUserService(fetcher: Fetcher) {
  return {
    getUser: (id: string) => fetcher(`/api/users/${id}`),
    updateUser: (id: string, data: User) => 
      fetcher(`/api/users/${id}`, { method: 'PUT', body: data })
  }
}

// 使用：可以注入不同的 Fetcher
const httpUserService = createUserService(httpFetcher)
const mockUserService = createUserService(mockFetcher)

// 在測試中使用 Mock
const testService = createUserService(mockFetcher)
```

### 最佳實踐

1. 使用高階函數實現依賴注入
   - 透過函數參數注入依賴
   - 提高可測試性和靈活性

2. 創建可重用的函數工廠
   - 使用高階函數創建相似的函數
   - 減少程式碼重複

3. 保持函數簽名一致
   - 相同類型的函數應該有相同的簽名
   - 便於組合和替換

### 常見錯誤

1. 硬編碼依賴
   ```typescript
   // 錯誤：硬編碼依賴
   function getUserService() {
     return {
       getUser: (id: string) => fetch(`/api/users/${id}`) // 硬編碼 fetch
     }
   }
   
   // 正確：依賴注入
   function createUserService(fetcher: Fetcher) {
     return {
       getUser: (id: string) => fetcher(`/api/users/${id}`)
     }
   }
   ```

---

## 總結

函數式編程是本專案的主要設計範式，透過純函數、不可變性、函數組合和高階函數來構建應用程式。這些原則幫助我們：

1. 提升程式碼品質：純函數易於測試，不可變性減少錯誤
2. 提高重用性：函數組合和高階函數提高程式碼重用性
3. 降低複雜度：函數式風格降低程式碼複雜度

在實作時，應該：
- 優先使用純函數
- 保持資料不可變
- 透過函數組合構建複雜邏輯
- 使用高階函數實現依賴注入

---

文檔版本：v1.0
最後更新：2025
維護者：待指定

