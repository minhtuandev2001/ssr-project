const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user_id: { type: String },
  products: [
    {
      product_id: { type: String },
      quantity: { type: Number }
    }
  ]
}, {
  timestamps: true
})

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart