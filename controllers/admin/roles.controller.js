const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
// [GET] /admin/roles
const index = async (req, res) => {
  let find = {
    deleted: false
  }
  const roles = await Role.find(find)
  res.render('admin/pages/roles/index', {
    titlePage: 'Nhóm quyền',
    roles: roles
  })
}
// [GET] /admin/roles/create
const create = (req, res) => {
  res.render('admin/pages/roles/create', {
    titlePage: 'Thêm mới nhóm quyền'
  })
}
// [POST] /admin/roles/create
const createPost = async (req, res) => {
  try {
    await Role.create(req.body)
    req.flash('success', "Thêm mới nhóm quyền không thành công")
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
  } catch (error) {
    req.flash('error', "Thêm mới nhóm quyền không thành công")
    res.redirect('back')
  }
}
module.exports = {
  index,
  create,
  createPost
}