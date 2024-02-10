const Product = require("../../models/product.model")
const ProductsCategory = require("../../models/product-category.model")

const priceNewDiscountHelper = require("../../utils/priceNewDiscount")
const productCategoryHelper = require("../../utils/products-category")

// [GET] /products 
const index = async (req, res) => {
  try {
    const data = await Product.find({
      // status: "active",
      deleted: false
    }).sort({ position: "desc" })
    const newProduct = priceNewDiscountHelper.priceNewDiscountProducts(data)

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

    const newProducts = priceNewDiscountHelper.priceNewDiscountProducts(products)

    res.render('client/pages/products/index', {
      titlePage: category.title,
      products: newProducts
    })
  } catch (error) {
    console.log(error)
    res.redirect("back")
  }
}

// [GET] /products/:slugProduct
const detail = async (req, res) => {
  const find = {
    deleted: false,
    status: "active",
    slug: req.params.slugProduct
  }
  try {
    const product = await Product.findOne(find)
    if (product.product_category_id) {
      const category = await ProductsCategory.findOne({
        deleted: false,
        status: "active",
        _id: product.product_category_id
      })
      product.category = category
    }
    // thêm thuộc tính giá tiền sau khi chiết khấu
    product.priceNew = priceNewDiscountHelper.priceNewDiscountProduct(product)

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