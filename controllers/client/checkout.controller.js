const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order = require("../../models/order.model")

const priceNewDiscountHelper = require("../../utils/priceNewDiscount")

// [GET] /checkout
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

// [POST] /checkout/order
const order = async (req, res) => {
  try {
    const cartId = req.cookies.cartId
    const userInfo = req.body
    const cart = await Cart.findOne({ _id: cartId })
    let products = []
    for (const item of cart.products) {
      const product = await Product.findOne({ _id: item.product_id })

      const objectProduct = {
        product_id: item.product_id,
        price: product.price,
        discountPercentage: product.discountPercentage,
        quantity: item.quantity,
      }
      products.push(objectProduct)
    }
    // lưu vào database 
    const objectOrder = {
      cart_id: cartId,
      userInfo: userInfo,
      products: products
    }
    const order = new Order(objectOrder)
    await order.save()
    // cập nhật lại giỏ hàng
    await Cart.updateOne({ _id: cartId }, { products: [] })

    req.flash("success", "Đặt hàng thành công")
    // làm thêm logic cập nhật số hàng còn lại/ làm trang đặt hàng thành công
  } catch (error) {
    req.flash("error", "Đặt hàng thất bại")
  }
  res.redirect("back")
}

module.exports = {
  index,
  order
}