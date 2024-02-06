const md5 = require('md5');
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")

// [GET] /admin/my-account/index 
const index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    titlePage: "Thông tin tài khoản"
  })
}

// [GET] /admin/my-account/edit
const edit = async (req, res) => {
  try {
    res.render(`admin/pages/my-account/edit`, {
      titlePage: "Thông tin tài khoản",
    })
  } catch (error) {
    res.status(500)
  }
}

// [PATCH] /admin/my-account/edit
const editPatch = async (req, res) => {
  try {
    const id = res.locals.user.id
    if (req.body.password) {
      req.body.password = md5(req.body.password)
    } else {
      delete req.body.password
    }
    const checkEmail = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
    })
    if (checkEmail) {
      req.flash("error", "Email này đã được sử dụng bởi người khác")
    } else {
      await Account.updateOne({ _id: id }, req.body)
      req.flash("success", "Cập nhật thông tin tài khoản thành công")
    }
  } catch (error) {
    req.flash("error", "Cập nhật thất bại")
  }
  res.redirect("back")
}

module.exports = {
  index,
  edit,
  editPatch
}