const dashboard = (req, res) => {
  try {
    res.render("admin/pages/dashboard/index", { titlePage: "admin dashboard" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
module.exports = {
  dashboard
}