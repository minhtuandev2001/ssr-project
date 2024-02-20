const md5 = require("md5")
const User = require("../../models/user.model")

// [GET] /user/register 
const register = (req, res) => {
  res.render("client/pages/user/register", {
    titlePage: "Đăng ký"
  })
}

// [POST] /user/register 
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

// [GET] /user/login
const login = (req, res) => {
  res.render("client/pages/user/login", {
    titlePage: "Đăng nhập"
  })
}

// [POST] /user/login
const loginPost = async (req, res) => {
  try {
    // kiểm tra email tồn tại 
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      req.flash("error", "Email này không tồn tại")
      res.redirect("back")
      return
    }
    if (md5(req.body.password) !== user.password) {
      req.flash("error", "Mật khẩu không đúng, nhập lại")
      res.redirect("back")
      return
    }
    if (user.status === "inactive") {
      req.flash("error", "Tài khoản của bạn hiện đang bị khóa")
      res.redirect("back")
      return
    }

    req.flash("success", `Chào mừng ${user.fullName}`)
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
  registerPost,
  login,
  loginPost
}