# 副作用實務處理

版本：v1.0
建立日期：2025
目的：提供副作用處理的實務流程、檢查清單與案例

---

## 概述

本文檔提供副作用處理的實務流程與案例，幫助開發者在實際開發中應用副作用處理策略。

相關策略詳述請參考：[04-side-effect-strategies.md](./04-side-effect-strategies.md)

---

## 實務處理流程

### 流程圖

```
開始實作功能
    ↓
識別副作用需求
    ↓
判斷副作用類型
    ├─→ API 呼叫 → 使用策略 3（封裝）或策略 4（Result 模式）
    ├─→ UI 更新 → 使用策略 2（邊界）或策略 3（封裝）
    ├─→ 狀態管理 → 使用策略 2（邊界）
    └─→ 日誌記錄 → 使用策略 5（漸進式）或策略 6（標記）
    ↓
分離純函數與副作用
    ↓
選擇處理策略
    ↓
實作並標記副作用
    ↓
測試純函數部分
    ↓
測試副作用部分（使用 Mock）
    ↓
Code Review 檢查
    ↓
完成
```

### 步驟詳述

#### 步驟 1：識別副作用需求

在實作功能時，先識別哪些操作是副作用：

- API 呼叫：`$fetch`、`useFetch`
- 狀態更新：`ref.value = ...`、`reactive`
- UI 更新：`showNotification`、`navigateTo`
- 日誌記錄：`console.log`、錯誤追蹤
- 快取操作：`localStorage`、`sessionStorage`

#### 步驟 2：判斷副作用類型

根據副作用類型選擇處理策略：

- 簡單副作用（單一操作）：使用策略 1（分離）或策略 2（邊界）
- 複雜副作用（多種操作）：使用策略 3（封裝）
- 可能失敗的操作：使用策略 4（Result 模式）
- 暫時可接受的副作用：使用策略 5（漸進式）或策略 6（標記）

詳細策略說明請參考：[04-side-effect-strategies.md](./04-side-effect-strategies.md)

#### 步驟 3：分離純函數與副作用

將純函數邏輯與副作用分離：

```typescript
// 參考模型：分離純函數與副作用
// 實際實作應根據真實業務邏輯調整

// 識別純函數部分
function calculateLogic(...): Result { ... }

// 識別副作用部分
async function performSideEffect(...): Promise<void> { ... }

// 組合使用
async function businessLogic(...) {
  const result = calculateLogic(...) // 純函數
  if (result.success) {
    await performSideEffect(...) // 副作用
  }
}
```

#### 步驟 4：選擇處理策略

根據情況選擇最適合的策略：

- 如果副作用簡單且獨立：策略 1（分離）
- 如果在 Composables 中：策略 2（邊界）
- 如果副作用複雜或多種：策略 3（封裝）
- 如果需要明確錯誤處理：策略 4（Result 模式）
- 如果 MVP 階段快速開發：策略 5（漸進式）
- 如果需要團隊協作：策略 6（標記）

詳細策略說明請參考：[04-side-effect-strategies.md](./04-side-effect-strategies.md)

#### 步驟 5：實作並標記副作用

實作選擇的策略，並明確標記副作用：

```typescript
// 參考模型：標記副作用
// 實際實作應根據真實需求調整

// 使用命名約定
async function saveRequestEffect(...) { ... }

// 使用註解
/**
 * @effect API, Database
 */
async function saveRequest(...) { ... }

// 使用類型
const saveRequest: EffectFunction<...> = async (...) => { ... }
```

#### 步驟 6：測試

分別測試純函數和副作用：

```typescript
// 參考模型：測試策略
// 實際實作應根據真實測試框架調整

// 測試純函數（無需 Mock）
describe('calculateMatchScore', () => {
  it('should calculate score correctly', () => {
    const score = calculateMatchScore(request, helper)
    expect(score).toBeGreaterThan(0)
  })
})

// 測試副作用（使用 Mock）
describe('saveRequestEffect', () => {
  it('should save request', async () => {
    const mockFetch = vi.fn()
    await saveRequestEffect(request, mockFetch)
    expect(mockFetch).toHaveBeenCalled()
  })
})
```

---

## 檢查清單

### 實作時檢查

在實作功能時，問自己：

1. 這個函數可以變成純函數嗎？
   - 如果可以，優先改為純函數
   - 如果不行，明確標記副作用

2. 副作用是否最小化？
   - 是否只做必要的副作用？
   - 是否可以延遲副作用？

3. 副作用是否明確標記？
   - 函數名稱是否清楚表達有副作用？
   - 是否有註解說明副作用類型？

4. 副作用是否易於測試？
   - 是否可以 Mock 副作用？
   - 是否可以隔離測試純函數部分？

### Code Review 檢查

在 Code Review 時，檢查：

- [ ] 純函數部分是否無副作用？
- [ ] 副作用是否明確標記？
- [ ] 副作用是否集中在邊界層或封裝層？
- [ ] 純函數部分是否易於測試？
- [ ] 副作用部分是否可以使用 Mock 測試？
- [ ] 是否遵循選擇的處理策略？

---

## 實務案例

### 案例 1：救援請求提交流程

#### 需求

實作救援請求提交功能，包括驗證、轉換、提交、導航。

#### 實作

```typescript
// 參考模型：救援請求提交流程
// 實際實作應根據真實業務邏輯調整

// 純函數層
function validateRequestForm(form: FormData): ValidationResult {
  const errors: string[] = []
  if (!form.requestType) errors.push('請選擇請求類型')
  if (form.stressLevel < 1 || form.stressLevel > 5) {
    errors.push('壓力等級無效')
  }
  return { isValid: errors.length === 0, errors }
}

function transformFormToRequest(form: FormData): RescueRequest {
  return {
    requestType: form.requestType,
    stressLevel: form.stressLevel,
    location: { lat: form.lat, lng: form.lng }
  }
}

// 副作用邊界層
export function useRescueRequestForm() {
  const form = ref<FormData>({ ... })
  
  // 衍生狀態：驗證結果（純函數）
  const validation = computed(() => validateRequestForm(form.value))
  
  // 副作用：提交表單
  async function submit() {
    // 1. 純函數驗證
    if (!validation.value.isValid) {
      // 副作用：顯示錯誤
      showErrors(validation.value.errors)
      return
    }
    
    // 2. 純函數轉換
    const request = transformFormToRequest(form.value)
    
    // 3. 副作用：API 呼叫
    try {
      const result = await $fetch('/api/rescue-requests', {
        method: 'POST',
        body: request
      })
      
      // 4. 副作用：導航
      await navigateTo(`/rescue-requests/${result.id}`)
    } catch (error) {
      // 5. 副作用：錯誤處理
      showError('提交失敗')
    }
  }
  
  return { form, validation, submit }
}
```

#### 設計決策

- 使用策略 1（分離）：純函數與副作用分離
- 使用策略 2（邊界）：在 Composable 中處理副作用
- 純函數部分易於測試
- 副作用部分明確標記

---

### 案例 2：Helper 匹配與通知

#### 需求

實作 Helper 匹配邏輯，匹配成功後發送通知。

#### 實作

```typescript
// 參考模型：Helper 匹配與通知
// 實際實作應根據真實業務邏輯調整

// 純函數層
function calculateMatchScore(
  request: RescueRequest,
  helper: Helper
): number {
  const distance = calculateDistance(request.location, helper.location)
  const skillMatch = calculateSkillMatch(request.skills, helper.skills)
  return distance * 0.6 + skillMatch * 0.4
}

function findBestMatch(
  request: RescueRequest,
  helpers: Helper[]
): Helper | null {
  if (helpers.length === 0) return null
  
  const scores = helpers.map(helper => ({
    helper,
    score: calculateMatchScore(request, helper)
  }))
  
  const best = scores.reduce((best, current) =>
    current.score > best.score ? current : best
  )
  
  return best.score > 0.5 ? best.helper : null
}

// 副作用封裝層
class NotificationService {
  async sendMatchNotification(
    requestId: string,
    helperId: string
  ): Promise<void> {
    await $fetch('/api/notifications', {
      method: 'POST',
      body: { type: 'match', requestId, helperId }
    })
  }
}

// 副作用邊界層
export function useHelperMatching(request: RescueRequest) {
  const { data: helpers } = useHelperList()
  const notifications = new NotificationService()
  
  // 純函數：匹配邏輯
  const matchedHelper = computed(() => {
    if (!helpers.value) return null
    return findBestMatch(request, helpers.value)
  })
  
  // 副作用：發送通知
  async function confirmMatch() {
    if (!matchedHelper.value) return
    
    try {
      await notifications.sendMatchNotification(
        request.id,
        matchedHelper.value.id
      )
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }
  
  return {
    matchedHelper: readonly(matchedHelper),
    confirmMatch
  }
}
```

#### 設計決策

- 使用策略 1（分離）：匹配邏輯與通知分離
- 使用策略 3（封裝）：通知服務封裝副作用
- 純函數部分易於測試
- 副作用部分可以 Mock

---

### 案例 3：複雜業務流程處理

#### 需求

實作救援請求的完整生命週期：建立、匹配、進行中、完成、評價。

#### 實作

```typescript
// 參考模型：複雜業務流程處理
// 實際實作應根據真實業務邏輯調整

// 純函數層：狀態轉換邏輯
function canTransitionToStatus(
  currentStatus: RequestStatus,
  targetStatus: RequestStatus
): boolean {
  const validTransitions: Record<RequestStatus, RequestStatus[]> = {
    'pending': ['matched', 'cancelled'],
    'matched': ['in-progress', 'cancelled'],
    'in-progress': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  }
  
  return validTransitions[currentStatus]?.includes(targetStatus) ?? false
}

function calculateNextStatus(
  request: RescueRequest,
  action: 'match' | 'start' | 'complete' | 'cancel'
): RequestStatus | null {
  const statusMap: Record<string, RequestStatus> = {
    'match': 'matched',
    'start': 'in-progress',
    'complete': 'completed',
    'cancel': 'cancelled'
  }
  
  const targetStatus = statusMap[action]
  if (!targetStatus) return null
  
  if (canTransitionToStatus(request.status, targetStatus)) {
    return targetStatus
  }
  
  return null
}

// 副作用封裝層
class RequestService {
  async updateRequestStatus(
    id: string,
    status: RequestStatus
  ): Promise<void> {
    await $fetch(`/api/rescue-requests/${id}`, {
      method: 'PATCH',
      body: { status }
    })
  }
  
  async sendStatusNotification(
    requestId: string,
    status: RequestStatus
  ): Promise<void> {
    await $fetch('/api/notifications', {
      method: 'POST',
      body: { type: 'status-change', requestId, status }
    })
  }
}

// 副作用邊界層
export function useRescueRequestLifecycle(requestId: string) {
  const { data: request, refresh } = useRescueRequestDetails(requestId)
  const service = new RequestService()
  
  // 純函數：計算可執行的操作
  const availableActions = computed(() => {
    if (!request.value) return []
    
    const actions: string[] = []
    if (canTransitionToStatus(request.value.status, 'matched')) {
      actions.push('match')
    }
    if (canTransitionToStatus(request.value.status, 'in-progress')) {
      actions.push('start')
    }
    if (canTransitionToStatus(request.value.status, 'completed')) {
      actions.push('complete')
    }
    if (canTransitionToStatus(request.value.status, 'cancelled')) {
      actions.push('cancel')
    }
    
    return actions
  })
  
  // 副作用：執行狀態轉換
  async function transitionStatus(action: 'match' | 'start' | 'complete' | 'cancel') {
    if (!request.value) return
    
    // 1. 純函數：計算下一個狀態
    const nextStatus = calculateNextStatus(request.value, action)
    
    if (!nextStatus) {
      showError('無法執行此操作')
      return
    }
    
    // 2. 副作用：更新狀態
    try {
      await service.updateRequestStatus(requestId, nextStatus)
      
      // 3. 副作用：發送通知
      await service.sendStatusNotification(requestId, nextStatus)
      
      // 4. 副作用：重新獲取資料
      await refresh()
    } catch (error) {
      showError('操作失敗')
    }
  }
  
  return {
    request: readonly(request),
    availableActions: readonly(availableActions),
    transitionStatus
  }
}
```

#### 設計決策

- 使用策略 1（分離）：狀態轉換邏輯與副作用分離
- 使用策略 3（封裝）：服務層封裝副作用
- 使用策略 2（邊界）：Composable 組合純函數與副作用
- 純函數部分易於測試
- 副作用部分可以 Mock

---

## 決策樹

### 如何選擇處理策略？

```
遇到副作用
    ↓
是簡單的單一操作嗎？
    ├─→ 是 → 在 Composables 中？
    │       ├─→ 是 → 使用策略 2（邊界）
    │       └─→ 否 → 使用策略 1（分離）
    │
    └─→ 否 → 是多種副作用嗎？
            ├─→ 是 → 需要統一管理？
            │       ├─→ 是 → 使用策略 3（封裝）
            │       └─→ 否 → 使用策略 2（邊界）
            │
            └─→ 否 → 可能失敗的操作？
                    ├─→ 是 → 使用策略 4（Result 模式）
                    └─→ 否 → MVP 階段？
                            ├─→ 是 → 使用策略 5（漸進式）
                            └─→ 否 → 使用策略 6（標記）
```

---

## 總結

在真實開發中處理副作用時：

1. 不追求 100% 純函數
   - 接受必要的副作用
   - 但要明確標記和管理

2. 分層處理
   - 核心邏輯保持純函數
   - 副作用集中在邊界層

3. 漸進式改進
   - 先讓程式碼運作
   - 逐步重構提高純度

4. 明確標記
   - 使用命名約定
   - 使用註解和類型

5. 選擇適合的策略
   - 根據副作用類型選擇策略
   - 根據專案階段選擇策略

記住：範例是參考模型，實際實作應根據真實工程需求調整。

相關策略詳述請參考：[04-side-effect-strategies.md](./04-side-effect-strategies.md)

---

文檔版本：v1.0
最後更新：2025
維護者：待指定

