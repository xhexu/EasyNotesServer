const router = require('koa-router')()

const home = require('./home')
const edit = require('./edit')
router.use('/', home.routes(), home.allowedMethods())
router.use('/edit', edit.routes(), edit.allowedMethods())

module.exports = router