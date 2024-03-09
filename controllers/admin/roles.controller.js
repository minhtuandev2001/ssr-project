const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
// [GET] /admin/roles
const index = async (req, res) => {
  let find = {
    deleted: false
  }
  const roles = await Role.find(find)
  res.render('admin/pages/roles/index', {
    titlePage: 'Rights group',
    roles: roles
  })
}

// [GET] /admin/roles/create
const create = (req, res) => {
  res.render('admin/pages/roles/create', {
    titlePage: 'Add new permission group'
  })
}

// [POST] /admin/roles/create
const createPost = async (req, res) => {
  try {
    await Role.create(req.body)
    req.flash('success', "Adding new permission group failed")
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
  } catch (error) {
    req.flash('error', "Adding new permission group failed")
    res.redirect('back')
  }
}

// [GET] /admin/roles/edit/:id
const edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false
    }
    const role = await Role.findOne(find)
    res.render("admin/pages/roles/edit", {
      titlePage: 'Edit permission groups',
      role: role
    })
  } catch (error) {
    req.flash('error', "The permission group does not exist")
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
  }
}

// [PATCH] /admin/roles/edit/:id
const editPatch = async (req, res) => {
  try {
    const id = req.params.id
    await Role.updateOne({ _id: id, deleted: false }, req.body)
    req.flash('success', "Permission group update successful")
    res.redirect('back')
  } catch (error) {
    req.flash('error', "Updating permission groups failed")
    res.redirect('back')
  }
}

// [DELETE] /admin/roles/delete/:id
const deletePremissions = async (req, res) => {
  try {
    await Role.updateOne({ _id: req.params.id },
      {
        deleted: true,
        deleteAt: new Date()
      })
    req.flash('success', "Successfully deleted permission group")
  } catch (error) {
    req.flash('error', "The permission group does not exist")
  }
  res.redirect("back")
}

// [GET] /admin/roles/detail/:id
const detail = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      _id: id,
      deleted: false
    }
    const role = await Role.findOne(find);
    console.log(role)
    res.render("admin/pages/roles/detail", {
      titlePage: role.title,
      role: role
    })
  } catch (error) {
    req.flash("error", "This permission group does not exist")
    res.redirect("back")
  }
}

// [GET] /admin/roles/permissions 
const permissions = async (req, res) => {
  try {
    let find = {
      deleted: false
    }
    const roles = await Role.find(find)
    res.render("admin/pages/roles/permissions",
      {
        titlePage: "Decentralization",
        roles: roles
      })
  } catch (error) {
    console.log(error)
  }
}

// [PATCH] /admin/roles/permissions
const permissionsPatch = async (req, res) => {
  try {
    let data = JSON.parse(req.body.permissions)
    for (const item of data) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
    }
    req.flash('success', 'Updated permissions successfully')
  } catch (error) {
    console.log(error)
    req.flash('error', 'Updating permissions failed')
  }
  res.redirect("back")
}


module.exports = {
  index,
  create,
  createPost,
  edit,
  editPatch,
  detail,
  deletePremissions,
  permissions,
  permissionsPatch
}