const Cart = require("../../models/cart.model")

const cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart()
    await cart.save()
    const expiresTime = 1000 * 60 * 60 * 24 * 365;
    res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresTime) })
  } else {
    const cartId = req.cookies.cartId;
    // đã có giỏ hàng, hiển thị số sản phẩm đã có trong giỏ hàng
    const cart = await Cart.findOne({ _id: cartId })
    cart.totalQuantity = cart.products.reduce((sum, item) => {
      return sum += item.quantity
    }, 0)
    res.locals.miniCart = cart
  }
  next()
}

module.exports = {
  cartId
}