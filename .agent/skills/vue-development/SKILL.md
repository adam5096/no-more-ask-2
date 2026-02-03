---
name: vue-development
description: 負責 Vue 3 / Nuxt 3 組件開發最佳實踐、架構決策與開發前檢查
---

# Vue Development Skill

本技能整合了 Vue/Nuxt 開發的核心最佳實踐，包括開發前檢查清單、組件設計模式、Code 組織方式與渲染模式決策。

---

## 使用時機 (When to Use)

- **開發前**：使用 Checklist 確保架構決策正確。
- **開發中**：選擇適合的組件設計模式與組織代碼。
- **Code Review**：驗證實作是否符合最佳實踐。

---

## 執行步驟 (Execution Steps)

### Step 1: 執行開發前檢查清單 (Pre-Task Checklist)

在開始任何實作前，應先參考 `checklists/` 中的清單。這能幫助你避免常見的架構錯誤：
1. **[JavaScript/Vue 檢查](./checklists/javascript-vue.md)**：狀態管理、computed、副作用與資料獲取。
2. **[HTML 結構檢查](./checklists/html.md)**：語義化、層級與內容組織。
3. **[通用實作框架](./checklists/general-implement-framework.md)**：開發標準流程。

### Step 2: 選擇渲染模式 (Render Mode Decision)

如果是新頁面或大型組件，應先決定渲染模式：
- 參考：`references/render-mode/decision-tree.md`

### Step 3: 選擇組件設計模式 (Component Patterns)

根據組件的複雜度與用途選擇模式：
- 參考：`references/component-patterns/component-patterns.md`
- **關鍵模式**：Data Store Pattern, Hidden Components, Preserve Object.

### Step 4: 組織 Composition API (Code Organization)

確保代碼按「區域邏輯」而非「屬性類型」分組：
- 參考：`references/composition-api/code-organization.md`
- 優先使用 **Inline Composable** 封裝組件內部邏輯。

### Step 5: 狀態管理規範 (State Management)

如果需要全域狀態，應使用 Pinia 並遵循 Setup Store 風格：
- 參考：`references/composition-api/pinia-style.md`

---

## 參考目錄結構 (Knowledge Base)

- **`checklists/`**：任務前檢查，確保從正確的職責與層級出發。
- **`references/render-mode/`**：解決「何時產生 HTML」與「是否 SPA」的決策。
- **`references/component-patterns/`**：解決組件拆分、數據傳遞與耦合問題。
- **`references/composition-api/`**：解決 Script Setup 代碼雜亂與 Store 書寫規範。

---

## 相關 Skill/Workflow

- **[/layout](../layout/SKILL.md)**：佈局開版與 Tailwind 施工（橫向協作）。
- **[/functional-programming](../functional-programming/SKILL.md)**：編程範式與純函數原則（底層原則）。
- **[/development-workflow](../../workflows/development-workflow.md)**：整體開發流程。

---

**版本**: v1.0  
**最後更新**: 2026-02-03
