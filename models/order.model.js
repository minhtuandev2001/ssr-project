const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
  user_id: { type: String },
  cart_id: { type: String },
  userInfo: {
    fullName: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  products: [
    {
      product_id: { type: String },
      price: { type: Number },
      discountPercentage: { type: Number },
      quantity: { type: Number },
    }
  ]
}, {
  timestamps: true
})

const Order = mongoose.model("Order", orderSchema)
module.exports = Order