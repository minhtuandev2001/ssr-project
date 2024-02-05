const createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên")
    res.redirect("back")
    return
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập họ tên")
    res.redirect("back")
    return
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập họ tên")
    res.redirect("back")
    return
  }
  next()
}
const editPath = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên")
    res.redirect("back")
    return
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập họ tên")
    res.redirect("back")
    return
  }
  next()
}
module.exports = {
  createPost,
  editPath
}