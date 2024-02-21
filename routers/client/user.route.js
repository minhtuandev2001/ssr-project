const express = require("express")
const router = express.Router()

const userController = require("../../controllers/client/user.controller")
const userValidate = require("../../validates/client/user.validate")

const userAuthMiddleware = require("../../middlewares/client/auth.middleware")

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

router.get('/logout', userController.logout)

router.get('/password/forgot', userController.forgotPassword)

router.post(
  '/password/forgot',
  userValidate.forgotPasswordPost,
  userController.forgotPasswordPost)

router.get('/password/otp', userController.otpPassword)

router.post(
  '/password/otp',
  userValidate.otpPasswordPost,
  userController.otpPasswordPost)

router.get('/password/reset', userController.resetPassword)

router.post(
  '/password/reset',
  userValidate.resetPasswordPost,
  userController.resetPasswordPost)

router.get(
  '/info',
  userAuthMiddleware.requireAuth,
  userController.infoUser)
module.exports = router