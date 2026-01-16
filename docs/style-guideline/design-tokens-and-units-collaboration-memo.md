這是一份針對 **Design Tokens (設計令牌)** 與 **樣式選型指南 (Px/Em/Rem/Clamp)** 如何協同運作的深度備註指南。這份文件旨在解決「有了單位規範後，如何進行系統化命名與維護」的工程問題。

---

## 📘 Design Tokens 與樣式指南協作備註手冊

### 1. 核心定位與關係 (The Relationship)

在開發體系中，這兩者分別承擔「運算邏輯」與「語意管理」的職責：

* **樣式選型指南 (Px/Em/Rem/Clamp)**：
* **職責**：定義「計量學」。解決 **How (如何計算與適應)** 的問題。
* **內容**：規範什麼時候該用 `clamp()`，什麼時候該用 `rem`。


* **Design Tokens 指南**：
* **職責**：定義「語意學」。解決 **What & Where (這是什麼、用在哪)** 的問題。
* **內容**：將複雜的數值封裝成具備意義的標籤（例如 `--sys-spacing-fluid`）。



---

### 2. 協作模型：漏斗式架構 (The Funnel Model)

建議將樣式單位依據 Token 的層級進行分配，達成「邏輯與名稱」的共融：

#### **第一層：基礎令牌 (Primitive Tokens)**

* **單位選型**：多使用 `px` 或 `rem`。
* **特性**：純粹的數值定義，不帶邏輯。
* **範例**：
* `--color-blue-500: #3b82f6;`
* `--base-size-16: 1rem;`



#### **第二層：語意令牌 (Semantic Tokens) —— 核心協作層**

* **單位選型**：**大量套用 `clamp()` 與 `rem**`。
* **特性**：將「流體設計 (Fluid Design)」與「跳變邏輯 (Discrete)」封裝於此。
* **範例**：
* `--spacing-container-gutter: clamp(1rem, 5vw, 3rem);`
* `--font-size-h1: clamp(2rem, 8vw, 4rem);`


* **工程優點**：祖先元素只需要呼叫語意標籤，就能獲得預設好的響應式物理屬性。

#### **第三層：組件令牌 (Component Tokens)**

* **單位選型**：**優先套用 `em**`。
* **特性**：處理組件內部的「共生比例」。
* **範例**：
* `--btn-padding-y: 0.5em;`
* `--btn-icon-gap: 0.3em;`



---

### 3. 長類名治理的終極解法：Token 映射

結合 Vue 3 + Tailwind CSS，利用 Token 來大幅縮減祖先元素的類名長度。

* **錯誤示範 (類名爆炸)**：
`<div class="p-4 md:p-8 lg:p-12 xl:p-16 grid-cols-1 md:grid-cols-3">`
* **正確示範 (Token 治理)**：
1. 在 CSS 中定義響應式 Token：`--layout-main-gap: clamp(...)`
2. 在 Tailwind Config 映射：`spacing: { 'main-gap': 'var(--layout-main-gap)' }`
3. Vue Template 使用：`<div class="p-main-gap grid-cols-adaptive">`



---

### 4. 協作檢查清單 (Collaboration Checklist)

當你準備在專案中實作樣式時，請核對此清單：

1. **[ ] 數值封裝**：我是否直接在代碼裡寫了 `clamp()`？（若是，請考慮將其提升為語意 Token）。
2. **[ ] 職責分離**：這個 Token 負責的是「結構佈局」還是「組件細節」？（佈局用 `rem/clamp`，細節用 `em`）。
3. **[ ] 單一來源**：當 UI 修改了 Fluid 曲線時，我是否只需要修改一個 CSS 變數就能全站生效？
4. **[ ] 命名語意**：這個 Token 是否能讓設計師與工程師溝通時不需要提及「像素」或「公式」？

---

### 5. 歸檔建議與檔案命名

為了確保這份備註能與之前的指南完美掛鉤，建議命名為：

* **建議檔名**：`Design-Tokens-and-Units-Collaboration-Memo.md`
* **中文對照**：`Design-Tokens-與單位選型協作備註指南.md`

---

### 結語

**Design Tokens 是「名」，樣式單位指南是「實」**。
這兩者結合後，你的 Vue 3 專案將從「手寫樣式」進化為「配置系統」。這能完全解決你先前擔心的祖先元素類名冗長問題，並讓整體的「物理運動屬性」在跨裝置時保持極高的一致性。