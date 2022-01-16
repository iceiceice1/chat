const session = require('express-session')
const {Account} = require('./db')

module.exports = function (app) {
  app.all("*", function(req, res, next) {
    next()
  })
  app.get('/api/hello',function(req,res){
    res.send('hello')
  })
  // api login
  app.get('/api/user/login', function (req, res) {
    // 对发来的登录数据进行验证
    console.log(req.query.account)
    if (!req.query.account) {
      res.json({code: 600, msg:'account 不能为空！'})
      return
    }
    if (!req.query.psw) {
      res.json({code: 600, msg:'psw 不能为空！'})
      return
    }
    Account.findOne({account: req.query.account}, function(err, doc){
      if (err) {
        console.log('查询出错：' + err);
        res.json({code: 700, msg:'查询出错：' + err})
        return
      } else {
        if (!doc) {
          res.json({code: 700, msg:'不存在该用户名：' + req.query.account})
          return
        } else {
          console.log(req.query.psw)
          if (req.query.psw != doc.psw) {
            res.json({code: 700, msg:'密码不正确！'})
            return
          } else {
            
            req.session.account=req.query.account
            console.log(req.session.account)
            res.json({code: 200, msg:'密码正确，登录成功', account: doc.nickName})
            return
          }
        }

      }
    })
  })
  app.get('/api/session',function(req,res){
    let nickName
    if(req.session.account){
      console.log(req.session.account)
      Account.findOne({account:req.session.account},function(err,doc){
        if(doc){
             console.log(doc)
             nickName=doc.nickName
             res.json({code:200,account:req.session.account,nickName:doc.nickName})
        }
      })
      console.log(nickName)   
    }else{
      res.json({code:700,msg:'session do not exit'})
    }
  })
  
  // api register
  app.get('/api/user/register', function (req, res) {
    // 对发来的注册数据进行验证
    let account = req.query.account
    let nickName = req.query.nickName
    let psw = req.query.psw
    let regTime = req.query.regTime
    console.log(account)
    console.log(account)
    if (!account) {
      res.json({code: 600, msg:'account 不能为空！'})
      return
    }
    if (!nickName) {
      res.json({code: 600, msg:'nickName 不能为空！'})
      return
    }
    if (!psw) {
      res.json({code: 600, msg:'psw 不能为空！'})
      return
    }
    // 查询数据库验证注册账号、密码
    // 是否存在账号
    Account.findOne({account: req.query.account}, function(err, doc){
      if (err) {
        console.log('查询出错：' + err);
        res.json({code: 700, msg:'查询出错：' + err})
        return
      } else {
        if (doc) {
          res.json({code: 700, msg:'该用户名已经被注册：' + account})
          return
        } else {
          Account.create({
            account: account,
            nickName: nickName,
            psw: psw,
            regTime: regTime,
          }, function (err, doc) {
            if (err) {
              res.end('注册失败:' + err)
            } else {
              res.json({code: 200, msg:'用户注册成功：' + account})
              return
            }
          })
        }

      }
    })
  })
  app.get("/api/change",function(request,res){
    let changedata=request.query.account;
    let data=request.query.change;
    console.log(changedata)
    console.log(data)
    Account.findOne({account:changedata},function(err,doc){

      if(err){
          console.log('查询出错：' + err);
          res.json({code: 700, msg:'查询出错：' + err})
          return
        }else{
                
                console.log(doc)
                doc.nickName=data
                doc.save();
                res.json({nickName:doc.nickName})
                return
        }
    })
  });
  app.get('*', function(req, res){
    res.end('404')
  })
}