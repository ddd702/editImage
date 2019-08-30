const resolve=dir=>require('path').join(__dirname,dir)
module.exports = {
  lintOnSave: false,
  chainWebpack:(config)=>{
    config.resolve.alias.set('@',resolve('src'))
    config.entry('app').add('babel-polyfill').end()
  }
}
