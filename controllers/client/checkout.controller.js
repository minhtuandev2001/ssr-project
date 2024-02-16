const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")

const priceNewDiscountHelper = require("../../utils/priceNewDiscount")

const index = async (req, res) => {
  try {
    const id = req.cookies.cartId
    const cart = await Cart.findOne({ _id: id })
    for (const item of cart.products) {
      const productInfo = await Product.findOne({ _id: item.product_id })
      productInfo.priceNew = priceNewDiscountHelper.priceNewDiscountProduct(productInfo)

      item.productInfo = productInfo
      item.totalPrice = item.quantity * productInfo.priceNew
    }
    // tính tiền tổng đơn hàng
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("client/pages/checkout/index", {
      titlePage: "Đặt hàng",
      cartDetail: cart
    })
  } catch (error) {
    console.log(error)
    res.redirect("back")
  }
}

module.exports = {
  index
}