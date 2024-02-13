const Cart = require("../../models/cart.model")

// [POST] /cart/add/:id
const addPost = async (req, res) => {
  try {
    const cartId = req.cookies.cartId
    const productId = req.params.id
    const quantity = Number(req.body.quantity)
    const cart = await Cart.findOne({ _id: cartId })
    const exitProductInCart = cart.products.find(item => item.product_id == productId)
    if (exitProductInCart) {
      const newQuantity = quantity + exitProductInCart.quantity;
      await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
      }, {
        "products.$.quantity": newQuantity
      })
    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity
      }
      await Cart.updateOne({ _id: cartId }, {
        $push: { products: objectCart }
      })
    }
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công")
  } catch (error) {
    req.flash("error", "Thêm sản phẩm vào giỏ hàng thất bại")
  }
  res.redirect("back")
}

module.exports = {
  addPost
}