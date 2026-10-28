/**
 * 萃韻茶作 Crafted Tea Studio - Google Apps Script 後端收單系統
 * 專為 GitHub Pages 前端串接設計
 * 
 * 部署說明：
 * 1. 在 Google 試算表中點選「擴充功能」->「Apps Script」。
 * 2. 將此 Code.gs 內容貼入專案中。
 * 3. 點選右上角「部署」->「新增部署作業」。
 * 4. 種類選擇「網頁應用程式 (Web App)」。
 * 5. 設定：
 *    - 說明：飲料系統收單 API
 *    - 執行身分：我 (您的帳號)
 *    - 誰可以存取：任何人 (Anyone)  <--- 極其重要！
 * 6. 點擊「部署」，並複製產生的「網頁應用程式網址 (Web App URL)」。
 * 7. 將該網址貼入 GitHub Pages 點餐系統的「⚙️ 串接設定」中即可！
 */

// 試算表收單工作表名稱
const SHEET_NAME = '飲料訂單紀錄';

/**
 * 處理 POST 請求 (接收來自 GitHub Pages 的新訂單)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // 嘗試取得鎖定，避免辦公室多人同時下單造成試算表衝突 (最長等待 10 秒)
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: '伺服器繁忙，請稍後再試'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // 若工作表不存在，自動建立並初始化表頭
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      initSheetHeaders(sheet);
    }

    const orderId = data.orderId || ('#ORD-' + Utilities.formatDate(new Date(), 'GMT+8', 'yyyyMMdd-HHmmss'));
    const orderTime = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy-MM-dd HH:mm:ss');
    const cust = data.customer || {};
    const summary = data.summary || {};
    const items = data.items || [];

    // 格式化訂購飲品明細清單文字
    let itemsDetailText = items.map((item, index) => {
      let topStr = item.toppings ? `(+${item.toppings})` : '';
      let ecoStr = item.hasEcoCup ? '[環保杯-$5]' : '';
      let noteStr = item.note ? `[備註: ${item.note}]` : '';
      return `${index + 1}. ${item.name} (${item.size}) / ${item.sweetness} / ${item.ice} ${topStr} ${ecoStr} ${noteStr} x${item.quantity}杯 ($${item.subtotal})`;
    }).join('\n');

    let deliveryTypeName = '門市自取';
    if (cust.deliveryType === 'delivery') deliveryTypeName = '專人外送';
    if (cust.deliveryType === 'office') deliveryTypeName = '辦公室送達';

    // 寫入主訂單資料列
    sheet.appendRow([
      orderTime,                      // 1. 下單時間
      orderId,                        // 2. 訂單編號
      '待製作',                       // 3. 製作狀態
      cust.name || '未填寫',          // 4. 訂購人
      cust.phone || '未填寫',         // 5. 聯絡電話
      deliveryTypeName,               // 6. 取餐方式
      cust.address || '無',           // 7. 地址/桌號/分機
      cust.time || '盡快送達',        // 8. 預計取餐時間
      summary.totalCups || items.length, // 9. 總杯數
      summary.totalAmount || 0,       // 10. 應付總額
      summary.totalCalories || 0,     // 11. 總估算熱量(kcal)
      cust.payment || '現場付款',     // 12. 付款方式
      cust.invoice || '無',           // 13. 發票/統編/載具
      itemsDetailText,                // 14. 完整品項規格細節
      cust.notes || ''                // 15. 全單備註
    ]);

    // 將最後一列設定靠上對齊，方便閱讀多行飲品明細
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 15).setVerticalAlignment('top');

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      orderId: orderId,
      message: '訂單已成功寫入試算表'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * 處理 GET 請求 (提供 API 狀態檢查)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    system: '萃韻茶作 Crafted Tea Studio API',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 初始化試算表表頭格式與樣式
 */
function initSheetHeaders(sheet) {
  const headers = [
    '下單時間',
    '訂單編號',
    '製作狀態',
    '訂購姓名',
    '聯絡電話',
    '取餐方式',
    '外送地址/桌號',
    '預計取餐時間',
    '總杯數',
    '總金額($)',
    '總熱量(kcal)',
    '付款方式',
    '統編/載具',
    '訂購飲品明細與客製規格',
    '全單備註'
  ];

  sheet.appendRow(headers);

  // 美化表頭樣式
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1B321B'); // 墨綠色深色質感
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 35);

  // 凍結首列
  sheet.setFrozenRows(1);

  // 自動欄寬調整
  sheet.setColumnWidth(1, 160); // 下單時間
  sheet.setColumnWidth(2, 170); // 訂單編號
  sheet.setColumnWidth(3, 90);  // 狀態
  sheet.setColumnWidth(4, 110); // 姓名
  sheet.setColumnWidth(5, 120); // 電話
  sheet.setColumnWidth(6, 100); // 取餐方式
  sheet.setColumnWidth(7, 180); // 地址/桌號
  sheet.setColumnWidth(8, 110); // 取餐時間
  sheet.setColumnWidth(9, 70);  // 總杯數
  sheet.setColumnWidth(10, 90); // 總金額
  sheet.setColumnWidth(11, 110);// 總熱量
  sheet.setColumnWidth(12, 110);// 付款
  sheet.setColumnWidth(13, 110);// 統編
  sheet.setColumnWidth(14, 380);// 明細
  sheet.setColumnWidth(15, 150);// 備註
}

/**
 * 測試手動觸發建立範例訂單
 */
function testCreateOrder() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        orderId: 'ORD-TEST-001',
        customer: {
          name: '測試顧客 (Anson)',
          phone: '0912-345-678',
          deliveryType: 'office',
          address: '研發部 3F-A12 桌',
          time: '14:30',
          payment: 'LINE Pay',
          invoice: '88888888',
          notes: '請附杯架'
        },
        summary: {
          totalCups: 2,
          totalAmount: 115,
          totalCalories: 330
        },
        items: [
          {
            name: '松柏嶺四季春',
            size: '大杯 (L)',
            sweetness: '微糖 (30%)',
            ice: '微冰 (30%)',
            toppings: '茉莉綠茶凍',
            hasEcoCup: true,
            quantity: 1,
            singleCalories: 155,
            subtotal: 45,
            note: '茶濃一點'
          },
          {
            name: '手炒黑糖珍珠鮮奶',
            size: '中杯 (M)',
            sweetness: '半糖 (50%)',
            ice: '去冰',
            toppings: '',
            hasEcoCup: false,
            quantity: 1,
            singleCalories: 340,
            subtotal: 70,
            note: ''
          }
        ]
      })
    }
  };
  const res = doPost(mockEvent);
  Logger.log(res.getContent());
}
