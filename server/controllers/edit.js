const db = require('../services/db.js')
const config = require('../config')

module.exports = {
    /**
     * 生成tree结构/生成物理文件
     * @param {*} ctx 
     */
    async saveTree(ctx) {
        let formData = ctx.request.body
        const message = await db.saveTree(formData)
        ctx.body = config.callBackObj(true,message)
    },
    /**
     * 查询文件树
     * @param {*} ctx 
     */
    async queryTree(ctx) {
        const treeObj = await db.queryTree()
        ctx.body = config.callBackObj(true,'success',treeObj.tree)
    },
    /**
     * 保存笔记内容
     * @param {*} ctx 
     */
    async saveNotes(ctx) {
        let formData = ctx.request.body
        try {
            let message = await db.saveNotes(formData)
            await db.writeNotesTable(formData.name,formData.url,formData.tagId,formData.id)
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
    }
}