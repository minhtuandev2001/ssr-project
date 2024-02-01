const ProductCategory = require('../../models/product-category.model')
const systemConfig = require('../../config/system')
// helper
const filterStatusHelper = require('../../utils/filterStatus')
const searchHelper = require("../../utils/search")
const paginationHelper = require("../../utils/pagination")
const { response } = require('express')

// [GET] /admin/products-category 
const index = async (req, res) => {
  // Bộ lọc 
  let filterStatus = filterStatusHelper(req.query)

  const find = {
    deleted: false,
  }
  if (req.query.status) {
    find.status = req.query.status
  }
  // Tìm kiếm 
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }
  // Phân trang
  const countCategory = await ProductCategory.countDocuments()
  const objectPagination = paginationHelper({
    currentPage: 1,
    limit: 4
  },
    req.query,
    countCategory
  )
  // sort 
  const sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc"
  }
  try {
    const categorys = await ProductCategory.find(find)
      .sort(sort)
      .limit(objectPagination.limit)
      .skip(objectPagination.skip)
    res.render("admin/pages/product-category/index", {
      titlePage: "Danh mục sản phẩm",
      categorys: categorys,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination
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

// [DELETE] /admin/products-category/delete/:id 
const deleteProductCategory = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    req.flash('error', 'Xóa sản phẩm thất bại')
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
  try {
    await ProductCategory.updateOne({ _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    )
    req.flash('success', 'Xóa sản phẩm thành công')
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  } catch (error) {
    req.flash('error', 'Xóa sản phẩm thất bại')
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
}

// [GET] /admin/products-category/detail/:id
const detail = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
  try {
    const category = await ProductCategory.findOne({ _id: id })
    res.render('admin/pages/product-category/detail', {
      titlePage: 'ga',
      category: category
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
}
module.exports = {
  index,
  create,
  createPost,
  deleteProductCategory,
  detail
}