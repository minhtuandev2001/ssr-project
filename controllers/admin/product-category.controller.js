const ProductCategory = require('../../models/product-category.model')
const systemConfig = require('../../config/system')
// helper
const filterStatusHelper = require('../../utils/filterStatus')
const searchHelper = require("../../utils/search")
const paginationHelper = require("../../utils/pagination")
const createTreeHelper = require("../../utils/createTree")

// [GET] /admin/products-category 
const index = async (req, res) => {
  // Bộ lọc 
  let filterStatus = filterStatusHelper(req.query)

  const find = {
    deleted: false,
  }
  if (req.query.status) {
    find.status = req.query.status
  }
  // Tìm kiếm 
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }
  // Phân trang
  const countCategory = await ProductCategory.countDocuments(find)
  const objectPagination = paginationHelper({
    currentPage: 1,
    limit: 6
  },
    req.query,
    countCategory, 6
  )
  // sort 
  const sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc"
  }
  try {
    const categorys = await ProductCategory.find(find)
      .sort(sort)
      .limit(objectPagination.limit)
      .skip(objectPagination.skip)
    const newCategorys = createTreeHelper.tree(categorys)
    res.render("admin/pages/product-category/index", {
      siderTitle: "Category",
      titlePage: "Product portfolio",
      categorys: newCategorys,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

// [GET] /admin/products-category/create
const create = async (req, res) => {
  try {
    const find = {
      deleted: false
    }
    const categorys = await ProductCategory.find(find).sort({ position: 'desc' })
    const newCategorys = createTreeHelper.tree(categorys)

    res.render('admin/pages/product-category/create', {
      siderTitle: "Category",
      titlePage: 'Create product catalog',
      categorys: newCategorys
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

// [POST] /admin/products-category/create
const createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("products-category_create")) {

    try {
      if (req.body.position === '') {
        const count = await ProductCategory.countDocuments()
        req.body.position = count + 1
      } else {
        req.body.position = Number(req.body.position)
      }
      await ProductCategory.create(req.body)
      req.flash("success", "Created a successful portfolio")
      res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    } catch (error) {
      req.flash("error", "Create a failure category")
      res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
  } else {
    res.status(403).send('403')
    return
  }
}

// [DELETE] /admin/products-category/delete/:id 
const deleteProductCategory = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    req.flash('error', 'Delete failed product')
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
  try {
    await ProductCategory.updateOne({ _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }
      }
    )
    req.flash('success', 'Product deletion successful')
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  } catch (error) {
    req.flash('error', 'Delete failed product')
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
}

// [GET] /admin/products-category/detail/:id
const detail = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
  try {
    const category = await ProductCategory.findOne({ _id: id })
    res.render('admin/pages/product-category/detail', {
      siderTitle: "Category",
      titlePage: category.title,
      category: category
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
}

// [GET] /admin/products-category/edit/:id
const edit = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
    const category = await ProductCategory.findOne(
      {
        _id: id,
        deleted: false
      })
    const categorys = await ProductCategory.find({ deleted: false })
    const newCategorys = createTreeHelper.tree(categorys)

    res.render('admin/pages/product-category/edit', {
      siderTitle: "Category",
      titlePage: category.title,
      category: category,
      categorys: newCategorys
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
}

// [PATCH] /admin/products-category/edit/:id
const editPatch = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.redirect("back")
  }
  try {
    await ProductCategory.updateOne({ _id: id }, req.body)
    req.flash('success', 'Updated directory successfully')
    res.redirect("back")
  } catch (error) {
    req.flash('success', 'Update catalog failed')
  }
}

// [PATCH] /admin/products-category/change-multi
const changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = (req.body.ids).split(', ');
  try {
    switch (type) {
      case 'active':
        await ProductCategory.updateMany({ _id: ids }, { status: 'active' })
        req.flash('success', `Update successful ${ids.length} category`)
        break;
      case 'inactive':
        await ProductCategory.updateMany({ _id: ids }, { status: 'inactive' })
        req.flash('success', `Update successful ${ids.length} category`)
        break;
      case 'delete-all':
        await ProductCategory.updateMany({ _id: { $in: ids } }, {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
          }
        })
        req.flash('success', `Deleted successfully ${ids.length} category`)
        break;
      case 'change-position':
        ids.forEach(async (item) => {
          let id = item.split('-')[0]
          let position = Number(item.split('-')[1])
          await ProductCategory.updateOne({ _id: id }, { position: position })
        });
        req.flash('success', `Update successful ${ids.length} category`)
        break;
      default:
        break;
    }
    res.redirect("back")
  } catch (error) {
    req.flash('error', 'Cập nhật thất bại')
    res.redirect("back")
  }
}

// [GET] /admin/product-category/change-status/:id
const changeStatus = async (req, res) => {
  const id = req.params.id
  const status = req.params.status
  try {
    await ProductCategory.updateOne({ _id: id }, { status: status })
    req.flash('success', 'Update successful')
    res.redirect("back")
  } catch (error) {
    req.flash('error', 'Update failed')
  }
}
module.exports = {
  index,
  create,
  createPost,
  deleteProductCategory,
  detail,
  edit,
  editPatch,
  changeMulti,
  changeStatus
}