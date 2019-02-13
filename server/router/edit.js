const router = require('koa-router')()
const edit = require('../controllers/edit')
const routers = router
    .post('/saveTree.next', edit.saveTree)
    .post('/createTree.next', edit.createTree)
    .post('/queryTree.next', edit.queryTree)
    .post('/saveNotes.next', edit.saveNotes)
    .post('/queryNotes.next', edit.queryNotes)
    .post('/queryTags.next', edit.queryTags)
    .post('/queryNotesByTagId.next', edit.queryNotesByTagId)
    .post('/queryNotesAll.next', edit.queryNotesAll)

    
    .post('/queryFiles.next', edit.queryFiles)
    .post('/readFiles.next', edit.readFiles)

module.exports = routers