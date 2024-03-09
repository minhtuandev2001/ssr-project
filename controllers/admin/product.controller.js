const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const Account = require("../../models/account.model")
const filterStatusHelper = require("../../utils/filterStatus")
const searchHelper = require("../../utils/search")
const paginationHelper = require("../../utils/pagination")
const createTreeHelper = require("../../utils/createTree")
const systemConfig = require("../../config/system")

// [GET] /admin/products
const index = async (req, res) => {
  // Bộ lọc 
  let filterStatus = filterStatusHelper(req.query)
  // Nội dung lọc
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
  // phân trang
  const countProducts = await Product.countDocuments(find)
  const objectPagination = paginationHelper(
    {
      currentPage: 1,
      limit: 4
    },
    req.query,
    countProducts,
  )

  // sort 
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = 'desc'
  }
  try {
    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limit)
      .skip(objectPagination.skip)

    for (const product of products) {
      // lấy ra thông tin người tạo
      const user = await Account.findOne({ _id: product.createdBy.account_id }).select("fullName")
      if (user) {
        product.accountFullName = user.fullName
      }

      // lấy ngược bằng slice và lấy phần tử đầu tiên
      const updatedBy = product.updatedBy.slice(-1)[0]
      // lấy ra người chỉnh sửa gần đây nhất nếu có
      if (updatedBy) {
        // lấy ra thông tin người cập nhật gần nhất
        const userUpdated = await Account.findOne({ _id: updatedBy.account_id }).select("fullName")
        updatedBy.accountFullName = userUpdated.fullName
      }
    }

    res.render("admin/pages/products/index", {
      titlePage: "admin products",
      products: products,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

// [PATCH] /admin/products/change-status/:status/:id
const changeStatus = async (req, res) => {
  const { status, id } = req.params;
  try {
    const ivalidProduct = await Product.findById(id)
    if (!ivalidProduct) {
      res.send("product does not exist")
    }
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    await Product.updateOne({ _id: id }, {
      status: status,
      $push: { updatedBy: updatedBy }
    })
    req.flash("success", "Status update successful")
    res.redirect("back")
  } catch (error) {
    req.flash("error", "Status update failed")
    console.log(error)
    res.status(500).json({ message: error })
  }
}

// [PATCH] /admin/change-multi
const changeMultiStatus = async (req, res) => {
  const type = req.body.type
  const ids = req.body.ids.split(', ')
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    switch (type) {
      case "active":
        await Product.updateMany({ _id: { $in: ids } }, {
          status: type,
          $push: { updatedBy: updatedBy }
        })
        req.flash("success", `Successfully updated the status of ${ids.length} product`)
        break;
      case "inactive":
        await Product.updateMany({ _id: { $in: ids } }, {
          status: type,
          $push: { updatedBy: updatedBy }
        })
        req.flash("success", `Successfully updated the status of ${ids.length} product`)
        break;
      case "delete-all":
        await Product.updateMany({ _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date()
            }
          })
        req.flash("success", `Deleted successfully ${ids.length} product`)
        break;
      case "change-position":
        for (let item of ids) {
          let [id, position] = item.split("-")
          position = Number(position)
          await Product.updateOne({ _id: id }, {
            position: position,
            $push: { updatedBy: updatedBy }
          })
        }
        req.flash("success", `Update location for ${ids.length} successful product`)
        break;
      default:
        break;
    }
  } catch (error) {
    req.flash("error", `Update failed`)
  }
  res.redirect("back")
}

// [DELETE] /admin/delete/:id 
const deleteProduct = async (req, res) => {
  const id = req.params.id
  try {
    // await Product.deleteOne({ _id: id }) // xóa cứng
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }
      }) // xóa mềm
    req.flash("success", `Successfully deleted the product`)
  } catch (error) {
    req.flash("error", `Delete product failure`)
  }
  res.redirect("back")
}

// [GET] /admin/create
const create = async (req, res) => {
  try {
    const categorys = await ProductCategory.find({ deleted: false })
    const newCategorys = createTreeHelper.tree(categorys)
    res.render("admin/pages/products/create", {
      titlePage: "Add new product",
      categorys: newCategorys
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

// [POST] /admin/create
const createPost = async (req, res) => {
  req.body.price = Number(req.body.price)
  req.body.discountPercentage = Number(req.body.discountPercentage)
  req.body.stock = Number(req.body.stock)
  if (req.body.position === "") {
    const countProducts = await Product.countDocuments()
    req.body.position = countProducts + 1
  } else {
    req.body.position = Number(req.body.position)
  }
  // thêm người tạo
  req.body.createdBy = {
    account_id: res.locals.user.id
  }
  try {
    await Product.create(req.body)
    req.flash('success', "Create new products successfully")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  } catch (error) {
    req.flash('error', "Creating a new product failed")
    res.redirect("back")
  }
}

// [GET] /admin/edit/:id
const edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const dataProduct = await Product.findOne(find)
    const categorys = await ProductCategory.find({ deleted: false })
    const newCategorys = createTreeHelper.tree(categorys)
    res.render("admin/pages/products/edit.pug", {
      titlePage: "Edit products",
      product: dataProduct,
      categorys: newCategorys
    })
  } catch (error) {
    res.render(`${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /admin/edit/:id
const editPatch = async (req, res) => {
  req.body.price = Number(req.body.price)
  req.body.discountPercentage = Number(req.body.discountPercentage)
  req.body.stock = Number(req.body.stock)
  req.body.position = Number(req.body.position)
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    await Product.updateOne({ _id: req.params.id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    })
    req.flash("success", "Product update successful")
  } catch (error) {
    req.flash("error", "Product update failed")
    res.status(500).json({ message: error })
  }
  res.redirect("back")
}

const detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id
  }
  try {
    const product = await Product.findOne(find)
    res.render("admin/pages/products/detail", {
      titlePage: product.title,
      product: product
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

module.exports = {
  index,
  changeStatus,
  changeMultiStatus,
  deleteProduct,
  create,
  createPost,
  edit,
  editPatch,
  detail
}