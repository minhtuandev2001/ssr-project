const md5 = require("md5")
const Account = require("../../models/account.model")

const systemConfig = require("../../config/system")

// [GET] /admin/auth/login 
const login = (req, res) => {
  if (req.cookies?.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  } else {
    res.render("admin/pages/auth/login", {
      titlePage: 'Login'
    })
  }
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
      req.flash("error", "Account does not exist")
      res.redirect("back")
      return
    }
    if (password !== account.password) {
      req.flash("error", "wrong password")
      res.redirect("back")
      return
    }
    if (account.status === "inactive") {
      req.flash("error", "Account has been locked")
      res.redirect("back")
      return
    }
    req.flash("success", "Welcome")
    res.cookie("token", account.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  } catch (error) {
    console.log(error)
    req.flash("error", "Login failed")
    res.redirect("back")
  }
}

// [GET] /admin/auth/logout
const logout = (req, res) => {
  res.clearCookie("token")
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}

module.exports = {
  login,
  loginPost,
  logout
}