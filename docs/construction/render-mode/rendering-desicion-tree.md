這部影片提供了一個非常清晰的決策樹，用來區分各種渲染模式。以下是根據影片內容整理出的架構：

### Render 模式決策樹

**1. 伺服器是否生成 HTML（包含內容）？**
*   **否 (No)：** 伺服器只提供空殼，內容由瀏覽器生成。
    *   **它是 SPA 嗎？**
        *   **否：** **手寫靜態 HTML (Hand-rolled Static HTML)**
            *   （最原始的網頁，無框架、無動態生成）。
        *   **是：** **純 SPA (Single Page Application)**
            *   （典型的 React/Vue 應用，瀏覽器下載 JS 後才渲染內容）。

*   **是 (Yes)：** 伺服器回傳的 HTML 包含實際內容（Server-Side Rendering 廣義定義）。
    *   **初始請求後，網頁是否會變成 SPA？**
        *   **否 (No)：** 傳統方式，換頁需重新載入。
            *   **是在 Build Time (建置時) 生成嗎？**
                *   **否：** **傳統 SSR (Traditional SSR)**
                    *   （例如：Laravel, PHP, Django，每次請求時動態生成 HTML）。
                *   **是：** **非 SPA 靜態網站產生器 (Non-SPA SSG)**
                    *   （例如：11ty, Hugo，產出純靜態檔案，無 JS 框架接管）。
        *   **是 (Yes)：** JS Meta-Frameworks，透過 hydration 變成 SPA。
            *   **是在 Build Time (建置時) 生成嗎？**
                *   **否：** **動態 SSR (Dynamic SSR)**
                    *   （例如：Next.js/Nuxt 的動態路由，伺服器即時渲染 + SPA 接管）。
                *   **是：** **預渲染 / SPA 基底的 SSG (Pre-rendering)**
                    *   （例如：Next.js Static Export, Nuxt Generate，預先生成 HTML + SPA 接管）。
        *   **某種程度上 (Kind of)：**
            *   **Islands 架構 (Islands Architecture)**
                *   （例如：Astro，主要為靜態 HTML，僅特定區塊載入 JS 變成互動式）。

這張決策樹清楚地區分了**「何時生成」**（Build vs. Runtime）與**「客戶端行為」**（SPA vs. 傳統頁面）這兩個維度。
