const md5 = require("md5")
const User = require("../../models/user.model")

// [GET] /user/register 
const register = (req, res) => {
  res.render("client/pages/user/register", {
    titlePage: "Đăng ký"
  })
}

// [GET] /user/register 
const registerPost = async (req, res) => {
  try {
    console.log(req.body)
    // kiểm tra email tồn tại 
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
      req.flash("error", "Email này đã tồn tại")
      res.redirect("back")
      return
    }
    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()
    req.flash("success", "Đăng ký thành công")
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")
  } catch (error) {
    console.log(error)
    req.flash("error", "Đăng ký thất bại")
    res.redirect("back")
  }
}

module.exports = {
  register,
  registerPost
}