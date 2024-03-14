const express = require("express")
const router = express.Router()
const multer = require('multer')
const fileUpload = multer()
const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware")
const accountsController = require("../../controllers/admin/accounts.controller")
const accountsValidate = require("../../validates/admin/accounts.validate")

router.get("/", accountsController.index)
router.get("/create", accountsController.create)
router.post(
  "/create",
  fileUpload.single('avatar'),
  uploadCloudMiddleware.uploadCloud,
  accountsValidate.createPost,
  accountsController.createPost)

router.get("/edit/:id", accountsController.edit)
router.patch(
  "/edit/:id",
  fileUpload.single('avatar'),
  uploadCloudMiddleware.uploadCloud,
  accountsValidate.editPath,
  accountsController.editPatch)
router.patch("/change-status/:status/:id", accountsController.changeStatus)
router.delete("/delete/:id", accountsController.deleteAccount)
router.get("/detail/:id", accountsController.detail)
module.exports = router