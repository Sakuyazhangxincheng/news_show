const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
// 1 引入
const mysql = require('mysql');
app.use(bodyParser.json())
const wx = {
  appid: 'wx4a5117622c3285ec',	// 需要填写开发者的AppID
  secret: '73f2fe7a0c07c75c402844d2f8e27b3f'	// 需要填写开发者的AppSecret
}
// 监听3000端口
app.listen(3000, () => {
  console.log('server running at http://127.0.0.1:3000')
})

var db = {	// 模拟数据库
  session: {},	// 保存openid和session_key的会话信息
  user: {}		// 保存用户记录，如用户名、积分等数据
}

app.post('/login', (req, res) => {

  //数据库登录
  // 2 创建链接配置
  const conn = mysql.createConnection({
    host:'localhost',   // 主机名 （服务器地址）
    user:'root',    //用户名
    password:'1234',    // 密码
    database:'news',  // 写上自己要连接的数据库名字
  })
  // 3 建立链接
  conn.connect()
  // 4 生成sql语句 增删改查操作
  let sql = 'select * from user where username=\''+req.body.username+'\' and password='+req.body.password
  //5  执行sql语句
  conn.query(sql, (err, result) => {
    if(err){
        console.log(err);
        return
    }
    if(result.length==0)
    {
      console.log("wrong")
      res.json({token: null})
      return false
    }
    // 6 处理结果
    console.log(result)
    

    // 获取token
    console.log("wrong")
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' +
    wx.appid + '&secret=' + wx.secret + '&js_code=' + req.body.code +'&grant_type=authorization_code' 
    request(url, (err, response, body) => {
      var session = JSON.parse(body); 
      if(session.openid){
      var token = "token_" + new Date().getTime();
          db.session[token] = session;
          if(!db.user[session.openId]){ db.user[session.openId] = {credit: 100};}
      }
      res.json({token: token})
    })
      
  })


})
  




app.post('/search', (req, res) => {

    // 2 创建链接配置
  const conn = mysql.createConnection({
    host:'localhost',   // 主机名 （服务器地址）
    user:'root',    //用户名
    password:'1234',    // 密码
    database:'news',  // 写上自己要连接的数据库名字
  })
  // 3 建立链接
  conn.connect()
  // 4 生成sql语句 增删改查操作
  let sql = 'select * from user'
  //5  执行sql语句
  conn.query(sql, (err, result) => {
    if(err){
        console.log(err);
        return
    }
    // 6 处理结果
    console.log(result)
    res.json({result:result})
  })
})
