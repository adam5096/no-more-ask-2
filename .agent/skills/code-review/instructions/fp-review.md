# 函數式編程審查指引

基於 `.agent/workflows/construction/programming-paradigms/` 文檔。

---

## 檢查項目

### 1. 純函數 (Pure Functions)

**必須檢查**：
- [ ] 核心業務邏輯是否為純函數？
- [ ] 相同輸入是否總是產生相同輸出？
- [ ] 是否有副作用？（修改外部狀態、API 呼叫、時間戳）
- [ ] 是否依賴外部可變狀態？

**正確範例**：
```typescript
// ✅ 純函數
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

**錯誤範例**：
```typescript
// ❌ 依賴外部狀態
let discount = 0.1
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 - discount)
}
```

---

### 2. 不可變性 (Immutability)

**必須檢查**：
- [ ] 是否避免直接修改參數？
- [ ] 是否使用展開運算符創建新物件？
- [ ] 是否避免直接修改陣列（使用 `map`、`filter`）？
- [ ] 是否避免直接修改 props？

**正確範例**：
```typescript
// ✅ 不可變更新
function updateUser(user: User, name: string): User {
  return { ...user, name }
}
```

**錯誤範例**：
```typescript
// ❌ 直接修改參數
function updateUser(user: User, name: string): void {
  user.name = name
}
```

---

### 3. 副作用隔離

**必須檢查**：
- [ ] 副作用是否集中在 Composable 或 Service Layer？
- [ ] 副作用與純函數邏輯是否分離？

**策略參考**：`.agent/workflows/construction/programming-paradigms/04-side-effect-strategies.md`

---

## 審查時的判斷

| 情況 | 判定 |
|------|------|
| 核心邏輯有副作用 | ❌ 需要修改 |
| Utils 函數有副作用 | ❌ 需要修改 |
| Composable 內有副作用但已隔離 | ✅ 通過 |
| 直接修改參數 | ❌ 需要修改 |
