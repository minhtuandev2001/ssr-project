const Product = require("../../models/product.model")
const filterStatusHelper = require("../../utils/filterStatus")
const searchHelper = require("../../utils/search")
const paginationHelper = require("../../utils/pagination")
const { response } = require("express")

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
  try {
    const data = await Product.find(find)
      .sort({ position: "desc" })
      .limit(objectPagination.limit)
      .skip(objectPagination.skip)
    res.render("admin/pages/products/index", {
      titlePage: "admin products",
      products: data,
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
      res.send("san pham ko ton tai")
    }
    await Product.updateOne({ _id: id }, { status: status })
    req.flash("success", "Cập nhật trạng thái thành công")
    res.redirect("back")
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
// [PATCH] /admin/change-multi
const changeMultiStatus = async (req, res) => {
  const type = req.body.type
  const ids = req.body.ids.split(', ')
  try {
    switch (type) {
      case "active":
        await Product.updateMany({ _id: { $in: ids } }, { status: type })
        req.flash("success", `Cập nhật thành công trạng thái của ${ids.length} sản phẩm`)
        break;
      case "inactive":
        await Product.updateMany({ _id: { $in: ids } }, { status: type })
        req.flash("success", `Cập nhật thành công trạng thái của ${ids.length} sản phẩm`)
        break;
      case "delete-all":
        await Product.updateMany({ _id: { $in: ids } },
          {
            deleted: true,
            deletedAt: new Date()
          })
        req.flash("success", `Xóa thành công ${ids.length} sản phẩm`)
        break;
      case "change-position":
        for (let item of ids) {
          let [id, position] = item.split("-")
          position = Number(position)
          await Product.updateOne({ _id: id }, { position: position })
        }
        req.flash("success", `Cập nhật vị trí cho ${ids.length} sản phẩm thành công`)
        break;
      default:
        break;
    }
    res.redirect("back")
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
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
        deletedAt: new Date()
      }) // xóa mềm
    req.flash("success", `Xóa thành công sản phẩm`)
    res.redirect("back")
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
// [GET] /admin/create
const create = (req, res) => {
  try {
    res.render("admin/pages/products/create", { titlePage: "Thêm mới sản phẩm" })
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
  if (req.file.filename) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }
  try {
    await Product.create(req.body)
    req.flash('success', "Tạo mới sản phẩm thành công")
    res.redirect('/admin/products')
  } catch (error) {
    res.status(500).json({ message: error })
  }
}
module.exports = {
  index,
  changeStatus,
  changeMultiStatus,
  deleteProduct,
  create,
  createPost
}