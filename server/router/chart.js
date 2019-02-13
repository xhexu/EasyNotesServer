const router = require('koa-router')()
const chart = require('../controllers/chart')
const routers = router
    .post('/queryChart.next', chart.queryChart)

module.exports = routers