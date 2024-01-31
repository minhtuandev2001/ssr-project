const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  parent_id: { type: String, default: '' },
  description: { type: String },
  thumbnail: { type: String },
  status: { type: String },
  position: { type: Number },
  slug: {
    type: String,
    slug: 'title',
    unique: true,
  },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, {
  timestamp: true
})

const ProductCategory = mongoose.model('products-category', productCategorySchema, 'products-category')

module.exports = ProductCategory