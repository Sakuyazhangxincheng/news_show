const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
// 1 引入
const db = require('./db');
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
const tokenPlace = {
  session: {},
  user: {}
};


app.post('/user/login', (req, res) => {
  let sql = `select * from user where username='${req.body.username}' and password='${req.body.password}'`;

  // 调用封装的数据库查询函数
  db.queryDatabase(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ status:401, message:"查询数据库error",token: null });
    } else {
      if (result.length === 0) {
        res.json({ status:400, message:"该用户不存在或者密码错误",token: null });
        return false;
      }

      // 其他操作...

      // 获取token
      var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' +
      wx.appid + '&secret=' + wx.secret + '&js_code=' + req.body.code +'&grant_type=authorization_code' 
      request(url, (err, response, body) => {
        var session = JSON.parse(body); 
        if(session.openid){
        var token = "token_" + new Date().getTime();
            tokenPlace.session[token] = session;
            if(!tokenPlace.user[session.openId]){ tokenPlace.user[session.openId] = {credit: 100};}
        }
        console.log("登录成功");
        res.json({status:200, message:"登录成功",token: token})
      })
    }
  });
});


app.post('/collection/search', verifyToken, (req, res) => {
  // 验证 Token 成功，继续处理请求
  let sqlUser = `select user_id from user where username='${req.body.username}' `;

  db.queryDatabase(sqlUser, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status:402, message:"查询数据库error",result: null });
    } else {
      if (result.length === 0) {
        return res.json({ status:403, message:"具有该用户名的用户Id不存在",result: null });
      }
      let userId = result[0].user_id.toString();
      console.log("userId:" + userId);

      let sql = `select news_id from collection where user_id='${userId}' `;
      // 执行搜索操作等...
      db.queryDatabase(sql, (err, result) => {
        if (err) {
          console.log(err);
          res.json({ status:401, message:"查询数据库error",result: null });
        } else {
          if (result.length === 0) {
            res.json({ status:400, message:"该用户没有收藏内容",result: null });
          }
          return res.json({status:200, message:"查询成功",result:result})
        }
      });
    }
  });
});

app.post('/comment/insert',verifyToken,(req,res) =>{
  // 验证 Token 成功，继续处理请求
  let sqlnum= 'SELECT COUNT(*) AS num FROM comment'

  db.queryDatabase(sqlnum, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ code:402, message:"查询数据库error" });
    } else {
      let count = result[0].num;
      count++;
      let sql = `INSERT INTO comment (comment_id,user_id,news_id,comment) VALUES (${count},${req.body.user_id},${req.body.news_id},${req.body.comment})  `;

      // 执行搜索操作等...
      db.queryDatabase(sql, (err, result) => {
        if (err) {
          console.log(err);
          res.json({ code:401, message:"查询数据库error"});
        } else {
          return res.json({code:200, message:"查询成功"})
        }
      });
    }
  });
  
})




app.post('/comment/search',verifyToken,(req,res) =>{
  // 验证 Token 成功，继续处理请求
  let sqlnum= `SELECT user_id,comment FROM comment where news_id='${req.body.news_id}' `;

  db.queryDatabase(sqlnum, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ code:402, message:"查询数据库error" });
    } else {
      if (result.length === 0) {
        return res.json({ code:403, message:"该收藏没有评论",data: null });
      }
      console.log(result);
      return res.json({code:200,message:"查询成功",data:result})
    }
  });
  
})






// 定义中间件函数
function verifyToken(req, res, next) {
  // 从请求头中获取 token
  const token = req.headers.authorization;
  // 验证 token 的有效性
  if (token && tokenPlace.session[token]) {
    // 验证成功，继续处理请求
    next();
  } else {
    // 验证失败，返回身份验证失败的响应
    res.status(401).json({ error: 'Unauthorized' });
  }
}






// 将中间件应用于需要验证 token 的接口
app.get('/protected', verifyToken, (req, res) => {
  // 处理需要验证 token 的接口请求
  res.json({ message: 'Token verified successfully' });
});



