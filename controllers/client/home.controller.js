const Product = require("../../models/product.model")
const priceNewDiscountHelper = require("../../utils/priceNewDiscount")

// [GET] /products
const index = async (req, res) => {
  try {
    // lấy ra sản phẩm nổi bật
    const productFeaturead = await Product.find({
      deleted: false,
      featuread: "1",
      status: "active"
    }).limit(10)
    // tính toán giá tiền sau khi khuyến mãi 
    const newProductFeaturead = priceNewDiscountHelper.priceNewDiscountProducts(productFeaturead)
    // kết thúc lấy ra sản phẩm nổi bật

    // lấy ra sản phẩm mới nhất
    const productsNew = await Product.find({
      deleted: false,
      status: "active"
    }).sort({
      position: "desc"
    }).limit(10)
    // tính toán giá tiền sau khi khuyến mãi 
    const newProductsNew = priceNewDiscountHelper.priceNewDiscountProducts(productsNew)
    // lấy ra sản phẩm mới nhất

    res.render("client/pages/home/index", {
      titlePage: "Trang chủ",
      productFeaturead: newProductFeaturead,
      productsNew: newProductsNew
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}