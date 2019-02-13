const router = require('koa-router')()

const home = require('./home')
const edit = require('./edit')
const chart = require('./chart')
const upload = require('./upload')

router.use('/', home.routes(), home.allowedMethods())
router.use('/upload', upload.routes(), upload.allowedMethods())
router.use('/edit', edit.routes(), edit.allowedMethods())
router.use('/chart', chart.routes(), chart.allowedMethods())

module.exports = router