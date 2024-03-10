const Product = require("../../models/product.model")
const ProductsCategory = require("../../models/product-category.model")

const priceNewDiscountHelper = require("../../utils/priceNewDiscount")
const productCategoryHelper = require("../../utils/products-category")
const paginationHelper = require("../../utils/pagination")
// [GET] /products 
const index = async (req, res) => {
  try {
    // sort
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc"
    }
    // end sort
    // pagination
    const countDocuments = await Product.countDocuments({
      status: "active",
      deleted: false
    })
    const objectPagination = paginationHelper({
      limit: 9,
      currentPage: 1
    }, req.query, countDocuments, 8)

    // end pagination
    const data = await Product.find({
      status: "active",
      deleted: false
    }).limit(objectPagination.limit).skip(objectPagination.skip).sort(sort)

    const newProduct = priceNewDiscountHelper.priceNewDiscountProducts(data)

    res.render('client/pages/products/index', {
      titlePage: "List of products",
      products: newProduct,
      pagination: objectPagination
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

// [GET] /products/:slugCategory
const category = async (req, res) => {
  try {
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc"
    }
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
    }).sort(sort)

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