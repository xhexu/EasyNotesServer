const fs = require('fs')
const path = require('path')
const fileUtil = require('../utils/fileUtil')
const tool = require('../utils/tool')
const config = require('../config')
const basePath = config.dbPath


module.exports = {
    /**
     * 查询标签笔记总数
     * @param {*} tagId 
     */
    totalTags: function(tagId){
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
     * 查询树数据
     * @param {*} tagId 
     */
    queryTree: function(tagId) {
        return new Promise((res, rej) => {
            fs.readFile(path.join(__dirname, basePath, '/tree.json'), 'utf8', function(err, data) {
                if (err){
                    rej(err)
                    return
                }
                if(data.length>0){
                    data = JSON.parse(data)
                    if(tagId){
                        let result = data.tree.filter((v)=>{
                            return v.tagId == tagId
                        })
                        res(result)
                    }else{
                        res(data.tree)
                    }
                }else{
                    res([])
                }
            });
        })
    },
    /**
     * 创建树，按照所有树节点(已作废)
     * @param {*} data 
     */
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
    /**
     * 创建树，按照新增的节点
     * @param {*} formData 
     */
    createTree: function(formData) {
        return new Promise((res, rej) => {
            fs.readFile(path.join(__dirname, basePath, '/tree.json'), 'utf8', function(err, data) {
                if (err){
                    rej(err)
                    return
                }
                let jsonObj = data.length>0?JSON.parse(data):{}
                const id = tool.uuid2()
                let obj = {
                    tagId: formData.tagId,//标签
                    name: formData.name,//名称
                    id: id,//id
                    url: ''//文件路径
                }
                if(formData.isFolder){
                    obj.children = []
                }
                if(jsonObj.hasOwnProperty('tree')){
                    const index = jsonObj.tree.findIndex((v)=>{
                        return v.tagId == formData.tagId
                    })
                    if(index>-1){
                        obj.url = formData.url+"/"+id
                        let firstNode = jsonObj.tree[index];
                        (function findnode(data){
                            let index = data.findIndex((v)=>{
                                return v.url == formData.url
                            })
                            if(index>-1){
                                if(data[index].hasOwnProperty('children')){
                                    data[index].children.push(obj)
                                }else{
                                    //文件转文件夹
                                    let _obj = JSON.parse(JSON.stringify(data[index]))
                                    _obj.id = tool.uuid2()
                                    data[index].children = []
                                    data[index].children.push(_obj)
                                    data[index].children.push(obj)
                                }
                            }else{
                                data.forEach((v)=>{
                                    if(v.hasOwnProperty('children')){
                                        findnode(v.children)
                                    }else{
                                        obj.url = "/notes/"+formData.tagId+"/"+id
                                        jsonObj.tree.push(obj)
                                    }
                                })
                            }
                        })([firstNode])
                    }else{
                        obj.url = "/notes/"+formData.tagId+"/"+id
                        jsonObj.tree.push(obj)
                    }
                }else{
                    jsonObj.tree = []
                    obj.url = "/notes/"+formData.tagId+"/"+id
                    jsonObj.tree.push(obj)
                }
                
                let jsonStr = JSON.stringify(jsonObj, null, 4)
                fs.writeFile(path.join(__dirname, basePath, '/tree.json'), jsonStr, 'utf8', (err) => {
                    if (err){
                        rej(err)
                        return
                    }
                    res(obj)
                })
            });
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
     * 生成笔记物理文件
     * @param {*} data 
     */
    saveNotes: function(data) {
        /**
         * 1.url生成文件夹目录
         * 2.url生成.json文件
         */
        return new Promise((res, rej) => {
            fileUtil.makeDir(data.url).then(()=>{
                let strJson = JSON.stringify(data, null, 4)
                fs.writeFile(path.join(__dirname,config.dbPath,data.url+config.dbExt), strJson, 'utf8', (err) => {
                    if (err){
                        rej(err)
                    }else{
                        res("ok")
                    }
                })
                fs.writeFile(path.join(__dirname,config.dbPath,data.url+'.md'), data.markdownValue, 'utf8', (err) => {
                })
            },(err)=>{
                rej(err)
            })
        })
    },
    /**
     * 查询笔记内容(读取json文件)
     * @param {*} data 
     */
    queryNotes(data) {
        return new Promise((res, rej) => {
            if (data.url) {
                let notePath = path.join(__dirname,config.dbPath,data.url+config.dbExt)
                fs.exists(notePath, function(exists) {
                    if (exists) {
                        fs.readFile(notePath, 'utf8', function(err, data) {
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
    /**
     * 获取标签列表
     */
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
                if(allKeys.indexOf(tagId)>-1){ 
                    res(notes[tagId])
                }else{
                    rej('not find notes of this tagId')
                }
            })
        })
    },
    queryNotesAll(){
        return new Promise((res,rej)=>{
            fs.readFile(path.join(__dirname, basePath, '/notes.json'), (err, data) => {
                if (err) {
                    rej(err)
                    return
                }
                const notes = JSON.parse(data)
                const allKeys = Object.keys(notes)
                let all = []
                allKeys.forEach(key=>{
                    all = all.concat(notes[key])
                })
                res(all)
            })
        })
    },
    /**
     * 查询echart图表数据
     * @param {*} type 
     */
    queryChart: function(type) {
        return new Promise((res, rej) => {
            
            this.queryTags().then(tags=>{
                this.totalTags().then(result=>{
                    if(type=='bar'){
                        let obj = {xAxis:[],data:[]}
                        if(result&&result.length>0){
                            result.forEach(v=>{
                                const index = tags.tags.findIndex(t=>{
                                    return t.tagId==v.tagId
                                })
                                if(index>-1){
                                    obj.xAxis.push(tags.tags[index].tagName)
                                    obj.data.push(v.total)
                                }
                            })
                        }
                        res(obj)
                    }else{
                        res({})
                    }
                })
            })
        })
    },

    queryFiles(path){
        return fileUtil.recursive(path)
    },

    readFiles(path){
        return new Promise((res,rej)=>{
            const rs = fs.createReadStream(path)
            rs.on('data',function(chunk) {
                res(chunk.toString()) 
                // 65536  chunk就是一个Buffer(存放16进制数据的"数组",长度以B字节计算(两个16进制为一个元素))
                // Node中的Buffer不占用垃圾回收机制中的内存。  Buffer是由C/C++模块维护。  
                //'data'+chunk会在内部自动调用toString()函数。 建议直接返回buffer节省处理字符串
                //的性能开销。
            });
            rs.on('end',function() {
            });
        })
    }
}