const path = require('path')
const fs = require('fs')
const futil = require('../utils/fileUtil')

class Router {
    constructor() {
        this.url = null
    }

    static readfile(file) {
        /**
         * class 内部只有静态方法，暂无静态属性
         */
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'UTF-8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    async doRouter(url, ctx) {
        this.url = url;
        let page = '/404.html';
        switch (this.url) {
            case '/':
            case '/index':
                page = 'index.html';
                break;
            case '/file':
                page = 'file.html'
                break;
        }
        page = `./static/${page}`;
        page = path.join(__dirname, '../', page);

        if (url == '/file') {
            let list = []
            futil(path.join(__dirname, '../', '/static'), function(e, file, next) {
                if (!e) {
                    list.push(file)
                }
                return list
            });
        } else {
            let html = await Router.readfile(page);
            return html
        }
    }

    mimeType() {

    }
}

module.exports = Router