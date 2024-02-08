const productRoutes = require('./product.route')
const homeRoutes = require('./home.route')
const categoryMiddleware = require("../../middlewares/client/menu.middleware")

module.exports = (app) => {
  // dùng cho mọi trang 
  app.use(categoryMiddleware.categorySubMenu)

  app.use('/', homeRoutes)

  app.use('/products', productRoutes)
}