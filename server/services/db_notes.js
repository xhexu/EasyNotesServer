const fs = require('fs')
const path = require('path')
const config = require('../config')
const basePath = config.dbPath


module.exports = {
    /**
     * 查询标签笔记总数
     * @param {*} tagId 
     */
    queryNotesTotalByTags: function(tagId){
        return new Promise((res,rej)=>{
            fs.readFile(path.join(__dirname, basePath, '/notes.json'), (err, data) => {
                if(err){
                    rej(err)
                    return
                }
                const notes = data.length>0?JSON.parse(data):{}
                let array = []
                if(tagId){
                    array = notes[tagId]||[]
                    res(array.length)
                }else{
                    const keys = Object.keys(notes)
                    keys.forEach((key)=>{
                        array.push({
                            tagId:key,
                            total:notes[key].length
                        })
                    })
                    res(array)
                }
            })
        })
    },
    
    /**
     * 按标签,记录笔记表
     * @param {*} formData 
     */
    writeNotesTable(formData){
        const tagId = formData.tagId
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
                        let index = notes[tagId].findIndex(v=>{
                            return v.id == formData.id
                        })
                        if(index>-1){
                            notes[tagId][index].name = formData.name
                            notes[tagId][index].url = formData.url
                            notes[tagId][index].tagid = tagId
                            notes[tagId][index].createtime = new Date().getTime()
                            notes[tagId][index].updatetime = new Date().getTime()
                        }else{
                            notes[tagId].push({
                                id:formData.id,
                                name:formData.name,
                                url:formData.url,
                                tagid: tagId,
                                createtime: new Date().getTime(),
                                updatetime: new Date().getTime()
                            })
                        }
                    }else{
                        notes[tagId] = []
                        notes[tagId].push({
                            id:formData.id,
                            name:formData.name,
                            url:formData.url,
                            tagid: tagId,
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
                } catch (error) {
                    throw Error(error)
                }
            })
        })
    },

    /**
     * 查询笔记列表
     * @param {*} tagId 
     */
    queryNotesByTagId(tagId){
        return new Promise((res,rej)=>{
            fs.readFile(path.join(__dirname, basePath, '/notes.json'), (err, data) => {
                if (err) {
                    rej(err)
                    return
                }
                const notes = JSON.parse(data)
                const allKeys = Object.keys(notes)
                if(tagId){
                    if(allKeys.indexOf(tagId)>-1){ 
                        res(notes[tagId])
                    }else{
                        rej('not find notes of this tagId')
                    }
                }else{
                    let all = []
                    allKeys.forEach(key=>{
                        all = all.concat(notes[key])
                    });
                    
                    //划重点了...注意此处写法
                    (async()=>{
                        for(let v of all){
                            const state = await this.queryNotesFileInfo(v.url).catch((err)=>{
                                console.log(err)
                            })
                            v.size = state.size
                            console.log(state)
                        }
                        res(all)
                    })()
                    
                }
            })
        })
    },

    queryNotesFileInfo: function(url){
        return new Promise((res,rej)=>{
            let _path = path.join(__dirname, basePath, url+config.dbExt)
            fs.stat(_path,(err,states)=>{
                if(err){
                    rej(err)
                }else(
                    res(states)
                )
            })
        })
        
    }
}