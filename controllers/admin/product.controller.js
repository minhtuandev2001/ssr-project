const Product = require("../../models/product.model")
const filterStatusHelper = require("../../utils/filterStatus")
const searchHelper = require("../../utils/search")

const index = async (req, res) => {
  // Bộ lọc 
  let filterStatus = filterStatusHelper(req.query)
  // Nội dung lọc
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
  // phân trang
  const objectPagination = {
    currentPage: 1,
    limit: 4
  }
  if (req.query.page) {
    objectPagination.currentPage = Number(req.query.page)
  }
  objectPagination.skip = (objectPagination.currentPage - 1) * 4

  try {
    const countProducts = await Product.countDocuments(find)
    const totalPage = Math.ceil(countProducts / 4)
    objectPagination.totalPage = totalPage

    const data = await Product.find(find).limit(objectPagination.limit).skip(objectPagination.skip)
    res.render("admin/pages/products/index", {
      titlePage: "admin products",
      products: data,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}