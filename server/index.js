const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
// 1 引入
const db = require('./db');
app.use(bodyParser.json())
const wx = {
  appid: 'wxa36fe6f02f186b5d',	// 需要填写开发者的AppID
  secret: '489b88fc41801d6b39e954981c47dc08'	// 需要填写开发者的AppSecret
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
  var username = null;
  var name=null;
  // 获取token
  var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' +
      wx.appid + '&secret=' + wx.secret + '&js_code=' + req.body.code +'&grant_type=authorization_code' 
      request(url, (err, response, body) => {
        var session = JSON.parse(body); 
        console.log(session);

        let sqluser = `select user_id from user where user_id='${session.openid}' `;
        
        console.log(sqluser);
        // 执行搜索是否存在...
        db.queryDatabase(sqluser, (err, result) => {
          if (err) {
            console.log(err);
            return res.json({ code:401, message:"查询数据库error"});
          } else {
            console.log("666666"+result)
            if(result.length!==0){
              console.log('已经插入用户id了')
              //已经有了，无须插入
              let sqll = `select username from user where user_id='${session.openid}'`;
              db.queryDatabase(sqll, (err, result) => {
                if (err) {
                  console.log(err);
                  return res.json({ status:401, message:"查询数据库error",token: null });
                } else {
                  // 获取到用户名
                  username = JSON.parse(JSON.stringify(result));
                  name = username[0].username;
                  
                }
              });
            }else{
              //第一次存储，插入用户数据
              let sql = `INSERT INTO user (user_id,username,password,img_url,phone) VALUES ('${session.openid}',null,null,null,null)`
              // 调用封装的数据库查询函数
              db.queryDatabase(sql, (err, result) => {
                if (err) {
                  console.log(err);
                  return res.json({ status:401, message:"查询数据库error",token: null });
                } else {
                  // 其他操作... 
                  console.log('成功插入用户id了')
                }
              });
            }

            if(session.openid){
              var token = "token_" + new Date().getTime();
                  tokenPlace.session[token] = session;
                  if(!tokenPlace.user[session.openId]){ tokenPlace.user[session.openId] = {credit: 100};}
              }
              console.log("登录成功");
              console.log('open_id: '+session.openid);
              console.log(token);
              console.log('name: '+name);
              if(name != null && name != '') {
                return res.json({status:200, message:"登录成功",openid:session.openid,token: token, username: name})
              } else {
                return res.json({status:200, message:"登录成功",openid:session.openid,token: token})
              }
              
          }
        });
      })
});

app.post('/collection/search', verifyToken, (req, res) => {
 
  let sql = `select news_id from collection where user_id='${req.body.user_id}' `;
      // 执行搜索操作等...
      console.log('query collection sql: '+sql);
      db.queryDatabase(sql, (err, result) => {
        if (err) {
          console.log(err);
          return res.json({ status:401, message:"查询数据库error",result: null });
        } else {
          if (result.length === 0) {
            return res.json({ status:400, message:"该用户没有收藏内容",result: null });
          }
          var result1 = JSON.parse(JSON.stringify(result));
          console.log(result1);
          return res.json({status:200, message:"查询成功",result:result1})
        }
      });
});

app.post('/user/setName', verifyToken, (req, res) => {
  let sql = `update user set username='${req.body.username}'`;
  // 执行插入操作
  db.queryDatabase(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status:401, message:"查询数据库error",token: null });
    } else {
      // 其他操作... 
      console.log('成功插入用户姓名了')
    }
  });
  return res.json({status:200, message:"修改姓名成功"})
})


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
      let sql = `INSERT INTO comment (comment_id,user_id,news_id,comment) VALUES (${count},'${req.body.user_id}',${req.body.news_id},'${req.body.comment}')  `;

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
