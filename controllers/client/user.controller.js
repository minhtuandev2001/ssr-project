const md5 = require("md5")
const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")

const generate = require("../../utils/generate")

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

// [GET] /user/logout 
const logout = (req, res) => {
  res.clearCookie("tokenUser")
  res.redirect("/")
}

// [GET] /user/password/forgot
const forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    titlePage: "Quên mật khẩu"
  })
}

// [POST] /user/password/forgot 
const forgotPasswordPost = async (req, res) => {
  try {
    const email = req.body.email
    // check email có tồn tại không
    const existEmail = await User.findOne({
      email: email,
      deleted: false
    })
    if (!existEmail) {
      req.flash("error", "Email không tồn tại")
      res.redirect("back")
      return
    }
    // vc1:  tạo mã otp và lưu mã otp, email vào collection
    const objectForgotPassword = {
      email: email,
      otp: "",
      expireAt: Date.now()
    }
    objectForgotPassword.otp = generate.generateRandomNumber(8)
    const otp = new ForgotPassword(objectForgotPassword)
    await otp.save()

    // vc2: gửi mã otp qua email user
    res.redirect(`/user/password/otp?email=${email}`)
  } catch (error) {
    res.redirect("/user/password/forgot")
  }
}

// [GET] /user/password/otp
const otpPassword = async (req, res) => {
  const email = req.query.email
  res.render("client/pages/user/otp-password", {
    titlePage: "Nhập mã otp",
    email: email
  })
}

// [POST] /user/password/otp
const otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })
  if (!result) {
    req.flash("error", "Mã otp không hợp lệ")
    res.redirect("back")
    return
  }
  // lấy ra thông tin người dùng sau khi đã check otp
  const user = User.findOne({
    email: email
  })
  res.cookie("tokenUser", user.tokenUser)
  res.redirect("/user/password/reset", {
    titlePage: "Cập nhật mật khẩu"
  })
}
module.exports = {
  register,
  registerPost,
  login,
  loginPost,
  logout,
  forgotPassword,
  forgotPasswordPost,
  otpPassword,
  otpPasswordPost
}