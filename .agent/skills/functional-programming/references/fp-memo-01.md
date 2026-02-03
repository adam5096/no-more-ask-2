🧭 Functional Programming 實戰指南（前端 / Vue / JS 向）

目標不是「寫得像 FP」
而是「讓系統更穩定、更好理解、更能長期演化」

⸻

一、FP 的主流主張（但我會幫你降噪）

下面不是「全部都要做」，而是你要知道它們各自解決什麼問題。

⸻

1️⃣ Pure Function（純函式）【核心中的核心】

主張
	•	相同輸入 → 相同輸出
	•	不讀外部狀態
	•	不產生副作用

解決的問題
	•	不可預期的行為
	•	難以測試
	•	邏輯和環境糾纏

實施建議（★★★★★ 必做）
	•	所有 business logic 優先寫成純函式
	•	Vue / React / API / IO → 全部隔離

👉 這一條就值得你採用 FP

⸻

2️⃣ Immutability（不可變資料）

主張
	•	不修改既有資料
	•	每次回傳新狀態

解決的問題
	•	隱性狀態變化
	•	Debug 困難
	•	Time travel / undo 不可能

實施建議（★★★★☆ 強烈建議）
	•	Array / Object 一律視為 readonly
	•	使用 map / filter / spread

⚠️ 不需要為此導入 heavy immutable library
JS 原生就夠

⸻

3️⃣ Functional Core / Imperative Shell（架構主張）

主張
	•	核心邏輯是 FP
	•	邊界處理副作用

解決的問題
	•	框架耦合
	•	技術遷移成本
	•	商業邏輯不可重用

實施建議（★★★★★ 必做）
	•	抽離 logic 成獨立檔案
	•	Vue component 只負責：
	•	狀態承接
	•	事件轉發
	•	UI 映射

👉 這是 FP 在前端的「正確形態」

⸻

4️⃣ Higher-Order Function（高階函式）

主張
	•	函式可以接收 / 回傳函式

解決的問題
	•	行為重用
	•	邏輯組合

實施建議（★★★☆☆ 適度）
	•	map / filter / reduce 已經是最佳示範
	•	自己寫時，確保「語意明確」

❌ 不為炫技而抽象

⸻

5️⃣ Currying / Partial Application

主張
	•	延遲決定部分參數
	•	讓行為可組合

解決的問題
	•	狀態轉換管線化
	•	行為重用

實施建議（★★☆☆ 可選）
	•	一層 curry 幾乎永遠安全
	•	二層以上需明確理由
	•	超過兩層，請先自我懷疑

👉 團隊陌生時：
只在 core 使用，不外露

⸻

6️⃣ Function Composition / Pipeline

主張
	•	把多個小轉換串成流程

解決的問題
	•	複雜狀態變化
	•	Batch / history / undo

實施建議（★★☆☆ 視需求）
	•	當你開始有「多步驟狀態演化」
	•	Todo 初期不一定需要

⸻

7️⃣ Algebraic Data Types / Monad（JS 世界的天花板）

主張
	•	用型別表達「可能性」
	•	消除 null / exception

解決的問題
	•	防呆
	•	錯誤處理一致性

實施建議（★☆☆☆☆ 高門檻）
	•	非必要不要引入
	•	適合 library / 核心 domain

👉 90% 商業前端不需要

⸻

二、FP 實施程度判斷表（請真的用它）

問題	YES	NO
邏輯會不會被重用？	FP 抽離	放在 component
規則是否穩定？	抽象	先寫直覺
團隊能一眼懂嗎？	保留	降級
抽象是否減少思考？	接受	移除
是否為未來需求預測？	停止	OK

👉 FP 不是「做越多越好」

⸻

三、關於「自我解釋 code」的鐵則（你剛才說的關鍵）

✅ 好 code 的特徵
	•	函式名 = 意圖
	•	參數順序 = 敘事順序
	•	呼叫點 = 像句子

todos = apply(
  addTodo('Buy milk'),
  toggleTodo(3)
)

👉 即使不懂 FP，也能猜 80%

⸻

❌ 壞的 FP code 特徵
	•	需要註解解釋「為什麼要 curry」
	•	抽象層級混雜
	•	閱讀時必須模擬執行

⸻

四、你可以直接採用的「實戰準則總結」

你可以把這段當作你的內建 checklist：

	•	Pure function 是底線
	•	Immutability 是習慣
	•	Functional Core 是架構選擇
	•	Currying 是工具，不是義務
	•	抽象要為「理解」服務
	•	團隊理解度 > 理論純度
	•	能自我解釋，比能被證明更重要

⸻