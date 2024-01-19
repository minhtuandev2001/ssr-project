const Product = require("../../models/product.model")
const filterStatusHelper = require("../../utils/filterStatus")

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
  let keyword = "";
  if (req.query.keyword) {
    keyword = req.query.keyword
    const regex = new RegExp(keyword, "i")
    find.title = regex
  }
  try {
    const data = await Product.find(find)
    res.render("admin/pages/products/index", {
      titlePage: "admin products",
      products: data,
      filterStatus: filterStatus,
      keyword: keyword
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}