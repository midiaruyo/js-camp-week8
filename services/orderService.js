// ========================================
// 訂單服務
// ========================================

const { createOrder, fetchOrders, updateOrderStatus, deleteOrder } = require('../api');
const { validateOrderUser, formatDate, getDaysAgo, formatCurrency } = require('../utils');

/**
 * 建立新訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function placeOrder(userInfo) {
  // 提示：先用 utils validateOrderUser() 驗證使用者資料，驗證失敗時回傳 { success: false, errors: [...] }
  // 驗證通過後，呼叫 createOrder() 建立訂單
  // 回傳格式：{ success: true, data: ... } / { success: false, errors: [...] }
  if (!userInfo) {
    return {
      success: false,
      errors: [`placeOrder fail，未輸入使用者資料`],
    };
  }
  // 先用 utils validateOrderUser() 驗證使用者資料，驗證失敗時回傳 { success: false, errors: [...] }
  const { isValid, errors: validationError } = validateOrderUser(userInfo);
  if (!isValid) {
    return {
      success: false,
      errors: validationError,
    };
  }
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const data = await createOrder(userInfo);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      errors: [err.response?.data?.message || err.message || "建立新訂單失敗"],
    };
  }
}

/**
 * 取得所有訂單
 * @returns {Promise<Array>}
 */
async function getOrders() {
  // 提示：呼叫 fetchOrders() 取得訂單陣列並回傳
  try {
    const rawOrders = await fetchOrders();

    return Array.isArray(rawOrders) ? rawOrders : [];
  } catch (error) {
    console.error(`getOrders error：${error.message}`);
    return [];
  }
}

/**
 * 取得未付款訂單
 * @returns {Promise<Array>}
 */
async function getUnpaidOrders() {
  // 提示：呼叫 fetchOrders() 後，篩選出 paid 為 false 的訂單
  try {
    const rawOrders = await fetchOrders();
    const orders = Array.isArray(rawOrders) ? rawOrders : [];

    return orders.filter((item) => item.paid === false);
  } catch (error) {
    console.error(`getUnpaidOrders error：${error.message}`);
    return [];
  }
}

/**
 * 取得已付款訂單
 * @returns {Promise<Array>}
 */
async function getPaidOrders() {
  try {
    const rawOrders = await fetchOrders();
    const orders = Array.isArray(rawOrders) ? rawOrders : [];

    return orders.filter((item) => item.paid === true);
  } catch (error) {
    console.error(`getPaidOrders error：${error.message}`);
    return [];
  }
}

/**
 * 更新訂單付款狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updatePaymentStatus(orderId, isPaid) {
  if (!orderId) {
    return {
      success: false,
      error: `updatePaymentStatus fail，未輸入訂單ID：${orderId}`,
    };
  }
  if (typeof isPaid !== "boolean") {
    return {
      success: false,
      error: `updatePaymentStatus fail，付款狀態有錯！`,
    };
  }

  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const data = await updateOrderStatus(orderId, isPaid);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || "更新訂單付款狀態失敗",
    };
  }
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function removeOrder(orderId) {
  if (!orderId) {
    return {
      success: false,
      error: `removeOrder fail，未輸入訂單ID：${orderId}`,
    };
  }
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const data = await deleteOrder(orderId);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || err.message || "刪除訂單失敗",
    };
  }
}

/**
 * 格式化訂單資訊
 * @param {Object} order - 訂單物件
 * @returns {Object} - 格式化後的訂單
 *
 * 回傳物件包含以下欄位：
 * - id: 訂單 ID
 * - user: 使用者資料
 * - products: 商品陣列
 * - total: 總金額（原始數字）
 * - totalFormatted: 格式化金額，使用 utils formatCurrency()
 * - paid: 付款狀態（布林值）
 * - paidText: 付款狀態文字，true → '已付款'，false → '未付款'
 * - createdAt: 格式化後的建立時間，使用 utils formatDate()
 * - daysAgo: 距離今天為幾天前，使用 utils getDaysAgo()
 */
function formatOrder(order) {
  const {
    id = "",
    user = {},
    products = [],
    total = 0,
    paid = false,
    createdAt,
  } = order || {};

  return {
    id,
    user,
    products,
    total,
    totalFormatted: formatCurrency(total),
    paid,
    paidText: paid ? "已付款" : "未付款",
    createdAt: createdAt ? formatDate(createdAt) : "日期未定義",
    daysAgo: createdAt ? getDaysAgo(createdAt) : "日期未定義",
  };
}

/**
 * 顯示訂單列表
 * @param {Array} orders - 訂單陣列
 */
function displayOrders(orders) {
  // 請實作此函式
  // 提示：先判斷訂單陣列是否為空，若空則輸出「沒有訂單」
  // 使用 formatOrder() 格式化每筆訂單後再輸出
  //
  // 預期輸出格式：
  // 訂單列表：
  // ========================================
  // 訂單 1
  // ----------------------------------------
  // 訂單編號：xxx
  // 顧客姓名：王小明
  // 聯絡電話：0912345678
  // 寄送地址：台北市...
  // 付款方式：Credit Card
  // 訂單金額：NT$ 1,000
  // 付款狀態：已付款
  // 建立時間：2024-01-01 (3 天前)
  // ----------------------------------------
  // 商品明細：
  //   - 產品名稱 x 2（產品數量）
  // ========================================

  if (!Array.isArray(orders)) {
    console.error("API 回傳格式異常：orders 應該要是陣列");
    console.log("訂單列表是空的");
  }
  if (orders.length === 0) {
    console.log("訂單列表是空的");
  }
  //顯示輸出
  const sepStr = "----------------------------------------\n";
  let outStr = `訂單列表：\n` + `========================================\n`;
  orders.forEach((item, index) => {
    const { id, user, products, total, paidText, createdAt, daysAgo } =
      formatOrder(item);
    const currItemNo = index + 1;
    outStr +=
      `訂單 ${currItemNo}\n` +
      sepStr +
      `訂單編號：${id}\n` +
      `顧客姓名：${user.name}\n` +
      `聯絡電話：${user.tel}\n` +
      `寄送地址：${user.address}...\n` +
      `付款方式：${user.payment}\n` +
      `訂單金額：${formatCurrency(total)}\n` +
      `付款狀態：${paidText}\n` +
      `建立時間：${createdAt} (${daysAgo})\n`;

    outStr += `商品明細：\n`;
    if (!Array.isArray(products) || products.length === 0) {
      outStr += "- 無商品資訊\n";
    } else {
      products.forEach((product) => {
        outStr += `- ${product.title} x ${product.quantity}\n`;
      });
    }
  });
  outStr += `========================================\n`;
  console.log(outStr);
}

module.exports = {
  placeOrder,
  getOrders,
  getUnpaidOrders,
  getPaidOrders,
  updatePaymentStatus,
  removeOrder,
  formatOrder,
  displayOrders
};
