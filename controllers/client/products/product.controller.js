const Product = require("../../../models/product.model")

const index = async (req, res) => {
  try {
    const data = await Product.find({
      // status: "active",
      deleted: false
    }).sort({ position: "desc" })
    const newProduct = data.map(item => {
      item.priceNew = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(2)
      return item;
    })
    res.render('client/pages/products/index', { titlePage: "Products", products: newProduct })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}
module.exports = {
  index
}