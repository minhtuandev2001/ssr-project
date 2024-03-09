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
      titlePage: "List of accounts",
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
      titlePage: "Add new user",
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
      req.flash("error", "This email already exists in the system")
      res.redirect("back")
      return
    }
    req.body.password = md5(req.body.password)
    await Account.create(req.body)
    req.flash("success", "New account added successfully")
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  } catch (error) {
    console.log(error)
    req.flash("error", "Adding new account failed")
    res.redirect('back')
  }
}

// [GET] /admin/accounts/edit/:id
const edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false
    }
    const account = await Account.findOne(find)
    const roles = await Role.find({ deleted: false })
    res.render("admin/pages/accounts/edit", {
      titlePage: "Edit account",
      account: account,
      roles: roles
    })
  } catch (error) {
    req.flash("error", "This account does not exist")
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  }
}

// [PATCH] /admin/accounts/edit/:id
const editPatch = async (req, res) => {
  try {
    const checkEmail = await Account.findOne({
      _id: { $ne: req.params.id },
      email: req.body.email,
      deleted: false
    })
    if (checkEmail) {
      req.flash("error", "E-mail is being used")
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password)
      } else {
        delete req.body.password
      }
      await Account.updateOne({ _id: req.params.id }, req.body)
      req.flash("success", "Updated account information successfully")
    }
  } catch (error) {
    req.flash("error", "Update account information failed")
  }
  res.redirect("back")
}

module.exports = {
  index,
  create,
  createPost,
  edit,
  editPatch
}