---
name: layout
description: 負責通用 UI/UX 佈局開版、Responsive Web Design (RWD) 與 Tailwind 施工規範
---

# UI Layout Skill

本技能專注於將設計圖或需求轉化為結構清晰、符合語意化且具備回應能力的 HTML/CSS (Tailwind) 佈局。

## 使用方式

```markdown
請使用 layout skill 參考 [指令路徑] 並根據 [MyLayouts.vue] 延伸開發 [功能名稱]
```

## 核心施工規範

### 1. 行動優先 (Mobile First)
*   預設使用 Tailwind 原子類撰寫小螢幕樣式。
*   使用 `sm:`, `lg:`, `xl:` 等前綴擴展至大螢幕。

### 2. 原子類收斂 (Utility Unification)
*   將高度結構相關的樣式抽離至 `<style scoped>` 中，使用 `@apply` 或自定義類名以優化 `<template>` 可讀性。
*   避免類名與 Tailwind 預設 Utility 重疊。

### 3. @apply 響應式限制與分層原則

> [!CAUTION]
> **Tailwind 限制**：`@apply` 不支援響應式前綴（如 `lg:grid-cols-2`）。這是 Tailwind 本身的設計限制。

**解決方案：分層原則 (Layered Pattern)**

| 層級 | 放置位置 | 範例 |
|------|----------|------|
| 結構性樣式 | `<style scoped>` + `@apply` | `grid`, `flex`, `gap`, `position` |
| 響應式修飾 | `<template>` class | `lg:grid-cols-2`, `xl:text-xl` |

```vue
<!-- ✅ 正確寫法 -->
<template>
  <div class="my-grid lg:grid-cols-2 xl:grid-cols-3">...</div>
</template>
<style scoped>
.my-grid { @apply grid gap-4 grid-cols-1; }
</style>
```

```vue
<!-- ❌ 錯誤寫法：@apply 內使用響應式前綴會報錯 -->
<style scoped>
.my-grid { @apply grid gap-4 lg:grid-cols-2; } /* PostCSS Error */
</style>
```

**優點**：可直接使用 `tailwind.config.js` 中定義的語義化 breakpoint 名稱 (`sm`, `lg`, `xl`)，無需記憶 magic number。

### 4. 可互動元素與回饋 (Interactive Feedback)
*   所有按鈕與連結必須包含 `hover` 與 `active` 視覺回饋。
*   優先使用 `scale` 或 `border-radius` 變化，避免破壞佈局。

### 5. 語意化 HTML (Semantic HTML)
*   優先使用 `<header>`, `<main>`, `<section>`, `<nav>` 等官方推薦標籤。


## 審核與接力

1.  **注入專案上下文**：執行前應讀取 `.agent/skills/layout/instructions/` 下的專案規格（如斷點數值）。
2.  **驗收點**：完成後可交由 `code-review` 技能進行分層架構與解耦審核。

## 參考範本
*   [官方 Skill Creator 範本](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
*   [本專案佈局指令](./instructions/opening-layout.md)
