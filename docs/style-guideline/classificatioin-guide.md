
## 📘 Vue 3 + Tailwind CSS 響應式開發治理手冊

### 第一部分：佈局邏輯分類指南 (Classification Guide)

在拿到 UI 設計稿時，優先將需求拆分為「結構」與「細節」兩大類。

#### 1. Discrete Driven (跳變型) — 使用 Tailwind 斷點前綴 (`md:`, `lg:`)

* **核心目標**：結構重組、導航邏輯、存在性切換。
* **適用屬性**：
* **佈局容器**：`hidden`, `block`, `flex`, `grid`。
* **排列軸向**：`flex-row`, `flex-col`。
* **欄位分配**：`grid-cols-1`, `grid-cols-3`。
* **定位模式**：`static`, `fixed`, `sticky`。


* **施工建議**：
* 這類屬性應直接寫在 Vue Template 的最外層元素上，方便一眼看出不同裝置下的佈局差異。



#### 2. Fluid Driven (連續型) — 使用 CSS 變數 + `clamp()`

* **核心目標**：節奏感、閱讀舒適度、空間利用率。
* **適用屬性**：
* **文字大小**：`font-size`。
* **內部間距**：`padding`, `gap`。
* **外部邊距**：`margin`（特別是 Section 間的間距）。
* **物理維度**：`min-height`, `max-width`。


* **施工建議**：
* **定義位置**：在 Vue 元件的 `<style>` 或全局 CSS 中定義變數。
* **使用方式**：`text-[length:var(--fluid-font)]` 或直接套用在自定義 class 上。
* **公式參考**：`clamp(min, preferred, max)`。