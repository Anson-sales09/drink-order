# 萃韻茶作 Crafted Tea Studio - 質感手搖茶飲線上點餐系統 (GitHub Pages 升級版)

> 專為提升品牌形象、辦公室揪團湊單與全透明營養標示所打造的現代化手搖飲點餐 Web 應用。
> 支援一鍵部署於 **GitHub Pages**，並可自由選配串接 **Google 試算表 (Google Apps Script)** 實現零成本雲端收單。

---

## 🌟 核心升級亮點與專業功能

1. **極致質感現代化 UI / UX 設計**：
   - 採用當代精品茶飲視覺語彙（松柏墨綠 ✕ 溫潤琥珀茶色），搭配毛玻璃與卡片式響應式設計。
   - 支援手機（Mobile-first 底部浮動購物車抽屜）與桌面寬螢幕流暢操作。

2. **完整豐富的產品介紹與產地履歷**：
   - 包含經典原茶、醇厚鮮奶、芝士奶蓋、鮮採果茶、特調暖冬與咖啡 6 大系列，共 15 款精緻品項。
   - 點擊「資訊」按鈕可開啟詳細產品故事、茶葉產地標示（如南投松柏嶺、日月潭台茶18號、京都小山園）與風味調性標籤（前調、中調、尾調）。

3. **動態即時熱量與咖啡因試算引擎**：
   - **法規咖啡因紅黃綠燈指標**：依台灣食藥署連鎖飲料店標示規範，精確標示綠燈（<100mg）、黃燈（101~200mg）、紅燈（>200mg）或無咖啡因。
   - **即時熱量動態聯動**：當顧客切換容量（L/M/Hot）、甜度（無糖 0 卡至全糖 +160 卡）或加料（珍珠 +180 卡、寒天 +45 卡、茶凍 +35 卡、奶蓋 +150 卡）時，頂部熱量儀表板會立即動態累加！

4. **辦公室揪團湊單神器**：
   - **同品項自動聚合統計**：系統自動將全單按「相同飲品、尺寸、冰塊、甜度、加料」進行合併加總（例如自動統計出：`松柏嶺四季春 (L) - 微糖微冰 x 5 杯`），致電店家點餐 1 秒念完！
   - **一鍵複製 LINE 訂單明細**：自動排版成整齊漂亮的文字格式，直接貼入公司 LINE 群組核對收款。

5. **全方位客製化與環保法規支援**：
   - 完整 6 段甜度、6 種冰量與 7 種經典手作加料。
   - 內建「自備環保杯折抵」選項（每杯現折 $5 元，符合台灣法規）。

6. **雙向架構：可獨立運作 ＋ 支援 GAS 雲端收單**：
   - **純前端模式**：零伺服器維護，本機 LocalStorage 儲存歷史紀錄，直接產生訂單編號與收據。
   - **GAS 試算表收單**：填入 GAS 部署網址，送出訂單後立即非同步 POST 寫入 Google 試算表。

---

## 🚀 部署到 GitHub Pages 教學 (只需 3 分鐘)

### 方法 A：使用 GitHub 網頁直接上傳（免裝 Git）
1. 登入 [GitHub](https://github.com/) 並點擊右上角 **「New repository」**。
2. Repository name 輸入例如：`tea-order`，設定為 **Public**，點擊 **Create repository**。
3. 進入專案頁面，點擊 **「Upload an existing file」**。
4. 將本專案目錄中的 `index.html`（以及 `README.md`）拖曳上傳，點擊下方 **Commit changes**。
5. 點擊專案上方選單的 **「Settings」** -> 左側選單的 **「Pages」**。
6. 在 **Branch** 下拉選單中選擇 `main`（或 `master`），資料夾保持 `/ (root)`，點擊 **Save**。
7. 等候約 1 分鐘，重新整理頁面，頂部即會出現專屬公開網址：
   `https://<你的GitHub帳號>.github.io/tea-order/`

### 方法 B：使用 Git 指令推送
```bash
git init
git add .
git commit -m "feat: upgrade drink ordering system to github pages"
git branch -M main
git remote add origin https://github.com/<你的帳號>/tea-order.git
git push -u origin main
```
推送完成後，同樣至 Repository 的 **Settings -> Pages** 啟用即可！

---

## 📊 串接 Google 試算表 (Google Apps Script) 收單教學

若您希望所有人透過 GitHub Pages 下單時，訂單能自動整理至 Google 試算表：

1. 開啟 [Google 雲端硬碟](https://drive.google.com/)，建立一張新的 **Google 試算表**（例如命名為：`飲料點餐收單總表`）。
2. 在試算表上方選單點選 **「擴充功能」 -> 「Apps Script」**。
3. 將本目錄中的 [`Code.gs`](file:///C:/Users/Anson/.gemini/antigravity/scratch/beverage-order-system/Code.gs) 內容完整複製，貼上覆蓋編輯器內的程式碼。
4. 點擊右上角藍色按鈕 **「部署」 -> 「新增部署作業」**：
   - 齒輪圖示選擇 **「網頁應用程式 (Web App)」**。
   - 說明填入：`收單 API`。
   - **執行身分**：選「我 (您的帳戶)」。
   - **誰可以存取**：務必選擇 **「任何人 (Anyone)」**（這樣外部網頁下單才具備寫入權限）。
5. 點擊「部署」，首次部署會要求授權存取試算表，請點擊「進階 -> 前往... -> 允許」。
6. 複製產生的 **網頁應用程式網址**（格式類似：`https://script.google.com/macros/s/AKfycb.../exec`）。
7. 打開您的 GitHub Pages 網頁，點擊頂部公告列的 **「⚙️ 串接設定」**，將剛才複製的網址貼入並儲存。

🎉 **大功告成！未來只要有人在網頁上下單，Google 試算表就會立即自動建立欄位，並即時列出訂單時間、訂購人、電話、品項細節、總金額與總熱量！**

---

## 📁 專案檔案結構
- [`index.html`](file:///C:/Users/Anson/.gemini/antigravity/scratch/beverage-order-system/index.html)：單一整合式 Single-Page Web 應用程式（包含 TailwindCSS、Lucide、飲品資料庫、動態熱量計算機、購物車、湊單神器與結帳模組）。
- [`Code.gs`](file:///C:/Users/Anson/.gemini/antigravity/scratch/beverage-order-system/Code.gs)：Google Apps Script 後端腳本，含防衝突行鎖（LockService）與自動美化格式。
- [`README.md`](file:///C:/Users/Anson/.gemini/antigravity/scratch/beverage-order-system/README.md)：完整說明與部署指南。
