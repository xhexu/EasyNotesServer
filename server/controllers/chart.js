const db = require('../services/db.js')
const config = require('../config')

module.exports = {
    /**
     * 查询图表数据
     * @param {*} ctx 
     */
    async queryChart(ctx) {
        let formData = ctx.request.body
        const type = formData.type||'line'
        const data = await db.queryChart(type)
        ctx.body = config.callBackObj(true,"查询成功",data)
    }
}