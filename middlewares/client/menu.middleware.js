const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../utils/createTree")

const categorySubMenu = async (req, res, next) => {
  try {
    const productsCategory = await ProductCategory.find({ deleted: false })
    const newProductCategory = createTreeHelper.tree(productsCategory)
    res.locals.layoutProductsCategory = newProductCategory
    next()
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}
module.exports = {
  categorySubMenu
}