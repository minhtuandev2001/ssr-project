const express = require("express")
const router = express.Router()

const authController = require("../../controllers/admin/auth.contronller")
const authValidate = require("../../validates/admin/auth.validate")

router.get('/login', authController.login)
router.post(
  '/login',
  authValidate.loginPost,
  authController.loginPost)

module.exports = router