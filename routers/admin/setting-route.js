const express = require("express");
const router = express.Router()
const multer = require('multer');
const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware")
const fileUpload = multer()

const settingController = require("../../controllers/admin/setting.controller")

router.get("/general", settingController.general)

router.patch(
  "/general",
  fileUpload.single("logo"),
  uploadCloudMiddleware.uploadCloud,
  settingController.generalPatch)

module.exports = router