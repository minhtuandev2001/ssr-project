const express = require("express")
const router = express.Router()

const userController = require("../../controllers/client/user.controller")
const userValidate = require("../../validates/client/user.validate")

router.get('/register', userController.register)

router.post(
  '/register',
  userValidate.registerPost,
  userController.registerPost)

router.get('/login', userController.login)

router.post(
  '/login',
  userValidate.loginPost,
  userController.loginPost)

module.exports = router