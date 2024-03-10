const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const Account = require("../../models/account.model")
const User = require("../../models/user.model")

// [GET] /admin/dashboard
const dashboard = async (req, res) => {
  try {
    const statistics = {
      category: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      product: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      account: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      user: {
        total: 0,
        active: 0,
        inactive: 0,
      },
    }
    statistics.category.total = await ProductCategory.countDocuments({ deleted: false })
    statistics.category.active = await ProductCategory.countDocuments({ deleted: false, status: "active" })
    statistics.category.inactive = await ProductCategory.countDocuments({ deleted: false, status: "inactive" })

    statistics.product.total = await Product.countDocuments({ deleted: false })
    statistics.product.active = await Product.countDocuments({ deleted: false, status: "active" })
    statistics.product.inactive = await Product.countDocuments({ deleted: false, status: "inactive" })

    statistics.account.total = await Account.countDocuments({ deleted: false })
    statistics.account.active = await Account.countDocuments({ deleted: false, status: "active" })
    statistics.account.inactive = await Account.countDocuments({ deleted: false, status: "inactive" })

    statistics.user.total = await User.countDocuments({ deleted: false })
    statistics.user.active = await User.countDocuments({ deleted: false, status: "active" })
    statistics.user.inactive = await User.countDocuments({ deleted: false, status: "inactive" })
    res.render("admin/pages/dashboard/index", {
      siderTitle: "Dashboard",
      titlePage: "Dashboard",
      statistics: statistics
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
module.exports = {
  dashboard
}