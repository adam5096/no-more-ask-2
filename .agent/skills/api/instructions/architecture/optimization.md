# Payload Optimization Specification

## 優化方針
*   使用 `transform` / `pick` 減少傳輸體積。
*   避免回傳無用的冗餘欄位。
*   對於列表型數據，應僅回傳摘要資訊，詳細內容由具體端點提供。
