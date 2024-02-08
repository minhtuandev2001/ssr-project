const Product = require("../../../models/product.model")
const priceNewDiscountHelper = require("../../../utils/priceNewDiscount")

// [GET] /products 
const index = async (req, res) => {
  try {
    const data = await Product.find({
      // status: "active",
      deleted: false
    }).sort({ position: "desc" })
    const newProduct = priceNewDiscountHelper.priceNewDiscount(data)

    res.render('client/pages/products/index', { titlePage: "Products", products: newProduct })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}
// [GET] /products/:slug
const detail = async (req, res) => {
  const find = {
    deleted: false,
    status: "active",
    slug: req.params.slug
  }
  try {
    const product = await Product.findOne(find)
    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product
    })
  } catch (error) {
    res.redirect("/products")
  }
}
module.exports = {
  index,
  detail
}