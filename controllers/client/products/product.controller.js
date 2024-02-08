const Product = require("../../../models/product.model")
const ProductsCategory = require("../../../models/product-category.model")

const priceNewDiscountHelper = require("../../../utils/priceNewDiscount")
const productCategoryHelper = require("../../../utils/products-category")

// [GET] /products 
const index = async (req, res) => {
  try {
    const data = await Product.find({
      // status: "active",
      deleted: false
    }).sort({ position: "desc" })
    const newProduct = priceNewDiscountHelper.priceNewDiscount(data)

    res.render('client/pages/products/index', {
      titlePage: "Danh sách sản phẩm",
      products: newProduct
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

// [GET] /products/:slugCategory
const category = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugCategory
    }
    const category = await ProductsCategory.findOne(find)

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id)
    const listSubCategoryId = listSubCategory.map(item => item.id)

    const products = await Product.find({
      deleted: false,
      status: "active",
      product_category_id: { $in: [category.id, ...listSubCategoryId] }
    }).sort({ position: "desc" })

    res.render('client/pages/products/index', {
      titlePage: category.title,
      products: products
    })
  } catch (error) {
    console.log(error)
    res.redirect("back")
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
  detail,
  category
} 