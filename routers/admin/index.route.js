const systemConfig = require("../../config/system")
const dashboardRouter = require("./dashboard.route")
const productRouter = require("./product.route")
const categoryRouter = require("./product-category.route")
const rolesRouter = require("./roles.route")
const accountsRouter = require("./accounts.route")
const authRouter = require("./auth.route")

// middleware
const authMiddleware = require("../../middlewares/admin/auth.middleware")
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin
  app.use(
    `${PATH_ADMIN}/dashboard`,
    authMiddleware.requireAuth,
    dashboardRouter)

  app.use(
    `${PATH_ADMIN}/products`,
    authMiddleware.requireAuth,
    productRouter)
  app.use(
    `${PATH_ADMIN}/products-category`,
    authMiddleware.requireAuth,
    categoryRouter)
  app.use(
    `${PATH_ADMIN}/roles`,
    authMiddleware.requireAuth,
    rolesRouter)
  app.use(`${PATH_ADMIN}/accounts`,
    authMiddleware.requireAuth,
    accountsRouter)

  app.use(`${PATH_ADMIN}/auth`, authRouter)
}