const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const priceNewDiscountHelper = require("../../utils/priceNewDiscount")

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
    req.flash("success", "Added product to cart successfully")
  } catch (error) {
    req.flash("error", "Adding product to cart failed")
  }
  res.redirect("back")
}

// [GET] /cart 
const index = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    })
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id;

        const productInfo = await Product.findOne({ _id: productId })
        productInfo.priceNew = priceNewDiscountHelper.priceNewDiscountProduct(productInfo)

        item.productInfo = productInfo
        item.totalPrice = item.quantity * productInfo.priceNew
      }
    }
    // tính tiền tổng đơn hàng
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)

    res.render("client/pages/cart/index", {
      titlePage: "Cart",
      cartDetail: cart
    })
  } catch (error) {
    console.log(error)
    res.redirect("back")
  }
}

// [GET] /cart/delete/:productId
const deleteCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    await Cart.updateOne({ _id: cartId }, {
      $pull: { products: { "product_id": productId } }
    },
      { safe: true, multi: false }
    )
    req.flash("success", "Successfully removed product from cart")
  } catch (error) {
    req.flash("error", "Removing product from cart failed")
  }
  res.redirect("back")
}

// [PATCH] /cart/update/:productId/:quantity
const update = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;
    await Cart.updateOne({
      _id: cartId,
      "products.product_id": productId,
    }, {
      "products.$.quantity": quantity
    })
  } catch (error) {
    req.flash("error", "Updating quantity failed");
  }
  res.redirect("back");
}
module.exports = {
  addPost,
  index,
  deleteCart,
  update
}