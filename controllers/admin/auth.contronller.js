const md5 = require("md5")
const Account = require("../../models/account.model")

const systemConfig = require("../../config/system")

// [GET] /admin/auth/login 
const login = (req, res) => {
  res.render("admin/pages/auth/login", {
    titlePage: 'Đăng nhập'
  })
}

// [POST] /admin/auth/login
const loginPost = async (req, res) => {
  try {
    const email = req.body.email
    const password = md5(req.body.password)

    const account = await Account.findOne({
      email: email,
      deleted: false
    })
    if (!account) {
      req.flash("error", "Tài khoản không tồn tại")
      res.redirect("back")
      return
    }
    if (password !== account.password) {
      req.flash("error", "Mật khẩu sai")
      res.redirect("back")
      return
    }
    if (account.status === "inactive") {
      req.flash("error", "Tài khoản đã bị khóa")
      res.redirect("back")
      return
    }
    req.flash("success", "Chào mừng ")
    res.cookie("token", account.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  } catch (error) {
    console.log(error)
    req.flash("error", "Đăng nhập thất bại")
    res.redirect("back")
  }
}
module.exports = {
  login,
  loginPost
}