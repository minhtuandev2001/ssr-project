const Product = require("../../models/product.model")

const index = async (req, res) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "active"
    },
    {
      name: "Hoạt động",
      status: "active",
      class: ""
    },
    {
      name: "Dừng hoat động",
      status: "inactive",
      class: ""
    },
  ]
  const find = {
    deleted: false,
  }
  if (req.query.status) {
    filterStatus.forEach(item => {
      if (item.status === req.query.status) {
        item.class = "active"
      } else {
        item.class = ""
      }
    })
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