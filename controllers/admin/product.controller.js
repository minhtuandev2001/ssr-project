const Product = require("../../models/product.model")

const index = async (req, res) => {
  try {
    const data = await Product.find({
      deleted: false
    })
    res.render("admin/pages/products/index", { titlePage: "admin products", products: data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}