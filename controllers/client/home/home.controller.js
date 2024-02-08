const Product = require("../../../models/product.model")
const priceNewDiscountHelper = require("../../../utils/priceNewDiscount")
const index = async (req, res) => {
  try {
    // lấy ra sản phẩm nổi bật
    const productFeaturead = await Product.find({
      deleted: false,
      featuread: "1",
      status: "active"
    })
    // kết thúc lấy ra sản phẩm nổi bật
    // tính toán giá tiền sau khi khuyến mãi 
    const newProductFeaturead = priceNewDiscountHelper.priceNewDiscount(productFeaturead)
    // kết thúc tính toán giá tiền sau khi khuyến mãi 
    res.render("client/pages/home/index", {
      titlePage: "Trang chủ",
      productFeaturead: newProductFeaturead
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}