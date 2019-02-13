const router = require('koa-router')()
const send = require('koa-send')
const path = require('path')

const test = require('../services/db_notes')

/**
 * 用作文件下载路由
 */
const routers = 
    router.get('/', async(ctx)=>{
        let _name = ctx.query.name
        let ary = _name.split('.')
        ary.length>=2?'':_name = _name+'.md'
        const _path = path.join('/KoaServer/server/database/',_name)
        ctx.attachment(_path)
        await send(ctx, _path)
    }).post('/',async(ctx)=>{
        let formData = ctx.request.body
        let ary = formData.url.split('.')
        ary.length>=2?'':formData.url = formData.url+'.md'
        const _path = path.join('/KoaServer/server/database/',formData.url)
        ctx.attachment(_path)
        await send(ctx,_path)
    }).post('/test',async(ctx)=>{
        test.queryNotesByTagId()
    })
module.exports = routers