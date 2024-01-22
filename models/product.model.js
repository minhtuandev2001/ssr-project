const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number },
  stock: { type: Number },
  thumbnail: { type: String },
  status: { type: String },
  position: { type: Number },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product