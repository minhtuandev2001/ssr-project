const Product = require("../../models/product.model")

const priceNewDiscountHelper = require("../../utils/priceNewDiscount")
// [GET] /search?keyword=data
const index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];
  try {
    if (keyword) {
      const regex = new RegExp(keyword, "i")
      const products = await Product.find({
        deleted: false,
        status: "active",
        title: regex
      }).sort({ position: "desc" }).limit(6)
      // lấy ra giá mới cho từng sản phẩm
      newProducts = priceNewDiscountHelper.priceNewDiscountProducts(products)
    }
    res.render("client/pages/search/index", {
      titlePage: "Kết quả tìm kiếm",
      keyword: keyword,
      products: newProducts
    })
  } catch (error) {
    console.log(error)
    res.status(404)
  }
}

module.exports = {
  index
}