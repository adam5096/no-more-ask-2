# 副作用處理策略

版本：v1.0
建立日期：2025
目的：說明在追求純函數過程中，處理不可避免副作用的策略與分層架構

---

## 概述

在真實開發中，由於業務邏輯的複雜性，幾乎不可能實現 100% 的純函數。副作用（Side Effects）是不可避免的，包括：

- API 呼叫與資料庫操作
- 狀態更新與快取管理
- UI 更新與使用者互動
- 日誌記錄與錯誤處理
- 路由導航與權限檢查

本文檔提供實用的策略，幫助開發者在保持函數式編程風格的同時，妥善處理這些不可避免的副作用。

### 核心原則

1. 不追求 100% 純函數
   - 接受必要的副作用
   - 但要明確標記和管理

2. 分層處理副作用
   - 核心邏輯保持純函數
   - 副作用集中在邊界層

3. 漸進式改進
   - 先讓程式碼運作
   - 逐步重構提高純度

4. 明確標記副作用
   - 使用命名約定
   - 使用註解和類型

詳細的實務處理流程與案例請參考：[05-side-effect-practices.md](./05-side-effect-practices.md)

---

## 副作用處理策略

### 策略 1：分離純函數與副作用（Separation of Concerns）

核心概念：將純函數與副作用分開，而不是混在一起。

#### 實作方式

```typescript
// 參考模型：分離純函數與副作用
// 實際實作應根據真實業務邏輯調整

// 純函數：計算邏輯
function calculateMatchScore(
  request: RescueRequest,
  helper: Helper
): number {
  // 純計算，無副作用
  const distance = calculateDistance(request.location, helper.location)
  const skillMatch = calculateSkillMatch(request.skills, helper.skills)
  return distance * 0.6 + skillMatch * 0.4
}

// 副作用函數：明確標記
async function saveMatchResult(
  requestId: string,
  helperId: string,
  score: number
): Promise<void> {
  // 明確的副作用：API 呼叫、資料庫寫入
  await $fetch('/api/matches', {
    method: 'POST',
    body: { requestId, helperId, score }
  })
}

// 組合使用
async function matchAndSave(
  request: RescueRequest,
  helpers: Helper[]
): Promise<Helper | null> {
  // 1. 純函數計算
  const scores = helpers.map(helper => ({
    helper,
    score: calculateMatchScore(request, helper)
  }))
  const bestMatch = scores.reduce((best, current) =>
    current.score > best.score ? current : best
  )
  
  // 2. 副作用處理
  if (bestMatch.score > 0.5) {
    await saveMatchResult(request.id, bestMatch.helper.id, bestMatch.score)
    return bestMatch.helper
  }
  
  return null
}
```

#### 優點

- 純函數部分易於測試
- 副作用部分明確標記
- 邏輯清晰，易於維護

#### 適用場景

- 計算邏輯與副作用可以清楚分離
- 需要對計算邏輯進行單元測試
- 副作用操作相對獨立

---

### 策略 2：副作用邊界（Effect Boundary）

核心概念：在特定邊界內允許副作用，但保持邊界外的純函數。

#### 實作方式

```typescript
// 參考模型：副作用邊界
// 實際實作應根據真實業務邏輯調整

// 邊界外：純函數
function validateRequest(request: RescueRequest): ValidationResult {
  // 純函數：只做驗證
  const errors: string[] = []
  if (!request.location) errors.push('缺少地理位置')
  if (request.stressLevel < 1 || request.stressLevel > 5) {
    errors.push('壓力等級無效')
  }
  return { isValid: errors.length === 0, errors }
}

function transformRequest(form: FormData): RescueRequest {
  // 純函數：只做轉換
  return {
    requestType: form.type,
    stressLevel: form.stressLevel,
    location: { lat: form.lat, lng: form.lng }
  }
}

// 邊界內：允許副作用
export function useRescueRequestForm() {
  const form = ref<FormData>({ ... })
  
  async function submit() {
    // 邊界開始：這裡允許副作用
    
    // 1. 使用純函數驗證
    const request = transformRequest(form.value)
    const validation = validateRequest(request)
    
    if (!validation.isValid) {
      // 副作用：顯示錯誤（UI 更新）
      showErrors(validation.errors)
      return
    }
    
    // 2. 副作用：API 呼叫
    try {
      const result = await $fetch('/api/rescue-requests', {
        method: 'POST',
        body: request
      })
      
      // 副作用：導航
      await navigateTo(`/rescue-requests/${result.id}`)
    } catch (error) {
      // 副作用：錯誤處理
      showError('提交失敗')
    }
    // 邊界結束
  }
  
  return { form, submit }
}
```

#### 優點

- 明確的副作用邊界
- 邊界外的邏輯保持純粹
- 符合 Vue 3 Composables 的設計模式

#### 適用場景

- Composables 和業務邏輯組合
- 需要明確的副作用範圍
- UI 互動與資料處理混合

---

### 策略 3：副作用封裝（Effect Encapsulation）

核心概念：將副作用封裝在專門的函數或模組中，提供清晰的介面。

#### 實作方式

```typescript
// 參考模型：副作用封裝
// 實際實作應根據真實需求調整

// 副作用封裝層
class EffectManager {
  // 封裝所有副作用操作
  async saveRequest(request: RescueRequest): Promise<string> {
    const result = await $fetch('/api/rescue-requests', {
      method: 'POST',
      body: request
    })
    return result.id
  }
  
  async updateRequest(id: string, data: Partial<RescueRequest>): Promise<void> {
    await $fetch(`/api/rescue-requests/${id}`, {
      method: 'PATCH',
      body: data
    })
  }
  
  showNotification(message: string, type: 'success' | 'error'): void {
    // UI 副作用
    toast.show(message, type)
  }
  
  navigate(path: string): void {
    // 路由副作用
    navigateTo(path)
  }
}

// 純函數層
function processRequestData(form: FormData): RescueRequest {
  // 純函數：資料處理
  return { ... }
}

function validateRequest(request: RescueRequest): ValidationResult {
  // 純函數：驗證
  return { ... }
}

// 組合層：使用封裝的副作用
export function useRescueRequestForm() {
  const effects = new EffectManager() // 副作用管理器
  const form = ref<FormData>({ ... })
  
  async function submit() {
    // 1. 純函數處理
    const request = processRequestData(form.value)
    const validation = validateRequest(request)
    
    if (!validation.isValid) {
      effects.showNotification('驗證失敗', 'error')
      return
    }
    
    // 2. 使用封裝的副作用
    try {
      const id = await effects.saveRequest(request)
      effects.showNotification('提交成功', 'success')
      effects.navigate(`/rescue-requests/${id}`)
    } catch (error) {
      effects.showNotification('提交失敗', 'error')
    }
  }
  
  return { form, submit }
}
```

#### 優點

- 副作用集中管理
- 易於 Mock 和測試
- 清晰的職責分離

#### 適用場景

- 多種副作用需要統一管理
- 需要為測試提供 Mock
- 副作用操作較為複雜

---

### 策略 4：函數式副作用處理（Functional Effect Handling）

核心概念：使用函數式的方式處理副作用，例如使用 Result/Either 模式。

#### 實作方式

```typescript
// 參考模型：函數式副作用處理
// 實際實作應根據真實需求調整

// Result 類型：封裝成功或失敗
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

// 純函數：處理業務邏輯
function processRequest(request: RescueRequest): Result<ProcessedRequest> {
  // 純函數邏輯
  if (!request.location) {
    return { success: false, error: new Error('缺少地理位置') }
  }
  
  return {
    success: true,
    data: {
      ...request,
      processedAt: new Date()
    }
  }
}

// 副作用函數：但使用 Result 模式
async function saveRequest(
  request: ProcessedRequest
): Promise<Result<string>> {
  try {
    const id = await $fetch('/api/rescue-requests', {
      method: 'POST',
      body: request
    })
    return { success: true, data: id }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

// 組合使用：函數式鏈式處理
export async function useCreateRequest(form: FormData) {
  // 1. 純函數處理
  const request = transformForm(form)
  const processResult = processRequest(request)
  
  if (!processResult.success) {
    return processResult // 返回錯誤，不執行副作用
  }
  
  // 2. 副作用處理（但使用 Result 模式）
  const saveResult = await saveRequest(processResult.data)
  
  if (!saveResult.success) {
    return saveResult // 返回錯誤
  }
  
  // 3. 成功處理
  return { success: true, data: saveResult.data }
}
```

#### 優點

- 副作用也有明確的類型
- 錯誤處理更清晰
- 符合函數式編程風格

#### 適用場景

- 需要明確的錯誤處理
- 副作用操作可能失敗
- 需要鏈式處理多個操作

---

### 策略 5：漸進式純化（Progressive Purity）

核心概念：不要求 100% 純函數，而是逐步提高純度。

#### 實作方式

```typescript
// 參考模型：漸進式純化
// 實際實作應根據真實需求調整

// 階段 1：混合函數（可接受）
function processRequest(request: RescueRequest): ProcessedRequest {
  // 大部分是純邏輯
  const processed = {
    ...request,
    processedAt: new Date(),
    score: calculateScore(request)
  }
  
  // 少量副作用：記錄日誌（可接受）
  console.log('Request processed:', processed.id)
  
  return processed
}

// 階段 2：分離副作用（更好）
function processRequest(request: RescueRequest): ProcessedRequest {
  // 純邏輯
  return {
    ...request,
    processedAt: new Date(),
    score: calculateScore(request)
  }
}

function logRequest(request: ProcessedRequest): void {
  // 副作用分離
  console.log('Request processed:', request.id)
}

// 使用
const processed = processRequest(request)
logRequest(processed)
```

#### 漸進式改進原則

1. 先讓程式碼能運作（允許少量副作用）
2. 識別副作用並標記
3. 逐步分離副作用
4. 重構為純函數

#### 適用場景

- MVP 階段快速開發
- 逐步重構現有程式碼
- 團隊逐步學習函數式編程

---

### 策略 6：副作用標記與文檔化（Effect Annotation）

核心概念：明確標記副作用，讓開發者知道哪些函數有副作用。

#### 實作方式

```typescript
// 參考模型：副作用標記
// 實際實作應根據真實需求調整

// 使用命名約定標記
// Pure: 純函數
function calculateDistancePure(lat1: number, lng1: number, ...): number {
  // 純函數
}

// Effect: 有副作用
async function saveRequestEffect(request: RescueRequest): Promise<string> {
  // 有副作用
}

// 使用註解標記
/**
 * 計算匹配分數（純函數）
 * @pure
 */
function calculateMatchScore(...): number { ... }

/**
 * 儲存請求（有副作用：API 呼叫、資料庫寫入）
 * @effect API, Database
 */
async function saveRequest(...): Promise<string> { ... }

// 使用 TypeScript 類型標記
type PureFunction<T, R> = (arg: T) => R
type EffectFunction<T, R> = (arg: T) => Promise<R> | void

const calculateScore: PureFunction<RescueRequest, number> = (request) => {
  // 純函數
}

const saveRequest: EffectFunction<RescueRequest, string> = async (request) => {
  // 副作用
}
```

#### 標記約定

- 函數名稱：使用 `Pure` 或 `Effect` 後綴
- 註解：使用 `@pure` 或 `@effect` 標記
- 類型：使用 `PureFunction` 或 `EffectFunction` 類型

#### 適用場景

- 團隊協作需要明確標記
- 需要文檔化副作用
- Code Review 需要識別副作用

---

## 分層架構

### 推薦的分層架構

```
┌─────────────────────────────────────┐
│  純函數層（Pure Functions）          │
│  - 計算邏輯                          │
│  - 資料轉換                          │
│  - 驗證邏輯                          │
│  目標：100% 純函數                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  副作用邊界層（Effect Boundary）     │
│  - Composables                      │
│  - 業務邏輯組合                      │
│  目標：最小化副作用，明確標記        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  副作用封裝層（Effect Encapsulation）│
│  - API 呼叫                         │
│  - 狀態管理                         │
│  - UI 更新                          │
│  目標：集中管理副作用                │
└─────────────────────────────────────┘
```

### 各層職責

#### 純函數層

- 職責：所有計算邏輯、資料轉換、驗證
- 目標：100% 純函數，無副作用
- 範例：`calculateDistance`、`validateRequest`、`transformData`

#### 副作用邊界層

- 職責：組合純函數與副作用，處理業務邏輯
- 目標：最小化副作用，明確標記
- 範例：`useRescueRequestForm`、`useHelperMatching`

#### 副作用封裝層

- 職責：封裝所有副作用操作
- 目標：集中管理，易於測試和 Mock
- 範例：`EffectManager`、API 服務層

---

## 策略選擇指南

### 根據副作用類型選擇

- API 呼叫：策略 3（封裝）或策略 4（Result 模式）
- UI 更新：策略 2（邊界）或策略 3（封裝）
- 狀態管理：策略 2（邊界）
- 日誌記錄：策略 5（漸進式）或策略 6（標記）

### 根據專案階段選擇

- MVP 階段：策略 5（漸進式）優先
- 穩定階段：策略 1（分離）或策略 2（邊界）
- 重構階段：策略 3（封裝）或策略 4（Result 模式）

### 根據團隊規模選擇

- 小團隊：策略 6（標記）幫助溝通
- 大團隊：策略 3（封裝）統一管理

詳細的實務處理流程與案例請參考：[05-side-effect-practices.md](./05-side-effect-practices.md)

---

文檔版本：v1.0
最後更新：2025
維護者：待指定

