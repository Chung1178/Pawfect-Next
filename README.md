# 🐾 Pawfect Care - 寵物保姆預約平台

這是一個使用 Next.js 開發的全端寵物保姆預約平台前端專案。平台旨在提供一個方便、可靠的管道，讓寵物飼主能夠快速地尋找、篩選並預約最適合他們毛小孩的專業寵物保姆。

**[Live Demo (線上預覽)](https://pawfect-next-zop5.vercel.app/)** 

![專案首頁截圖](https://res.cloudinary.com/dmumnom3r/image/upload/v1750389995/9569788d-977a-4ce5-a9f8-2656b75a3fc8.png)  

---

## ✨ 功能列表 (Features)

本專案已實現以下核心功能：

* **使用者系統:**
    * 響應式網站導覽列 (Header) 與頁腳 (Footer)
    * 滾動時 Header 動態添加陰影

* **保姆搜尋與預約:**
    * **首頁 (Homepage):** 包含 Hero Banner、服務介紹、預約流程、使用者評價輪播及常見問題 (FAQ) 等區塊。
    * **搜尋元件:** 可重用的搜尋表單，支援服務類型、寵物類型、地區及日期範圍選擇。
    * **保姆列表頁:**
        * 從後端 API 動態載入保姆列表。
        * 支援前端條件篩選與排序功能。
        * 實現了分頁功能。
    * **保姆詳細頁:**
        * 展示保姆的詳細資訊、服務項目、可服務時間及評價。
        * 使用 Swiper.js 實現的相簿圖片輪播 (主圖 + 縮圖導覽)。
        * 桌面版 Sticky 資訊卡，提供流暢的瀏覽體驗。

* **預約與付款流程:**
    * **預約表單:** 透過 Modal 彈窗進行預約，包含日期、時段、服務選擇。
    * **預約確認頁:** 顯示訂單摘要，並提供信用卡付款表單。
    * **多步驟付款 Modal:** 包含「付款確認」與「付款成功」兩個階段，提供清晰的流程引導。

---

## 🛠️ 技術棧 (Tech Stack)

* **前端框架:** [Next.js](https://nextjs.org/) (App Router)
* **核心庫:** [React](https://react.dev/)
* **樣式:** [Bootstrap 5](https://getbootstrap.com/), [SCSS Modules](https://github.com/css-modules/css-modules)
* **UI 元件庫:**
    * **輪播:** [Swiper.js](https://swiperjs.com/)
    * **圖示:** [Heroicons](https://heroicons.com/)
    * **日期選擇:** [React Datepicker](https://reactdatepicker.com/)
* **後端 API (Mock):** [JSON Server](https://github.com/typicode/json-server)
* **部署平台:**
    * **前端:** [Vercel](https://vercel.com/)
    * **後端 API:** [Render](https://render.com/)

---

## ✨ 技術整合與亮點 (Technical Highlights)

### 1. 專案重構與資料驅動 (Project Refactoring & Data-Driven Approach)

本專案是對原本的靜態切版專案，採用 Next.js 與 React 進行的**完整重構**。核心目標是將原本寫死的內容與結構分離，轉變為一個由後端 API 驅動的、動態且易於維護的應用程式。

* **從靜態到動態的演進:**
    * 將傳統的 HTML/CSS 網頁，全面升級為基於 **React 元件化**的架構，大幅提升了程式碼的可重用性和可管理性。
    * 引入了 React Hooks 進行靈活的**狀態管理**，使複雜的 UI 互動得以實現。

* **API-First 資料串接:**
    * 徹底改變了原先內容與畫面耦合的狀況。現在所有主要動態內容（如保姆列表、詳細資訊等）都改為透過 `fetch` **非同步地從遠端 API 獲取**。
    * 前端元件作為資料的接收者和渲染模板，實現了**內容與顯示的完全分離**。

* **後端 Mock API 實踐:**
    * 為了模擬真實的開發環境，使用 **JSON Server** 工具，將原本靜態的資料整理成符合 RESTful 風格的 JSON 格式。
    * 成功將這個 Mock API 部署到雲端平台 **Render**，為前端專案提供了一個穩定、可公開訪問的資料來源，並在開發初期驗證了完整的全端工作流程。

### 2. 架構設計：Next.js App Router 的實踐

* **伺服器元件優先 (Server Components-First):**
    為了達到最佳的 SEO 和初始載入性能 (FCP)，專案的核心頁面（如首頁、保姆列表頁、保姆詳細頁）都設計為 **Server Components**。所有靜態內容、標題、從 API 獲取的初始資料都在伺服器端直接渲染成 HTML，讓使用者和搜尋引擎能最快地看到內容。

* **策略性的客戶端元件拆分 (Strategic Client Component Splitting):**
    將所有需要使用者互動、狀態管理 (`useState`) 或生命週期管理 (`useEffect`) 的功能，都精心拆分為獨立的 **Client Components** (`'use client';`)。例如搜尋表單、圖片輪播、預約 Modal 等。這種架構最大限度地減少了傳送到客戶端的 JavaScript 大小，實現了伺服器渲染和客戶端互動性的完美結合。

* **以 URL 作為狀態來源 (`useSearchParams` & `<Suspense>`):**
    在保姆列表頁，搜尋和分頁的狀態是透過 URL query string 來管理的。使用 Next.js 提供的 `useSearchParams` hook 來讀取這些狀態，並將讀取狀態的客戶端組件包裹在 React 的 `<Suspense>` 邊界中，這不僅解決了 SSR 錯誤，也讓使用者可以**分享、收藏帶有篩選條件的 URL**。

### 3. 進階整合：React 生命週期與第三方 JS 函式庫

整合非原生為 React 設計的函式庫（如 Bootstrap JS, Swiper.js）是本專案的一大技術挑戰。

* **挑戰：** 在 Next.js 的 SSR 環境中，直接引入這些函式庫會導致 `document is not defined` 的伺服器端錯誤，並容易產生競爭條件 (Race Condition)，導致互動失效或 UI 殘留（如 Modal 背景遮罩）。

* **解決方案：動態 `import()` 與 `useEffect` 生命週期管理**
    本專案最終採用了以下模式來解決此問題：在 `useEffect` 中，使用非同步的 `await import('bootstrap')` 來安全地載入模組，並在 cleanup 函數中呼叫實例的 `.dispose()` 方法。

* **成果：** 這個模式確保了所有依賴瀏覽器環境的程式碼只在客戶端執行，解決了 SSR 錯誤和時序問題，並有效**避免了記憶體洩漏 (Memory Leak)**，實現了與第三方函式庫穩定的整合。

### 4. 現代化的樣式策略 (Modern Styling Strategy)

* **混合式方案:**
    * 利用 **Bootstrap 5** 的格線系統 (`Grid System`) 和工具類 (`Utility Classes`) 快速搭建響應式佈局和基礎樣式。
    * 對於特定元件的複雜或獨特樣式，則使用 **SCSS Modules** (`.module.scss`) 進行封裝，達到樣式隔離、避免全域污染的目的。

* **可維護的自訂主題:**
    * 透過建立共享的 `_bootstrap-essentials.scss` 檔案，可以在自訂的 SCSS 中安全地使用 Bootstrap 的**變數 (`$primary`)** 和 **Mixin (`@include media-breakpoint-up`)**，讓自訂樣式與 Bootstrap 主題風格保持一致。

### 5. 專業的開發與部署流程 (Professional Workflow)

* **版本控制:** 全程採用 **Git Flow** 進行分支管理 (`main`, `develop`, `feature/*`)，確保了開發流程的清晰和主分支的穩定。
* **Commit 規範:** 遵循 **Conventional Commits** 標準來撰寫 commit message。
* **CI/CD 實踐:**
    * 前端專案部署於 **Vercel**，並與 GitHub 整合，實現了推送到 `main` 分支即自動部署的 CI/CD 流程。
    * 透過在 Vercel 平台上設定**環境變數** (`NEXT_PUBLIC_API_URL`)，成功地將開發環境與生產環境的 API 配置分離。

---

## 🚀 安裝與啟動指南 (Installation & Setup)

請依照以下步驟在您的本地環境中運行此專案。

### 先決條件

* [Node.js](https://nodejs.org/) (建議版本 v18.x 或更高)
* [pnpm](https://pnpm.io/) (或 `npm`/`yarn`)

### 安裝步驟

1.  **Clone 專案倉庫至本地**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **進入專案目錄**
    ```bash
    cd your-repo-name
    ```

3.  **安裝專案依賴**
    (建議使用 pnpm，與 Vercel 部署環境一致)
    ```bash
    pnpm install
    ```

4.  **設定環境變數**
    * 在專案根目錄下，建立一個名為 `.env` 的檔案。
    * 填寫以下變數：
    ```
    # .env

    # 您本地運行的 json-server API 或部署在 Render 上的 API 網址
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

5.  **啟動本地後端 API**
    * 請確保您的 `json-server` 正在另一個終端機視窗中運行。
    * (在您的 API 專案目錄下執行 `json-server --watch db.json --port 3001`)

6.  **啟動 Next.js 開發伺服器**
    ```bash
    pnpm dev
    ```

7.  **打開瀏覽器**
    * 訪問 [http://localhost:3000](http://localhost:3000) 即可看到正在運行的網站。

---

### 部署說明 (Deployment)

* **前端:** 本專案已設定好在 [Vercel](https://vercel.com/) 上進行持續部署。任何推送到 `main` 分支的 commit 都會自動觸發新的生產環境部署。
* **後端 API:** 後端 `json-server` 已部署在 [Render](https://render.com/)。請注意，Render 的免費方案伺服器在閒置後會休眠，首次 API 請求可能需要約 30-60 秒的喚醒時間。

---

### 作者 (Author)

* Chung
* GitHub: `[Chung1178](https://github.com/Chung1178)`
* Email: `allen117805@gmail.com`