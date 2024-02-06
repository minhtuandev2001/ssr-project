const express = require("express");
const router = express.Router()
const systemConfig = require("../../config/system")
const myAccountController = require("../../controllers/admin/my-account.controller")
const multer = require("multer")
const fileUpload = multer()
const uploadMiddleware = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/", myAccountController.index)
router.get("/edit", myAccountController.edit)
router.patch(
  "/edit",
  fileUpload.single('avatar'),
  uploadMiddleware.uploadCloud,
  myAccountController.editPatch)

module.exports = router 