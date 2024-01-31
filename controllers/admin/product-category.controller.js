const ProductCategory = require('../../models/product-category.model')
const systemConfig = require('../../config/system')
const filterStatusHelper = require('../../utils/filterStatus')

// [GET] /admin/products-category 
const index = async (req, res) => {
  // Bộ lọc 
  let filterStatus = filterStatusHelper(req.query)

  const find = {
    deleted: false,
  }
  try {
    const categorys = await ProductCategory.find(find)
    console.log(categorys)
    res.render("admin/pages/product-category/index", {
      titlePage: "Danh mục sản phẩm",
      categorys: categorys,
      filterStatus: filterStatus,
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

// [GET] /admin/products-category/create
const create = (req, res) => {
  try {
    res.render('admin/pages/product-category/create', { titlePage: 'Tạo danh mục sản phẩm' })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

// [POST] /admin/products-category/create
const createPost = async (req, res) => {
  try {
    if (req.body.position === '') {
      const count = await ProductCategory.countDocuments()
      req.body.position = count + 1
    } else {
      req.body.position = Number(req.body.position)
    }
    await ProductCategory.create(req.body)
    req.flash("success", "Tạo danh mục thành công")
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  } catch (error) {
    req.flash("error", "Tạo danh mục thất bại")
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
}
module.exports = {
  index,
  create,
  createPost
}