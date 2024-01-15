const index = (req, res) => {
  try {
    res.render('client/pages/products/index')
  } catch (error) {
    res.status(500).json({ message: error })
  }
}
module.exports = {
  index
}