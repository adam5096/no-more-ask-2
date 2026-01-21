# UIUX - 技術與限制 (v2)

**其他共同項**
採前、後端分離開發

**先不做 串接 API / JavaScript**

**先做 Layout**

STEP 01：先掃描我的 `layouts\MyLayouts.vue`，並以此 layout 為基礎延伸開發

STEP 02：做 Responsive Web Design
- **Mobile-first 策略**：預設樣式為基礎，再透過斷點進行增量覆蓋。
- **斷點配置**：
  - sm: 300px
  - lg: 800px
  - xl: 1400px

STEP 03：採用 Tailwind Utility first 開發

STEP 04：Wireframe Layout Style
- **視覺分區**：使用 `border` 勾勒輪廓。採用層級化邊框：外層容器使用 `border-2` (較粗)，內層元素使用 `border` (較細)。
- **視覺回饋**：所有可互動元素（按鈕、連結）在 `hover`, `active` 時應提供回饋。
  - 統一縮放：`active:scale-95`
  - 圓角變化：`hover:rounded-lg` (具體等級視組件而定)
  - 避免破壞現有 layout 參數（margin, padding, gap, spacing）

STEP 05：數值規範
- 所有 layout 數值全部採用 Tailwind 預設 utility，禁止 arbitrary 數值。
- **動態字體**：字體大小採用原生 CSS `clamp()` 函數動態計算，實現無縫縮放。

STEP 06：顏色規範
- 僅使用黑、白、灰。可適度搭配 `bg-gray-50` 等淺灰色區分層次。

STEP 07：樣式抽離
- Tailwind Utility 原子類請抽離到 `<style scoped>` 區塊中。
- **命名規範**：使用具備語意的類名（Semantic Naming），而非外觀描述。
  - `.layout-[name]` 用於 Layout 結構
  - `.component-[name]` 用於 Component 組件
  - 例如：使用 `.layout-main-container` 而非 `.layout-grid-3-cols`。

STEP 08：Semantic HTML
- 根據結構適當使用瀏覽器官方推薦的語意化標籤（如 `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>` 等）。

**最後 請先與我討論，並確認下列幾點**
STEP ：上述規範可行
STEP ：規則之間零衝突，沒有引起你的困惑
STEP ：貼合需求
STEP ：任務關注點切分合理
STEP FINAL：取得我同意後才能修改程式碼。
