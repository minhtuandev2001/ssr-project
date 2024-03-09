const md5 = require("md5")
const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")

const generate = require("../../utils/generate")
const sendMailHelper = require("../../utils/sendMail")
const Cart = require("../../models/cart.model")

// [GET] /user/register 
const register = (req, res) => {
  res.render("client/pages/user/register", {
    titlePage: "Register"
  })
}

// [POST] /user/register 
const registerPost = async (req, res) => {
  try {
    // kiểm tra email tồn tại 
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
      req.flash("error", "This email already exists")
      res.redirect("back")
      return
    }
    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()
    req.flash("success", "Sign Up Success")
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/")
  } catch (error) {
    console.log(error)
    req.flash("error", "registration failed")
    res.redirect("back")
  }
}

// [GET] /user/login
const login = (req, res) => {
  res.render("client/pages/user/login", {
    titlePage: "Login"
  })
}

// [POST] /user/login
const loginPost = async (req, res) => {
  try {
    // kiểm tra email tồn tại 
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      req.flash("error", "This email does not exist")
      res.redirect("back")
      return
    }
    if (md5(req.body.password) !== user.password) {
      req.flash("error", "Password is incorrect, re-enter")
      res.redirect("back")
      return
    }
    if (user.status === "inactive") {
      req.flash("error", "Your account is currently locked")
      res.redirect("back")
      return
    }

    req.flash("success", `Welcome ${user.fullName}`)
    res.cookie("tokenUser", user.tokenUser)

    await Cart.updateOne({
      _id: req.cookies.cartId
    }, {
      user_id: user.id
    })
    res.redirect("/")
  } catch (error) {
    console.log(error)
    req.flash("error", "registration failed")
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
    titlePage: "Forgot password"
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
      req.flash("error", "Email does not exist")
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
    const subject = "Mã OTP xác minh lấy lại mật khẩu"
    const html = `
    Mã OTP xác minh lấy lại mật khẩu là <b>${objectForgotPassword.otp}</b> Lưu ý không được để lọ, thời hạn sử dụng là 3 phút`
    sendMailHelper.sendMail(email, subject, html)

    res.redirect(`/user/password/otp?email=${email}`)
  } catch (error) {
    res.redirect("/user/password/forgot")
  }
}

// [GET] /user/password/otp
const otpPassword = async (req, res) => {
  const email = req.query.email
  res.render("client/pages/user/otp-password", {
    titlePage: "Enter the otp code",
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
    req.flash("error", "Invalid otp code")
    res.redirect("back")
    return
  }
  // lấy ra thông tin người dùng sau khi đã check otp
  const user = await User.findOne({
    email: email
  })
  res.cookie("tokenUser", user.tokenUser)
  res.redirect("/user/password/reset")
}

// [GET] /user/password/reset
const resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    titlePage: "Update password",
  })
}

// [POST] /user/password/reset
const resetPasswordPost = async (req, res) => {
  try {
    const password = md5(req.body.password)
    const tokenUser = req.cookies.tokenUser

    await User.updateOne({
      tokenUser: tokenUser
    }, { password: password })
    req.flash("success", "Updated password successfully")
    res.redirect("/")
  } catch (error) {
    req.flash("error", "Password update failed")
    res.redirect("user/password/reset")
  }
}

// [GET] /user/info
const infoUser = async (req, res) => {
  try {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser })
    res.render("client/pages/user/info", {
      titlePage: "User information"
    })
  } catch (error) {
    res.flash("error", "An error occurred")
    res.redirect("back")
  }
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
  otpPasswordPost,
  resetPassword,
  resetPasswordPost,
  infoUser
}