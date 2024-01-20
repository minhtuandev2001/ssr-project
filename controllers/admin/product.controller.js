const Product = require("../../models/product.model")
const filterStatusHelper = require("../../utils/filterStatus")
const searchHelper = require("../../utils/search")
const paginationHelper = require("../../utils/pagination")
const { response } = require("express")

// [GET] /admin/products
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
  const countProducts = await Product.countDocuments(find)
  const objectPagination = paginationHelper(
    {
      currentPage: 1,
      limit: 4
    },
    req.query,
    countProducts,
  )
  try {
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

// [GET] /admin/products/change-status/:status/:id
const changeStatus = async (req, res) => {
  const { status, id } = req.params;
  try {
    const ivalidProduct = await Product.findById(id)
    if (!ivalidProduct) {
      res.send("san pham ko ton tai")
    }
    await Product.updateOne({ _id: id }, { status: status })
    res.redirect("back")
  } catch (error) {
    res.status(500).json({ message: error })
  }
}
module.exports = {
  index,
  changeStatus
}