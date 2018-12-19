const fs = require('fs')
const path = require('path')
const fileUtil = require('../utils/fileUtil')
const config = require('../config')
const basePath = config.dbPath
module.exports = {
    queryTree: function() {
        return new Promise((res, rej) => {
            fs.readFile(path.join(__dirname, basePath, '/tree.json'), 'utf8', function(err, data) {
                if (err){
                    rej(err)
                    return
                }
                data = data.length>0?JSON.parse(data):{tree:[]}
                res(data)
            });
        })
    },
    saveTree: function(data) {
        return new Promise((res, rej) => {
            fileUtil.fileExists(path.join(__dirname, basePath, '/tree.json')).then(()=>{
                let jsonStr = JSON.stringify(data, null, 4);
                fs.writeFile(path.join(__dirname, basePath, '/tree.json'), jsonStr, 'utf8', (err) => {
                    if (err) rej(err);
                    res("ok")
                });
            },(err)=>{
                rej(err)
            })
        })
    },
    writeNotesTable(name,url,tagId,id){
        return new Promise((res,rej)=>{
            fs.readFile(path.join(__dirname, basePath, '/notes.json'), (err, data) => {
                if (err) {
                    rej(err)
                    return
                }
                try {
                    const notes = data.length>0?JSON.parse(data):{}
                    const allKeys = Object.keys(notes)


                    if(allKeys.indexOf(tagId)>-1){ 
                        if(id){
                            let index = notes[tagId].findIndex(v=>{
                                return v.id == id
                            })
                            if(index>-1){
                                notes[tagId][index].name = name
                                notes[tagId][index].url = url
                                notes[tagId][index].createtime = new Date().getTime()
                                notes[tagId][index].updatetime = new Date().getTime()
                            }
                        }else{
                            notes[tagId].push({
                                id:'notes'+new Date().getTime(),
                                name:name,
                                url:url,
                                createtime: new Date().getTime(),
                                updatetime: new Date().getTime()
                            })
                        }
                        let jsonStr = JSON.stringify(notes, null, 4)
                        fs.writeFile(path.join(__dirname, basePath, '/notes.json'), jsonStr, 'utf8', (err) => {
                            if (err){
                                rej(err)
                                return
                            }
                            res('write to notes file successful')
                        })
                    }else{
                        notes[tagId] = []
                        notes[tagId].push({
                            id:id||'notes'+new Date().getTime(),
                            name:name,
                            url:url,
                            createtime: new Date().getTime(),
                            updatetime: new Date().getTime()
                        })
                        let jsonStr = JSON.stringify(notes, null, 4)
                        fs.writeFile(path.join(__dirname, basePath, '/notes.json'), jsonStr, 'utf8', (err) => {
                            if (err){
                                rej(err)
                                return
                            }
                            res('write to notes file successful')
                        })
                    }
                } catch (error) {
                    throw Error(error)
                }
                
            })
        })
    },
    saveNotes: function(data) {
        /**
         * 1.url生成文件夹目录
         * 2.url生成.json文件
         */
        return new Promise((res, rej) => {
            fileUtil.makeDir(data.url).then(()=>{
                let strJson = JSON.stringify(data, null, 4)
                fs.writeFile(path.join(__dirname,config.dbPath,data.url+config.dbExt), strJson, 'utf8', (err) => {
                    if (err) rej(err);
                    res("ok")
                })
            },(err)=>{
                rej(err)
            })
        })
    },
    queryNotes(data) {
        return new Promise((res, rej) => {
            if (data.url) {
                let notePath = path.join(__dirname,config.dbPath,data.url+config.dbExt)
                fs.exists(notePath, function(exists) {
                    if (exists) {
                        fs.readFile(path.join(__dirname, notePath), 'utf8', function(err, data) {
                            if (err) {
                                rej(err)
                            }else{
                                res(JSON.parse(data))
                            }
                        });
                    } else {
                        rej('文件不存在')
                    }
                });
            } else {
               throw Error('url not defined')
            }
        })
    },
    queryTags() {
        return new Promise((res, rej) => {
            fs.exists(path.join(__dirname, basePath, '/tag.json'), exists => {
                if (exists) {
                    fs.readFile(path.join(__dirname, basePath, '/tag.json'), (err, data) => {
                        if (err) rej(err)
                        const tags = JSON.parse(data)
                        res(tags)
                        
                    })
                } else {
                    rej('url not defined')
                }
            })
        })
    },
    queryNotesByTagId(tagId){
        return new Promise((res,rej)=>{
            fs.readFile(path.join(__dirname, basePath, '/notes.json'), (err, data) => {
                if (err) {
                    rej(err)
                    return
                }
                const notes = JSON.parse(data)
                const allKeys = Object.keys(notes)
                if(allKeys.indexOf(tagId)>-1){ 
                    res(notes[tagId])
                }else{
                    rej('not find notes of this tagId')
                }
            })
        })
    }
}