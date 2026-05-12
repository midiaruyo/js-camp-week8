// ========================================
// 購物車服務
// ========================================

const {
  fetchCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} = require("../api");
const { validateCartQuantity, formatCurrency } = require("../utils");

/**
 * 取得購物車
 * @returns {Promise<Object>}
 */
async function getCart() {
  try {
    const data = await fetchCart();
    return data;
  } catch (err) {
    return {
      status: err.response?.data?.status ?? false,
      message: err.response?.data?.message || err.message,
      carts: [],
      total: 0,
      finalTotal: 0,
    };
  }
}

/**
 * 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>}
 */
async function addProductToCart(productId, quantity) {
  if (!productId) {
    return {
      success: false,
      error: `addProductToCart fail，未輸入產品ID：${productId}`,
    };
  }
  // 提示：先用 utils validateCartQuantity() 驗證數量，驗證失敗時回傳 { success: false, error: ... }
  const { isValid, error: validationError } = validateCartQuantity(quantity);
  if (!isValid) {
    return {
      success: false,
      error: validationError,
    };
  }
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const data = await addToCart(productId, quantity);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || "加入商品到購物車失敗",
    };
  }
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>}
 */
async function updateProduct(cartId, quantity) {
  if (!cartId) {
    return {
      success: false,
      error: `updateProduct fail，未輸入購物車ID：${cartId}`,
    };
  }
  // 提示：先用 utils validateCartQuantity() 驗證數量，驗證失敗時回傳 { success: false, error: ... }
  const { isValid, error: validationError } = validateCartQuantity(quantity);
  if (!isValid) {
    return {
      success: false,
      error: validationError,
    };
  }
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const data = await updateCartItem(cartId, quantity);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error:err.response?.data?.message || err.message || "更新購物車商品數量失敗",
    };
  }
}

/**
 * 移除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>}
 */
async function removeProduct(cartId) {
  if (!cartId) {
    return {
      success: false,
      error: `removeProduct fail，未輸入購物車 ID：${cartId}`,
    };
  }
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const data = await deleteCartItem(cartId);
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || err.message || "移除購物車商品失敗",
    };
  }
}

/**
 * 清空購物車
 * @returns {Promise<Object>}
 */
async function emptyCart() {
  // 回傳格式：{ success: true, data: ... }
  try {
    const data = await clearCart();
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || err.message || "清空購物車失敗",
    };
  }
}

/**
 * 計算購物車總金額
 * @returns {Promise<Object>}
 */
async function getCartTotal() {
  // 回傳格式：{ total: 原始金額, finalTotal: 折扣後金額, itemCount: 商品筆數 }
  try {
    // 在解構時，直接給予每個變數預設值
    const { total = 0, finalTotal = 0, carts = [] } = (await fetchCart()) || {};
    return { total, finalTotal, itemCount: carts.length };
  } catch (err) {
    return {
      total: 0,
      finalTotal: 0,
      itemCount: 0,
    };
  }
}

/**
 * 顯示購物車內容
 * @param {Object} cart - 購物車資料
  // 預期輸出格式：
  // 購物車內容：
  // ----------------------------------------
  // 1. 產品名稱
  //    數量：2
  //    單價：NT$ 800
  //    小計：NT$ 1,600
  // ----------------------------------------
  // 商品總計：NT$ 1,600
  // 折扣後金額：NT$ 1,600
 */
function displayCart(cart) {
  // 判斷購物車是否為空（cart.carts 不存在或長度為 0），若空則輸出「購物車是空的」
  const { total, finalTotal, carts } = cart || {};
  if (!Array.isArray(carts)) {
    console.error("API 回傳格式異常：carts 應該要是陣列");
    return "購物車是空的";
  }
  if (carts.length === 0) {
    return "購物車是空的";
  }
  //顯示輸出
  const sepStr = "----------------------------------------\n";
  let outStr = `購物車內容：\n` + sepStr;
  carts.forEach((item, index) => {
    const currItemNo = index + 1;
    const curQty = item.quantity;
    const unitPrice = item.product.origin_price;
    outStr +=
      `${currItemNo}. ${item.product.title}\n` +
      `   數量：${curQty}\n` +
      `   單價：${formatCurrency(unitPrice)}\n` +
      `   小計：${formatCurrency(curQty * unitPrice)}\n` +
      sepStr;
  });
  outStr += `商品總計：${formatCurrency(total)}\n`;
  outStr += `折扣後金額：${formatCurrency(finalTotal)}\n`;
  return outStr;
}

module.exports = {
  getCart,
  addProductToCart,
  updateProduct,
  removeProduct,
  emptyCart,
  getCartTotal,
  displayCart,
};
