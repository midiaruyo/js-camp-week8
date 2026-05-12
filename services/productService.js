// ========================================
// 產品服務
// ========================================

const { fetchProducts } = require("../api");
const {
  getDiscountRate,
  getAllCategories,
  formatCurrency,
} = require("../utils");

/**
 * 取得所有產品
 * @returns {Promise<Object>}
 */
async function getProducts() {
  try {
    const rawProducts = await fetchProducts();
    const products = Array.isArray(rawProducts) ? rawProducts : [];

    return { products, count: products.length };
  } catch (error) {
    console.error(`getProducts error：${error.message}`);
    return { products: [], count: 0 };
  }
}

/**
 * 根據分類篩選產品
 * @param {string} category - 分類名稱
 * @returns {Promise<Array>}
 */
async function getProductsByCategory(category) {
  try {
    const rawProducts = await fetchProducts();
    const products = Array.isArray(rawProducts) ? rawProducts : [];

    return products.filter((item) => item.category === category);
  } catch (error) {
    console.error(`getProductsByCategory error：${error.message}`);
    return [];
  }
}

/**
 * 根據 ID 取得單一產品
 * @param {string} productId - 產品 ID
 * @returns {Promise<Object|null>}
 */
async function getProductById(productId) {
  try {
    const rawProducts = await fetchProducts();
    const products = Array.isArray(rawProducts) ? rawProducts : [];

    return products.find((item) => item.id === productId) ?? null;
  } catch (error) {
    console.error(`getProductById error：${error.message}`);
    return null;
  }
}

/**
 * 取得所有分類（不重複）
 * @returns {Promise<Array>}
 */
async function getCategories() {
  // 提示：使用 fetchProducts() 取得所有產品後，代入到 utils getAllCategories()
  try {
    const rawProducts = await fetchProducts();
    const products = Array.isArray(rawProducts) ? rawProducts : [];

    return getAllCategories(products);
  } catch (error) {
    console.error(`getCategories error：${error.message}`);
    return [];
  }
}

/**
 * 顯示產品列表
 * @param {Array} products - 產品陣列
 * from API document
{
  "status": true,
  "products": [
    {
      "category": "產品分類 (String)",
      "images": "產品圖片 (String)",
      "id": "產品ID  (String)",
      "title": "產品名稱  (String)",
      "origin_price": "產品原始價錢 (Number)",
      "price": "產品銷售價錢 (Number)"
    }
  ]
}
 */
function displayProducts(products) {
  // 預期輸出格式：
  // 產品列表：
  // ----------------------------------------
  // 1. 產品名稱
  //    分類：xxx
  //    原價：NT$ 1,000
  //    售價：NT$ 800 (8折)
  // ----------------------------------------

  if (!Array.isArray(products)) {
    console.warn("displayProducts 錯誤：傳入的資料不是陣列格式");
    return "";
  }
  let outStr = "";
  const sepStr = "----------------------------------------\n";

  outStr = `產品列表：\n` + sepStr;
  products.forEach((item, index) => {
    const currItemNo = index + 1;
    outStr +=
      `${currItemNo}. ${item.title}\n` +
      `   分類：${item.category}\n` +
      `   原價：${formatCurrency(item.origin_price)}\n` +
      `   售價：${formatCurrency(item.price)} (${getDiscountRate(item)})\n` +
      sepStr;
  });
  return outStr;
}

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductById,
  getCategories,
  displayProducts,
};
