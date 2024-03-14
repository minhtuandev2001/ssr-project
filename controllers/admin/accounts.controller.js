const md5 = require("md5")
const Account = require("../../models/account.model")
const Role = require("../../models/role.model")

const systemConfig = require("../../config/system")

const searchHelper = require("../../utils/search")
const paginationHelper = require("../../utils/pagination")
const filterStatusHelper = require("../../utils/filterStatus")

// [GET] /admin/accounts
const index = async (req, res) => {
  // Bộ lọc 
  let filterStatus = filterStatusHelper(req.query)
  try {
    const find = {
      deleted: false
    }
    if (req.query.status) {
      find.status = req.query.status
    }
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }
    // Tìm kiếm
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
      find.fullName = objectSearch.regex
    }
    // Phân trang 
    const countAccounts = await Account.countDocuments(find).select("-password -token")
    const objectPagination = paginationHelper(
      {
        currentPage: 1,
        limit: 10
      },
      req.query,
      countAccounts, 10
    )
    const accounts = await Account.find(find).sort(sort).select("-password -token")
    for (const account of accounts) {
      const role = await Role.findOne({
        _id: account.role_id,
        deleted: false
      })
      account.role_name = role.title
    }
    res.render("admin/pages/accounts/index", {
      siderTitle: "list account",
      titlePage: "List of accounts",
      accounts: accounts,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
      filterStatus: filterStatus,
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
      siderTitle: "list account",
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
      siderTitle: "list account",
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

// [PATCH] /admin/acounts/change-status/:status/:id
const changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    const userId = res.locals.user.id;
    if (id === userId) {
      req.flash("error", "Cannot change permissions for yourself");
      res.redirect("back")
      return;
    }
    await Account.updateOne({ _id: id }, { status: status })
    req.flash("success", "Updated user status successfully")
  } catch (error) {
    req.flash("error", "Updating user status failed");
  }
  res.redirect("back")
}

// [DELETE] /admin/delete/:id
const deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = res.locals.user.id;
    if (id === userId) {
      req.flash("error", "Do not delete your own account");
      res.redirect("back");
      return;
    }
    const accountExist = await Account.findOne({ _id: id, deleted: false })
    if (!accountExist) {
      req.flash("error", "This account does not exist");
      res.redirect("back");
      return;
    }
    await Account.updateOne({ _id: id }, { deleted: true });
    req.flash("success", "Account deleted successfully");
  } catch (error) {
    req.flash("error", "Account deletion failed")
  }
  res.redirect("back")
}

// [GET] /admin/detail/:id
const detail = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("check id", id)
    const account = await Account.findOne({ _id: id, deleted: false })
    if (!account) {
      req.flash("error", "User account does not exist")
      res.redirect("back")
      return;
    }
    const role = await Role.findOne({ _id: account.role_id })
    account.role_title = role.title
    res.render("admin/pages/accounts/detail.pug", {
      siderTitle: "list account",
      titlePage: "Detail account",
      account: account
    })
  } catch (error) {
    req.flash("error", "Error")
    res.redirect("back")
  }
}
module.exports = {
  index,
  create,
  createPost,
  edit,
  editPatch,
  changeStatus,
  deleteAccount,
  detail
}