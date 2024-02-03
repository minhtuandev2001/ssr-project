const express = require('express')
const router = express.Router()
const rolesController = require('../../controllers/admin/roles.controller')

router.get('/', rolesController.index)
router.get('/create', rolesController.create)
router.post('/create', rolesController.createPost)

module.exports = router