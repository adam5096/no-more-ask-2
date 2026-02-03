---
description: 提供實際應用案例與原則衝突處理機制
---

# 實際應用案例 (v1.0)

> **說明**：本文範例為參考模型，旨在展示原則應用，實際開發時應依業務需求彈性調整。

---

## Composables 設計模式

### 1. 資料獲取與保護 (Simple)
只負責獲取，並用 `readonly` 保護輸出的響應式狀態。
```typescript
export function useRescueDetails(id: string) {
  const { data, pending, error, refresh } = useFetch(`/api/rescue/${id}/details`, {
    transform: (d: any) => d.request // 可以在此進行資料轉換
  })
  return { data: readonly(data), pending: readonly(pending), refresh }
}
```

### 2. 副作用分離 (Actions)
將純函數計算（`canCancel`）與副作用操作（`cancelRequest`）分離。
```typescript
export function useRescueActions(id: string) {
  const { data, refresh } = useRescueDetails(id)
  const canCancel = computed(() => data.value?.status === 'pending')

  async function cancelRequest() {
    if (!canCancel.value) return
    await $fetch(`/api/rescue/${id}`, { method: 'PATCH', body: { status: 'cancelled' } })
    await refresh()
  }
  return { canCancel: readonly(canCancel), cancelRequest }
}
```

### 3. 高階 Composable 創建 (Advanced)
使用工廠函數減少重複邏輯。
```typescript
const createDetails = <T>(resource: string) => (id: string) => {
  const { data, ...rest } = useFetch(`/api/${resource}/${id}`)
  return { data: readonly(data), ...rest }
}
export const useUserStore = createDetails<User>('users')
```

---

## 實際應用案例

### 1. 匹配邏輯 (純函數優先)
將演算法寫成純函數，Composable 只負責整合資料與響應。
```typescript
// 純函數：易於測試
const calcScore = (req, helper) => {
  const dist = getDistance(req.loc, helper.loc)
  return (1 / (1 + dist)) * 0.6 + (helper.skillMatch ? 0.4 : 0)
}

export function useMatching(request: Request) {
  const { data: helpers } = useHelperList()
  const bestMatch = computed(() => {
    if (!helpers.value) return null
    return helpers.value.sort((a,b) => calcScore(request, b) - calcScore(request, a))[0]
  })
  return { bestMatch }
}
```

### 2. 表單處理 (衍生狀態)
利用 `computed` 處理驗證，避免手動同步狀態。
```typescript
export function useRequestForm() {
  const form = ref({ type: '', level: 3 })
  const validation = computed(() => ({
    isValid: !!form.value.type,
    errors: !form.value.type ? '必填' : ''
  }))

  const submit = async () => {
    if (!validation.value.isValid) return
    await $fetch('/api/rescue', { method: 'POST', body: form.value })
  }
  return { form, validation: readonly(validation), submit }
}
```

---

## 原則衝突處理決策

當原則發生衝突時，決策優先級：
1. **主要範式 (FP)**：保持函數純淨、不可變。
2. **KISS 原則**：MVP 階段避免過度設計（如：不需要為單一實作建立 Strategy）。
3. **輔助原則 (SOLID)**：優化代碼結構。

**決策流程**：
判斷衝突 -> 依優先級選方案 -> 記錄原因 -> 設定未來重構點。

---

## Code Review 檢查清單
- [ ] **FP**: 是否優先用純函數？資料是否不可變？
- [ ] **SOLID**: 是否 SRP（單一職責）？依賴是否注入？
- [ ] **Composables**: 是否分離副作用？是否用 `readonly` 保護資料？
- [ ] **KISS**: 解決方案是否過於複雜（過度設計）？

---
**版本**：v1.0 (精簡版) | **最後更新**：2025
維護者：待指定
