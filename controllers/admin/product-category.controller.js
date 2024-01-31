const index = (req, res) => {
  try {
    res.render("admin/pages/product-category/index", {
      titlePage: "Danh mục sản phẩm"
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}