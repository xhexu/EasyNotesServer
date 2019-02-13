const db = require('../services/db.js')
const config = require('../config')
const path = require('path')

module.exports = {
    /**
     * 生成tree，方法1
     * @param {*} ctx 
     */
    async saveTree(ctx) {
        let formData = ctx.request.body
        const message = await db.saveTree(formData)
        ctx.body = config.callBackObj(true,message)
    },
    /**
     * 生成tree，方法2
     * @param {*} ctx 
     */
    async createTree(ctx) {
        let formData = ctx.request.body
        const data = await db.createTree(formData)
        if(!formData.isFolder){//写入笔记数据
            await db.writeNotesTable(data)
        } 
        ctx.body = config.callBackObj(true,'success',data)
    },
    async queryTotal(ctx){
        let formData = ctx.request.body
        let tagId = formData.tagId
        const number = await db.totalTags(tagId)
        ctx.body = config.callBackObj(true,'success',number)
    },
    /**
     * 查询文件树
     * @param {*} ctx 
     */
    async queryTree(ctx) {
        let formData = ctx.request.body
        let tagId = formData.tagId
        const treeObj = await db.queryTree(tagId)
        const total = await db.totalTags(tagId)
        ctx.body = config.callBackObj(true,'success',{tree:treeObj,total:total})
    },
    /**
     * 保存笔记内容
     * @param {*} ctx 
     */
    async saveNotes(ctx) {
        let formData = ctx.request.body
        try {
            let message = await db.saveNotes(formData)
            ctx.body = config.callBackObj(true,message)
        } catch (error) {
            ctx.body = config.callBackObj(false,error)
        }
    },
    /**
     * 查询笔记内容
     * @param {*} ctx 
     */
    async queryNotes(ctx) {
        let formData = ctx.request.body
        try {
            let data = await db.queryNotes(formData)
            ctx.body = config.callBackObj(true,'success',data)
        } catch (error) {
            ctx.body = config.callBackObj(false,error)
        }
    },

    /**
     * 查询标签
     * @param {*} ctx 
     */
    async queryTags(ctx) {
        const data = await db.queryTags()
        ctx.body = config.callBackObj(true,'success',data)
    },

    /**
     * 按标签分类查询笔记
     * @param {*} ctx 
     */
    async queryNotesByTagId(ctx) {
        let formData = ctx.request.body
        let tagId = formData.tagId
        try {
            const data = await db.queryNotesByTagId(tagId)
            ctx.body = config.callBackObj(true,'success',data)
        } catch (error) {
            ctx.body = config.callBackObj(false,error)
        }
    },

    /**
     *查询所有笔记
     * @param {*} ctx 
     */
    async queryNotesAll(ctx) {
        try {
            const data = await db.queryNotesAll()
            ctx.body = config.callBackObj(true,'success',data)
        } catch (error) {
            ctx.body = config.callBackObj(false,error)
        }
    },

     /**
     *查询所有文件
     * @param {*} ctx 
     */
    async queryFiles(ctx) {
        try {
            const _path = path.join(__dirname,'../../server/')
            const data = await db.queryFiles(_path)
            ctx.body = config.callBackObj(true,'success',data)
        } catch (error) {
            ctx.body = config.callBackObj(false,error)
        }
    },
    async readFiles(ctx) {
        let formData = ctx.request.body
        try {
            const _path = formData.url
            const data = await db.readFiles(_path)
            ctx.body = config.callBackObj(true,'success',data)
        } catch (error) {
            ctx.body = config.callBackObj(false,error)
        }
    }
}