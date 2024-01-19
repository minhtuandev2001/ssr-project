const Product = require("../../models/product.model")
const filterStatusHelper = require("../../utils/filterStatus")
const searchHelper = require("../../utils/search")
const paginationHelper = require("../../utils/pagination")

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

module.exports = {
  index
}