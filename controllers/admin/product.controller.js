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
  const { status, keyword } = req.query
  const find = {
    deleted: false
  }
  console.log(status, keyword)
  if (status) {
    filterStatus.forEach(item => {
      if (item.status === status) {
        item.class = "active"
      } else {
        item.class = ""
      }
    })
  }
  if (status) {
    find.status = status
  }
  try {
    const data = await Product.find(find)
    res.render("admin/pages/products/index", { titlePage: "admin products", products: data, filterStatus: filterStatus })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}