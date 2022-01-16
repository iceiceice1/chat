const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 用户信息的数据结构模型
const accountSchema = new Schema({
  account: {type: String},
  nickName: {type: String},
  psw: {type: String},
  regTime: {type: Number}
})

mongoose.Promise = global.Promise


mongoose.connect('mongodb://127.0.0.1:27017/netprogram')
var database=mongoose.connection

database.on('error', function(error){
  console.log('数据库test_nodeVue连接失败：' + error)
  return
})
database.once('open', function(){
  console.log('数据库test_nodeVue连接成功')
  // 初始化数据库
  initData();
})
var  Account= database.model('accountModel', accountSchema),

 initAccount = [
  {
    'account': 111111,
    'nickName': '开司',
    'psw': 111111,
    'regTime': 1504509461000
  },
  {
    'account': 222222,
    'nickName': '樱花',
    'psw': 111111,
    'regTime': 1504509462000
  },
  {
    'account': 333333,
    'nickName': '可利',
    'psw': 111111,
    'regTime': 1504509463000
  },
  {
    'account': 444444,
    'nickName': '克莱',
    'psw': 111111,
    'regTime': 1504509464000
  }
]

const initData = function () {
  // 初始化1
  Account.find({}, function(err, doc){
    if (err) {
      console.log('initAccount出错：' + err);
    } else if (!doc.length) {
      console.log(' account open first time');
      // 初始化数据，遍历插入；先打印出来看看
      initAccount.map(iterm => {
        Account.create(iterm)
      })
    } else {
      console.log('account open not first time');
    }
  })
 
}

module.exports = {Account}