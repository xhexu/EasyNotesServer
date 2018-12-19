const fs = require('fs');
const path = require('path');
const config = require('../config')

module.exports = {
    fileExists(url){
        return new Promise((res,rej)=>{
            fs.open(url,'r',(err,fd)=>{
                if(err){
                    if(err.code ==='ENOENT'){
                        rej(err)
                    }
                }else{
                    res()
                }
            })
        })
    },

    readFile(){

    },

    writeFile(){
        
    },

    makeDir(url){
        return new Promise((res,rej)=>{
            if(!url){
                rej('url not defined')
            }
            fs.exists(path.join(__dirname,config.dbPath,url+config.dbExt),(exists)=>{
                if(!exists){
                    url = url.startsWith('/')?url.substr(1):''
                    let dirArray = url.replace(/\\/g, "/").split('/')
                    dirArray.splice(dirArray.length - 1, 1)
                    mkdir(0, dirArray, () => {
                        res()
                    })
                }else{
                    res()
                }
            })
        })
    },

    travelSync(dir,callback,finish){
        travelSync(dir,callback,finish)
    }
}

function mkdir(pos, dirArray, _callback) {
    let basePath = config.dbPath
    let len = dirArray.length
    if (pos >= len) {
        _callback();
        return;
    }
    for (let i = 0; i <= pos; i++) {
        basePath += '/' + dirArray[i];
    }
    
    fs.exists(path.join(__dirname, basePath), function(exists) {
        if (!exists) {
            fs.mkdir(path.join(__dirname, basePath), function(err) {
                if (err) {} else {
                    mkdir(pos + 1, dirArray, _callback);
                }
            });
        } else {
            mkdir(pos + 1, dirArray, _callback);
        }
    });
}




function travelSync(dir, callback, finish) {
    fs.readdir(dir, function(e, files) {
        if (e === null) {
            // i 用于定位当前遍历位置
            (function next(i) {
                // 当i >= files 表示已经遍历完成，进行遍历下一个文件夹
                if (i < files.length) {
                    var pathname = path.join(dir, files[i]);
                    if (fs.stat(pathname, function(e, stats) {
                            if (stats.isDirectory()) {
                                travelSync(pathname, callback, function() {
                                    next(i + 1);
                                });
                            } else {
                                callback(e, pathname, function() {
                                    next(i + 1);
                                });
                            }
                        }));
                } else {
                    /**
                     * 当 i >= files.length 时，即表示当前目录已经遍历完了， 需遍历下一个文件夹
                     * 这里执行的时递归调用 传入的 方法 ， 方法里调用了 next(i) 记录了当前遍历位置
                     */
                    finish && finish();
                }

            })(0);
        } else {
            callback(e);
        }
    });
}

// travelSync('d:/ZeroProject/KoaServer/server', (e, file, next) => {
//     console.log(file)
//     next()
// })

// module.exports = travelSync