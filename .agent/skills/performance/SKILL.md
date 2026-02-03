---
name: performance
description: 負責前端效能優化，包含資源載入策略、Lazy Component 與 Payload 優化
---

# Performance Optimization Skill

本技能提供前端效能優化的執行步驟與最佳實踐，涵蓋資源載入優化、組件延遲載入與 Payload 減量策略。

---

## 使用時機 (When to Use)

在以下情境中使用此 Skill：
- 頁面載入速度過慢時
- 初始 Bundle Size 過大時
- Payload 體積影響效能時
- Code Review 發現效能問題時

---

## 執行步驟 (Execution Steps)

### Step 1: 效能問題診斷

1. **測量基準 (Baseline Measurement)**
   - 使用 Lighthouse 測量 Performance Score
   - 檢查 First Contentful Paint (FCP)
   - 檢查 Largest Contentful Paint (LCP)
   - 檢查 Total Blocking Time (TBT)

2. **識別瓶頸**
   - Bundle Size 過大？→ 進入 Step 2
   - 資源載入阻塞？→ 進入 Step 3
   - API Payload 過大？→ 進入 Step 4

### Step 2: Lazy Component 優化

參考 `references/lazy-component.md`：

1. **識別適合延遲載入的組件**
   - ✅ Modal、Drawer、Tooltip（條件式渲染）
   - ✅ 非首屏內容（Footer、底部推薦區塊）
   - ✅ 特定裝置內容（Mobile Sidebar）
   - ❌ Header、主要內容（Above the Fold）

2. **實作 Lazy Component**
   ```vue
   <!-- 使用 Lazy 前綴 -->
   <LazyAppFooter />
   <LazyMobileDrawer v-if="isMobileMenuOpen" />
   ```

3. **檢查清單**
   - [ ] 避免對首屏關鍵內容使用 Lazy
   - [ ] 避免過度巢狀使用（防止瀑布式載入）
   - [ ] 測量優化後的 Bundle Size 減少量

### Step 3: 資源載入優化

參考 `references/resource-priority.md`：

1. **決策流程**
   - 現在這頁就要用？
     - 否 → 使用 `prefetch`
     - 是 → 進入下一步
   - 極度關鍵（字體、CSS、首屏圖片）？
     - 是 → 使用 `preload`
     - 否 → 進入下一步
   - 需要操作 DOM 或有順序性？
     - 是 → 使用 `defer`
     - 否 → 使用 `async`（如追蹤碼）

2. **實作範例**
   ```html
   <!-- 字體 preload -->
   <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
   
   <!-- 主程式 defer -->
   <script defer src="main.js"></script>
   
   <!-- 追蹤碼 async -->
   <script async src="analytics.js"></script>
   ```

3. **檢查清單**
   - [ ] 字體使用 preload + crossorigin
   - [ ] 主程式使用 defer
   - [ ] 第三方追蹤使用 async
   - [ ] 避免重複下載（檢查 `as` 屬性）

### Step 4: Payload 優化

參考 `references/reduce-payload.md`：

1. **評估優化策略**
   - 你擁有 API 控制權？
     - 是 → **最佳方案**：修改後端 API 或使用 GraphQL
     - 否 → 進入下一步
   - 使用 SSR？
     - 是 → 建立 Nitro Proxy (BFF)
     - 否（SSG）→ 使用 `transform` 函數

2. **使用 transform 函數**
   ```typescript
   const { data } = await useFetch('/api/large-data', {
     transform: (input) => ({
       // 僅保留需要的欄位
       name: input.item.name,
       description: input.item.description
     })
   })
   ```

3. **檢查清單**
   - [ ] 確認 Payload 減少量（使用 DevTools Network）
   - [ ] TypeScript 型別正確推斷
   - [ ] 考慮是否應建立 BFF 端點（長期方案）

### Step 5: 驗證與測量

1. **重新測量**
   - 執行 Lighthouse 測量優化後的 Performance Score
   - 比較優化前後的差異

2. **文件記錄**
   - 記錄優化項目與效果
   - 更新專案的效能優化指南

---

## 參考資源 (References)

### 內部參考
- `references/resource-priority.md` - 資源載入優化決策樹
- `references/lazy-component.md` - Nuxt Lazy Component 使用指南
- `references/reduce-payload.md` - Payload 優化策略

### 相關 Skill/Workflow
- `/development-workflow` - 開發流程
- `/code-review-checklist` - Code Review
- `/api` - API 設計 Skill（BFF 優化）

### 外部資源
- [Web Vitals](https://web.dev/vitals/)
- [Nuxt Performance](https://nuxt.com/docs/guide/concepts/rendering#performance)
- [Resource Hints](https://www.w3.org/TR/resource-hints/)

---

## 常見問題 (FAQ)

**Q: 何時應該優化效能？**
A: 開發過程中持續關注，但主要優化時機在功能完成後、上線前。避免過早優化。

**Q: Lazy Component 會影響 SEO 嗎？**
A: 不會。Lazy Component 在 SSR 階段仍會正常渲染，只影響客戶端 Hydration。

**Q: transform 函數會減少伺服器頻寬嗎？**
A: 不會。transform 在 Nuxt Server 獲取資料後執行，只減少傳給客戶端的資料量。若要減少伺服器頻寬，需修改 API 或建立 BFF。

---

**版本**: v1.0  
**最後更新**: 2026-02-03  
**維護者**: AI + Developer
