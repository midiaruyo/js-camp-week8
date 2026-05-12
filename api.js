// ========================================
// API 請求函式
// ========================================

const axios = require("axios");
const { API_PATH, BASE_URL, ADMIN_TOKEN } = require("./config");

// ========== 客戶端 API ==========

/**
 * 取得產品列表
 * @returns {Promise<Array>}
 */
async function fetchProducts() {
  const apiUrl = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`;

  const response = await axios.get(apiUrl);
  return response.data.products;
}

/**
 * 取得購物車
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function fetchCart() {
  const apiUrl = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;

  const response = await axios.get(apiUrl);
  return response.data;
}

/**
 * 加入購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function addToCart(productId, quantity) {
  const apiUrl = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
  const payload = { data: { productId: productId, quantity: quantity } };

  const response = await axios.post(apiUrl, payload);
  return response.data;
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function updateCartItem(cartId, quantity) {
  const apiUrl = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
  const payload = { data: { id: cartId, quantity: quantity } };

  const response = await axios.patch(apiUrl, payload);
  return response.data;
}

/**
 * 刪除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳購物車資料
 *
 */
async function deleteCartItem(cartId) {
  const apiUrl = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`;

  const response = await axios.delete(apiUrl);
  return response.data;
}

/**
 * 清空購物車
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function clearCart() {
  const apiUrl = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;

  const response = await axios.delete(apiUrl);
  return response.data;
}

/**
 * 建立訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function createOrder(userInfo) {
  const apiUrl = `${BASE_URL}/api/livejs/v1/customer/${API_PATH}/orders`;
  const payload = { data: userInfo };

  try {
    const response = await axios.post(apiUrl, payload);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.data?.status ?? false,
      message: error.response?.data?.message || error.message,
    };
  }
}

// ========== 管理員 API ==========

/**
 * 管理員 API 需加上認證
 * 提示：
    headers: {
      authorization: ADMIN_TOKEN
    }
 */

/**
 * 取得訂單列表
 * @returns {Promise<Array>}
 */
async function fetchOrders() {
  const apiUrl = `${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders`;
  const config = { headers: { authorization: ADMIN_TOKEN } };

  try {
    const response = await axios.get(apiUrl, config);
    return response.data.orders;
  } catch (error) {
    console.log(`fetchOrders error：${error.message}`);
    return [];
  }
}

/**
 * 更新訂單狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 *
 */
async function updateOrderStatus(orderId, isPaid) {
  const apiUrl = `${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders`;
  const payload = { data: { id: orderId, paid: isPaid } };
  const config = { headers: { authorization: ADMIN_TOKEN } };

  try {
    const response = await axios.put(apiUrl, payload, config);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.data?.status ?? false,
      message: error.response?.data?.message || error.message,
      orders: [],
    };
  }
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 *
 */
async function deleteOrder(orderId) {
  if (!orderId) {
    return {
      status: error.response?.data?.status ?? false,
      message: error.response?.data?.message || error.message,
      orders: [],
    };
  }

  const apiUrl = `${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders/${orderId}`;
  const config = { headers: { authorization: ADMIN_TOKEN } };

  try {
    const response = await axios.delete(apiUrl, config);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.data?.status ?? false,
      message: error.response?.data?.message || error.message,
      orders: [],
    };
  }
}

module.exports = {
  fetchProducts,
  fetchCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  createOrder,
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
};
