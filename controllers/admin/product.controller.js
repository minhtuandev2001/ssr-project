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

// [PATCH] /admin/products/change-status/:status/:id
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
// [PATCH] /admin/change-multi
const changeMultiStatus = async (req, res) => {
  const type = req.body.type
  const ids = req.body.ids.split(', ')

  try {
    await Product.updateMany({ _id: { $in: ids } }, { status: type })
    res.redirect("back")
  } catch (error) {
    res.status(500).json({ message: error })
  }
}
// [DELETE] /admin/delete/:id 
const deleteProduct = async (req, res) => {
  const id = req.params.id
  try {
    // await Product.deleteOne({ _id: id }) // xóa cứng
    await Product.updateOne({ _id: id }, { deleted: true }) // xóa mềm
    res.redirect("back")
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
module.exports = {
  index,
  changeStatus,
  changeMultiStatus,
  deleteProduct
}