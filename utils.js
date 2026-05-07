// ========================================
// 工具函式
// ========================================

const dayjs = require('dayjs');

/**
 * 計算產品折扣率
 * @param {Object} product - 產品物件
 * @returns {string} - 例如 '8折'
 */
function getDiscountRate(product) {
  // 請實作此函式
}

/**
 * 取得所有產品分類（不重複）
 * @param {Array} products - 產品陣列
 * @returns {Array} - 分類陣列
 */
function getAllCategories(products) {
  if (!products||!Array.isArray(products)) {
    console.warn("getAllCategories 錯誤：傳入的資料不是陣列格式");
    return [];
  }
  return [...new Set(products.map((product) => product.category))];
}

/**
 * 格式化日期
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 格式 'YYYY/MM/DD HH:mm'，例如 '2024/01/01 08:00'
 */
function formatDate(timestamp) {

  if (!Number.isInteger(timestamp)) {
    return "輸入的時間戳必須是整數";
  }
  if (timestamp <= 0) {
    return "時間戳不可小於等於0";
  }
  //預防不合理的timestamp，過長的秒數
  const date = dayjs.unix(timestamp);
  if (!date.isValid()) {
    return "無效日期";
  }

  return date.format("YYYY/MM/DD HH:mm");
}

/**
 * 計算距今天數
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 例如 '3 天前'
 */
function getDaysAgo(timestamp) {
  // 1. 用 dayjs() 取得今天
  const currDate = dayjs();
  //console.log(currDate.format('YYYY/MM/DD'));

  // 2. 用 dayjs.unix(timestamp) 取得訂單日期
  const orderDate = dayjs.unix(timestamp);
  //console.log(orderDate.format('YYYY/MM/DD'));

  // 3. 用 .diff() 計算天數差異
  const diffDays = currDate.diff(orderDate, "day");

  //輸入的日期大於今天，回傳錯誤
  if (diffDays < 0) {
    return `日期錯誤：訂單日期${orderDate} > 現在日期${currDate}`;
  }

  return diffDays === 0 ? `今天` : `${diffDays}天前`;
}

/**
 * 驗證訂單使用者資料
 * @param {Object} data - 使用者資料
 * @returns {Object} - { isValid: boolean, errors: string[] }
 * 
 * 驗證規則：
 * - name: 不可為空
 * - tel: 必須是 09 開頭的 10 位數字
 * - email: 必須包含 @ 符號
 * - address: 不可為空
 * - payment: 必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一
 */
function validateOrderUser(data) {
  const payOpt = ["ATM", "Credit Card", "Apple Pay"];
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("name 不可為空");
  }
  if (!/^09\d{8}$/.test(data.tel)) {
    errors.push("tel 必須是 09 開頭的 10 位數字");
  }
  if (!data.email || !data.email.includes("@")) {
    errors.push("Email 格式不正確");
  }
  if (!data.address || data.address.trim() === "") {
    errors.push("address: 不可為空");
  }
  if (!data.payment || !payOpt.includes(data.payment)) {
    errors.push("payment 必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一");
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * 驗證購物車數量
 * @param {number} quantity - 數量
 * @returns {Object} - { isValid: boolean, error?: string }
 * 
 * 驗證規則：
 * - 必須是正整數
 * - 不可小於 1
 * - 不可大於 99
 */
function validateCartQuantity(quantity) {
  const errors = [];
  if (!Number.isInteger(quantity)) {
    errors.push("必須是正整數");
  }
  if (quantity < 1) {
    errors.push("不可小於 1");
  }
  if (quantity > 99) {
    errors.push("不可大於 99");
  }
  return { isValid: errors.length === 0, errors };
}

/**
 * 格式化金額
 * @param {number} amount - 金額
 * @returns {string} - 格式化後的金額
 * 
 * 格式化規則：
 * - 加上 "NT$ " 前綴
 * - 數字需要千分位逗號分隔（例如：1000 → 1,000）
 * - 使用台灣格式（zh-TW）
 * 
 * 範例：
 * formatCurrency(1000) → "NT$ 1,000"
 * formatCurrency(1234567) → "NT$ 1,234,567"
 * 
 */
function formatCurrency(amount) {
  // 請實作此函式
}

module.exports = {
  getDiscountRate,
  getAllCategories,
  formatDate,
  getDaysAgo,
  validateOrderUser,
  validateCartQuantity,
  formatCurrency
};
