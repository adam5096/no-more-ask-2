# UIUX - 技術與限制

**其他共同項**
採前、後端分離開發

**先不做 串接 API**

**先不做 JavaScript**

**先做 Layout**

STEP 01：先掃描我的 `layouts\MyLayouts.vue`，並以此 layout 為基礎延伸開發

STEP 02：做 Responsive Web Design
 break point 先只做
sm: 300 px
lg: 800 px
xl: 1400 px

STEP 03：採用 Tailwind Utility first 開發
 
STEP 04：先做 wireframe layout style, 如果需要視覺上分區塊，請先使用 border 勾勒輪廓
所有可互動元素都設計視覺回饋，例如按鈕、連結在滑鼠游標 hover, active 都設計回饋，先套用 border radius 變化、scale 縮小就好，避免破壞現有 margin, padding, gap, spacing 設計

STEP 05：所有 layout 數值先全部採用 tailwind 團隊預設 utility, 避免出現 arbitrary 數值

STEP 06：所有顏色先使用黑、白、灰

STEP 07：Tailwind Utility 原子類請抽離到當前 vue 檔案的 `<scope>` 區塊中，將結構高度相關樣式一命名，再從 `<template>` 中引用這些類名，保持 <template> 可讀性友善

STEP 08：根據結構適當使用瀏覽器官方推薦的 semantic HTML 標籤

**最後 請先與我討論，並確認下列幾點**
STEP ：上述規範可行
STEP ：規則之間零衝突，沒有引起你的困惑；如有困惑與好奇，請向我提問
STEP ：貼合需求
STEP ：任務關注點切分合理，每次工作量不會過多過長
STEP FINAL：取得我同意後才能修改程式碼