module.exports = {
  dbPath:'../database',
  dbExt:'.json',
  callBackObj(success,message,data){
    return{
      success: success||true,
      message: message||'message not defined',
      data: data||[],
      time: new Date().getTime()
    }
  }
}