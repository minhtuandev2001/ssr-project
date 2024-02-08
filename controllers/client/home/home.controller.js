const index = async (req, res) => {
  try {
    res.render("client/pages/home/index", {
      titlePage: "Trang chủ",
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}