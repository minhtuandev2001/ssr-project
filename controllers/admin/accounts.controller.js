const md5 = require("md5")
const Account = require("../../models/account.model")
const Role = require("../../models/role.model")

const systemConfig = require("../../config/system")
// [GET] /admin/accounts
const index = async (req, res) => {
  try {
    const find = {
      deleted: false
    }
    const accounts = await Account.find(find).select("-password -token")
    for (const account of accounts) {
      const role = await Role.findOne({
        _id: account.role_id,
        deleted: false
      })
      account.role_name = role.title
    }
    res.render("admin/pages/accounts/index", {
      titlePage: "Danh sách tài khoản",
      accounts: accounts
    })
  } catch (error) {
    res.status(500)
  }
}

// [GET] /admin/accounts/create
const create = async (req, res) => {
  try {
    const roles = await Role.find({ deleted: false })
    res.render("admin/pages/accounts/create", {
      titlePage: "Thêm mới người dùng",
      roles: roles
    })
  } catch (error) {
    res.redirect("back")
  }
}
// [POST] /admin/accounts/create
const createPost = async (req, res) => {
  try {
    const checkEmail = await Account.findOne({
      email: req.body.email,
      deleted: false
    })
    if (checkEmail) {
      req.flash("error", "Email này đã tồn tại trong hệ thống")
      res.redirect("back")
      return
    }
    req.body.password = md5(req.body.password)
    await Account.create(req.body)
    req.flash("success", "Thêm mới tài khoản thành công")
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  } catch (error) {
    console.log(error)
    req.flash("error", "Thêm mới tài khoản thất bại")
    res.redirect('back')
  }
}


module.exports = {
  index,
  create,
  createPost
}