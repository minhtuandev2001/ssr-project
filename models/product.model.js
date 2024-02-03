const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  product_category_id: { type: String, default: "" },
  price: { type: Number, required: true },
  discountPercentage: { type: Number },
  stock: { type: Number },
  thumbnail: { type: String },
  status: { type: String },
  position: { type: Number },
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, {
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product