const router = require('koa-router')()
const edit = require('../controllers/edit')
const routers = router
    .post('/saveTree.next', edit.saveTree)
    .post('/queryTree.next', edit.queryTree)
    .post('/saveNotes.next', edit.saveNotes)
    .post('/queryNotes.next', edit.queryNotes)
    .post('/queryTags.next', edit.queryTags)
    .post('/queryNotesByTagId.next', edit.queryNotesByTagId)

module.exports = routers