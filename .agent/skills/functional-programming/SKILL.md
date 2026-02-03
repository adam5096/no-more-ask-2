---
name: functional-programming
description: 根據專案編程範式與設計原則進行 Code Review
---

# Functional Programming Skill

本技能提供函數式編程原則的應用指南與 Code Review 檢查清單，確保程式碼符合專案的編程範式與設計原則。

---

## 使用時機 (When to Use)

在以下情境中使用此 Skill：
- Code Review 時驗證程式碼品質
- 設計 Composables 時參考設計原則
- 處理副作用時查閱處理策略
- 遇到原則衝突時尋求決策指引

---

## 執行步驟 (Execution Steps)

### Step 1: 識別程式碼類型

1. **判斷函數類型**
   - 純函數（Pure Function）：無副作用，相同輸入產生相同輸出
   - 副作用函數（Side Effect Function）：涉及 API 呼叫、狀態更新、I/O 操作

2. **識別程式碼層級**
   - 純函數層：計算邏輯、資料轉換、驗證
   - 副作用邊界層：Composables、API 呼叫
   - 副作用封裝層：Event Handlers、Middleware

### Step 2: 應用檢查清單

根據程式碼類型，使用對應的檢查清單：

#### 純函數檢查清單

- [ ] **相同輸入產生相同輸出**
  - 函數不依賴外部可變狀態
  - 函數不使用隨機數、時間戳等不確定因素
  
- [ ] **無副作用**
  - 不修改輸入參數
  - 不修改外部變數
  - 不執行 I/O 操作（console.log、API 呼叫）
  
- [ ] **不可變性**
  - 使用展開運算符創建新物件：`{ ...obj, key: value }`
  - 使用陣列方法創建新陣列：`[...array, item]`
  - 避免使用 `push`、`splice` 等會修改原陣列的方法

- [ ] **函數組合**
  - 函數保持小而專注（< 50 行）
  - 函數名稱清楚表達其功能
  - 複雜邏輯透過組合多個小函數實現

#### 副作用處理檢查清單

參考 `references/04-side-effect-strategies.md` 的 6 種策略：

- [ ] **策略 1：分層隔離**
  - 純函數層與副作用層明確分離
  - 副作用集中在 Composables 或 Service Layer
  
- [ ] **策略 2：依賴注入**
  - 使用高階函數注入依賴
  - 便於測試與替換實作
  
- [ ] **策略 3：明確標記**
  - 函數名稱標示副作用（如 `fetchUserData`）
  - 註解說明副作用類型
  
- [ ] **策略 4：最小化範圍**
  - 副作用僅在必要時執行
  - 避免在迴圈中執行副作用
  
- [ ] **策略 5：錯誤處理**
  - 副作用函數包含錯誤處理
  - 使用 try-catch 或 Railway Oriented Programming
  
- [ ] **策略 6：可測試性**
  - 副作用可被 Mock
  - 提供測試用的替代實作

#### 設計原則檢查清單

參考 `references/02-design-principles.md`：

- [ ] **單一職責（SRP）**
  - 一個函數只做一件事
  - Composable 只負責一個業務領域
  
- [ ] **依賴反轉（DIP）**
  - 透過參數注入依賴
  - 避免硬編碼全域依賴
  
- [ ] **介面隔離（ISP）**
  - 只導出必要的函數與狀態
  - 使用 `readonly()` 保護狀態
  
- [ ] **KISS 原則**
  - 避免過早抽象
  - 簡單解決方案優於過度設計

### Step 3: 參考實務案例

查閱 `examples/todo-list/` 中的實務案例：

1. **Functional Core 測試**
   - 參考：`examples/todo-list/how-to-test-functional-core.md`
   - 了解如何測試純函數

2. **Railway Oriented Programming**
   - 參考：`examples/todo-list/railway-oriented-programming-for-api.md`
   - 了解如何處理 API 錯誤

3. **狀態持久化**
   - 參考：`examples/todo-list/state-persistence-with-watcheffect.md`
   - 了解如何處理副作用

### Step 4: 處理原則衝突

參考 `references/03-practical-applications.md` 的原則衝突處理機制：

1. **識別衝突**
   - 記錄衝突的原則
   - 評估影響範圍

2. **決策優先序**
   - 函數式風格優先
   - KISS 原則（MVP 階段）
   - 其他輔助原則

3. **記錄決策**
   - 在程式碼中註解說明
   - 設定重構時間點（如果需要）

### Step 5: 輸出 Review 結果

提供 Code Review 結果：

```markdown
## Code Review 結果

### 函數式編程原則
- ✅ 純函數：[通過/需改進]
- ✅ 不可變性：[通過/需改進]
- ✅ 函數組合：[通過/需改進]

### 副作用處理
- ✅ 分層隔離：[通過/需改進]
- ✅ 依賴注入：[通過/需改進]
- ✅ 明確標記：[通過/需改進]

### 設計原則
- ✅ 單一職責：[通過/需改進]
- ✅ 依賴反轉：[通過/需改進]
- ✅ KISS 原則：[通過/需改進]

### 改進建議
1. [具體建議]
2. [具體建議]
```

---

## 參考資源 (References)

### 內部參考

#### 核心概念
- `references/index.md` - 導航文件與快速查找
- `references/01-functional-programming.md` - 函數式編程核心概念
- `references/02-design-principles.md` - 設計原則（SOLID + KISS）
- `references/03-practical-applications.md` - 實務應用與原則衝突處理

#### 副作用處理
- `references/04-side-effect-strategies.md` - 副作用處理策略（6 種策略）
- `references/05-side-effect-practices.md` - 副作用實務處理流程
- `references/fp-memo-01.md` - 函數式編程備忘錄

#### 實務案例
- `examples/todo-list/how-to-test-functional-core.md` - 測試純函數
- `examples/todo-list/railway-oriented-programming-for-api.md` - API 錯誤處理
- `examples/todo-list/state-persistence-with-watcheffect.md` - 狀態持久化
- `examples/todo-list/todo-listi-with-functional-programming.md` - 完整案例

### 相關 Skill/Workflow
- `/code-review-checklist` - Code Review 工作流（下游）
- `/development-workflow` - 開發流程（上游）
- `/api` - API 設計 Skill（依賴注入應用）

### 外部資源
- [Functional Programming in JavaScript](https://mostly-adequate.gitbook.io/mostly-adequate-guide/)
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
- [Composing Software](https://medium.com/javascript-scene/composing-software-the-book-f31c77fc3ddc)

---

## 快速導航

### 按需求查找

- **想了解函數式編程核心概念？**
  → `references/01-functional-programming.md`

- **想知道如何設計 Composables？**
  → `references/02-design-principles.md` 的單一職責章節
  → `references/03-practical-applications.md` 的 Composables 設計模式

- **遇到原則衝突不知道如何處理？**
  → `references/03-practical-applications.md` 的原則衝突處理章節

- **遇到不可避免的副作用？**
  → `references/04-side-effect-strategies.md` 了解處理策略
  → `references/05-side-effect-practices.md` 查看實務流程

### 按角色查找

- **前端工程師（實作組件與 Composables）**
  1. `references/01-functional-programming.md` - 了解函數式編程基礎
  2. `references/02-design-principles.md` - 了解設計原則
  3. `references/04-side-effect-strategies.md` - 了解副作用處理策略
  4. `references/05-side-effect-practices.md` - 了解副作用實務處理
  5. `references/03-practical-applications.md` - 查看實際案例

- **技術負責人（Code Review 與架構決策）**
  1. `references/index.md` - 了解整體原則結構
  2. `references/04-side-effect-strategies.md` - 了解副作用處理策略
  3. `references/05-side-effect-practices.md` - 使用檢查清單進行 Review
  4. `references/03-practical-applications.md` - 查看實際案例

---

## 常見問題 (FAQ)

**Q: 是否所有函數都必須是純函數？**
A: 不是。在真實開發中，幾乎不可能實現 100% 純函數。重點是分層處理：純函數層處理計算邏輯，副作用層處理 I/O 操作。

**Q: 何時應該違反 KISS 原則？**
A: 當業務複雜度確實需要抽象時。但在 MVP 階段，優先選擇簡單解決方案。

**Q: 如何處理 Vue 3 的響應式資料與不可變性？**
A: Vue 3 允許直接修改響應式資料，但建議創建新物件以符合不可變性原則。使用 `readonly()` 保護不應被修改的狀態。

**Q: 依賴注入是否會增加複雜度？**
A: 初期可能增加一些程式碼量，但長期來看提高了可測試性和靈活性。在 MVP 階段，僅對需要測試的核心邏輯使用依賴注入。

---

**版本**: v1.0  
**最後更新**: 2026-02-03  
**維護者**: AI + Developer
