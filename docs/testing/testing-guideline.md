這是一份為你的團隊（或是未來的你）量身打造的測試策略指南。這份文件旨在將我們剛才討論的技術痛點（Nuxt 啟動慢、UI 測試不穩）與管理思維（ROI、做對的事）轉化為具體的執行標準。

---

# 專案測試策略指南 (Testing Strategy Guidelines)

## 1. 核心哲學 (Core Philosophy)

本專案採用 **「單元測試優先 (Unit-First)」** 策略。

我們認清軟體測試中的一項重要權衡：**自動化測試越往上層（UI/E2E），維護成本越高，執行速度越慢，且越容易因為非邏輯因素（如動畫、DOM 結構變更）而失敗。**

為了在有限的人力與時間資源下，達到最高的品質投資報酬率 (ROI)，我們制定以下原則：

* **把事情做對 (Verification)：** 交給 **自動化單元測試**。確保每一行業務邏輯、每個函式的輸入輸出絕對正確且不可破壞。
* **做對的事情 (Validation)：** 交給 **人為手動測試**。確保最終呈現的 UI 流程與使用者體驗符合業主需求。

---

## 2. 測試分層與職責 (Layers & Responsibilities)

### ✅ Layer 1: 自動化單元測試 (Automated Unit Testing)

**狀態：** 必須執行 (Mandatory)
**工具：** Vitest (Mock Mode)
**覆蓋範圍：**

* **API Handlers (`server/api/*`)：** 測試後端邏輯。例如：輸入空 Email 是否回傳 400？重複註冊是否回傳 409？
* **Composables (`composables/*`)：** 測試前端複雜邏輯。例如：`useAuth` 的狀態變化、資料處理函式。
* **Utils / Libs：** 純函式工具。

**❌ 不測什麼 (Out of Scope)：**

* **不要測 UI 渲染：** 不測 Component 是否顯示了紅色按鈕（由手動測試覆蓋）。
* **不要測 DOM 互動：** 不測點擊 Select 選單是否彈出（Shadcn/Vue 內部已保證，且易導致 Flaky Tests）。
* **不要測真實資料庫/網路：** 所有外部依賴 (`h3`, `db`, `fetch`) 一律 Mock 掉。

**目標：** 測試執行時間應在 **5秒內** 完成，讓開發者願意頻繁執行。

---

### 👁️ Layer 2: 人為整合與驗收測試 (Manual Integration & E2E)

**狀態：** 開發完成後執行 (Checklist)
**執行者：** 開發者 / PM
**覆蓋範圍：**

* **瀏覽器真實操作：** 從使用者角度，實際操作瀏覽器完成任務。
* **視覺與互動：** 確認 CSS 跑版、動畫順暢度、RWD 響應式效果。
* **端對端流程：** 確保前端 UI 能正確捕捉後端 API 的錯誤碼並顯示對應訊息。

**原因：**

* 自動化 E2E (如 Playwright) 成本過高，且容易因為 UI 微調而頻繁報錯。
* 人腦對於「體驗是否怪怪的」判斷力遠勝於腳本。

---

## 3. 開發工作流 (Workflow)

我們採用 **「需求對齊 -> 測試驅動 -> 手動驗收」** 的三步工作流：

### Step 1: 需求轉譯 (Requirement to Specs)

在寫程式碼前，先將業主的「人話需求」轉譯為「測試案例」。

* *業主需求：* "註冊資料沒填完不能送出。"
* *單元測試規格：* "當 body 欄位缺漏時，API Handler 應回傳 400 及錯誤訊息 '欄位不可為空'。"

### Step 2: 紅燈/綠燈循環 (The Unit Test Loop)

1. **建立測試檔：** 建立 `server/api/auth/register.test.ts`。
2. **Mock 環境：** 隔離所有外部依賴。
3. **寫測試 (Red)：** 實作 `it('should return 400...')`，確認測試失敗。
4. **寫邏輯 (Green)：** 在 `register.post.ts` 實作對應邏輯，直到測試通過。
5. **重構 (Refactor)：** 優化程式碼，確保測試依然通過。

### Step 3: 冒煙測試 (Manual Smoke Test)

當 Unit Test 全綠後，啟動開發伺服器 (`pnpm dev`)：

1. 打開瀏覽器。
2. **驗證快樂路徑 (Happy Path)：** 正常註冊，確認是否跳轉。
3. **驗證悲傷路徑 (Sad Path)：** 故意不填 Email，確認前端是否有跳出紅框警告（驗證前後端串接是否正確）。

---

## 4. 檔案結構規範 (Directory Structure)

為了降低維護成本，採用 **「兄弟目錄 (Co-location)」** 策略。測試檔案應緊鄰生產檔案。

**後端 API：**

> 下列為示意範例，僅供參考，請依專案實際路徑與命名調整。

```text
server/api/auth/
├── register.post.ts      (生產代碼)
└── register.test.ts      (單元測試代碼)

```

**Composables / Utils：**

> 下列為示意範例，僅供參考，請依專案實際路徑與命名調整。

```text
composables/
├── useAuth.ts
└── useAuth.test.ts

```

*(註：`vitest.config.ts` 已設定自動掃描所有 `*.test.ts`，無需手動引入。)*

---

## 5. 風險與應對 (Risk Management)

由於我們放棄了自動化 Integration/E2E 測試，必須意識到以下風險並應對：

| 風險 | 描述 | 應對措施 |
| --- | --- | --- |
| **配置錯誤** | `.env` 變數設錯，導致連不上真實 DB，但 Unit Test 因為是 Mock 的所以測不出來。 | **啟動檢查：** 在 `server/plugins/` 寫一個啟動檢查腳本，確認關鍵 ENV 是否存在。 |
| **前後端脫鉤** | 後端改了回傳格式 `{ data: ... }`，但前端還在讀取 `{ body: ... }`。 | **TypeScript：** 前後端共用 Interface/Types，利用型別檢查在編譯期抓出錯誤。 |
| **UI 互動壞掉** | 下拉選單因為 CSS `z-index` 問題被擋住按不到。 | **手動驗收：** 這是 Step 3 絕對不能省的原因。 |

---

### 結語

> **"Unit tests verify that we built the product right; Manual verification ensures we built the right product."**

這份指南的目標不是追求 100% 的測試覆蓋率，而是追求 **「開發信心」** 與 **「交付速度」** 的平衡。請專注於測試那些「看不見的邏輯」，並用你的雙眼去確認那些「看得見的體驗」。