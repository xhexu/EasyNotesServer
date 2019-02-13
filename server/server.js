const Koa = require('koa')
const app = new Koa()
const static = require('koa-static')
const path = require('path')
    // const bodyParser = require('koa-bodyparser')
    // var body = require('koa-better-body')
const koaBody = require('koa-body')
const cors = require('koa-cors')

const staticPath = '../static/'
const routers = require('./router/index')

//logger
app.use(async (ctx,next)=>{
    await next()
    console.log(`${ctx.method} ${ctx.url}`)
})
  
app.use(cors())
app.use(koaBody())
app.use(static(path.join(__dirname, staticPath)))
app.use(routers.routes()).use(routers.allowedMethods())

app.on("error",(err,ctx)=>{
    console.log(new Date(),":",err);
 });

process.on("uncaughtException", function(err){
    console.log("uncaughtException:",err.message)
})
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
})

app.listen(3000, () => {
    console.log('easy note server: start success')
})