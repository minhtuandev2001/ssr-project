const index = (req, res) => {
  try {
    res.render("client/pages/home/index", { titlePage: "Home" })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

module.exports = {
  index
}