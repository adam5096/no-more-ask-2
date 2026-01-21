---
description: 定義本專案適用的設計原則，結合 SOLID 的函數式對應與 KISS 原則，特別針對 MVP 階段優化
---

---

## 概述與層級

1. **核心範式**：函數式編程 (Functional Programming)。
2. **設計指導**：SOLID 的函數式轉譯 + KISS 原則。

**衝突處理優先序**：
- 函數式風格優先 > KISS (MVP 階段首選) > 其他輔助原則。

---

## 1. 單一職責 (Single Responsibility)

**核心**：一個函數只做一件事。在 FP 中，透過「函數組合」達成複雜任務。

### 範例：好的實踐 vs 避免做法
```typescript
// ✅ 好的：職責拆分
const getUser = (id: string) => $fetch(`/api/users/${id}`)
const validateUser = (user: User) => !!(user.email && user.nickname)
const formatUser = (user: User) => ({ ...user, displayName: `${user.nickname} (${user.email})` })

// 組合使用
async function processUser(id: string) {
  const user = await getUser(id)
  return validateUser(user) ? formatUser(user) : null
}

// ❌ 避免：一個函數做多件事 (獲取 + 驗證 + 格式化 + 發通知)
async function badProcessUser(id: string) {
  const user = await $fetch(...) 
  if (!user.email) return null
  const formatted = { ... }
  await sendNotification(...) // 額外職責
  return formatted
}
```

### Composables 應用
- 一個 Composable 只負責一個業務領域（如 `useRescueRequest`）。
- 避免在 `useDashboard` 裡混合請求、Helper、通知等多個無關邏輯。

---

## 2. 依賴反轉 (Dependency Inversion)

**核心**：高層不依賴低層，兩者皆依賴「抽象」（函數參數/簽名）。

### 高階函數與注入
```typescript
type Fetcher = (url: string) => Promise<any>

// ✅ 好的：透過參數注入依賴，便於 Mock 或切換實作
const createUserService = (fetcher: Fetcher = $fetch) => ({
  getUser: (id: string) => fetcher(`/api/users/${id}`)
})

// ❌ 避免：硬編碼全局依賴
const badUserService = () => ({
  getUser: (id: string) => $fetch(`/api/users/${id}`) // 難以測試
})
```

---

## 3. 介面隔離 (Interface Segregation)

**核心**：只導出必要的內容，隱藏實作細節。

### 模組導出與 Readonly 保護
- **不要導出所有函數**：內部驗證/清理函數應保持私有。
- **保護狀態**：使用 `readonly()` 包裝導出的狀態，防止外部竄改。

```typescript
export function useRescueDetails(id: string) {
  const internalCache = ref(new Map()) // 私有
  const { data, ...rest } = useFetch(`/api/rescue/${id}`)
  
  return {
    data: readonly(data), // 保護數據
    refresh: rest.refresh
  }
}
```

---

## 4. KISS 原則 (Keep It Simple, Stupid)

**核心**：保持簡單。在 MVP 階段，簡單解決方案優於過度設計。

### 避免過早抽象
- **避免策略模式 (Strategy)**：如果只有一種算法，直接寫成函數就好。
- **避免多層 Factory**：除非業務複雜到需要，否則直接調用最簡單。

```typescript
// ✅ 好的：直接計算 (KISS)
const calcDistance = (p1, p2) => { /* Haversine direct implementation */ }

// ❌ 避免：為了將來「可能」的需求引入 Interface/Factory/Strategy
interface ICalc { ... }
class HaversineCalc implements ICalc { ... }
class CalcFactory { ... } 
```

---

## 總結與檢查清單

1. **簡短**：函數長度盡量限制在 50 行內。
2. **可解釋性**：如果 30 秒內解釋不清楚邏輯，則過於複雜。
3. **低耦合**：依賴應透過參數傳遞，狀態應被保護。

---
**版本**：v1.0 (精簡版) | **更新**：2025
維護者：待指定

