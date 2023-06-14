// index.js
Page({
  globalData:{token: null},
  data:{
    username:null,
    password:null,
    news_id:null,
    user_id:null,
    comment:null
  },
  change: function(e) {
    this[e.currentTarget.id] =(e.detail.value)
    this.setData(this)
  },

  onLaunch: function () {this.login(); },
  login: function () {
    wx.login({
      success: res => {
        console.log('login code: ' + res.code)
        wx.request({
          url: 'http://127.0.0.1:3000/user/login',
          method: 'post',
          data: {code: res.code},
          success: res => { 
            if(res.data.token==null)
            {
              console.log("wrong")
            }
            else{
              console.log('token: ' + res.data.token)
              console.log('user_id:'+ res.data.openid)
            // 将token保存为公共数据（用于在多页面中访问）
            this.globalData.token = res.data.token 
            // 将token保存到数据缓存（下次打开小程序无需重新获取token）
             wx.setStorage({
              key: 'token',
              data: res.data.token},{
                key:'user_id',
                data:res.data.openid
              }
              ) }
            },
        })
      }})
  },
  collection_insert:function(){
    wx.request({
      url: 'http://127.0.0.1:3000/collection/insert',
      method: 'post',
      data: {news_id: this.news_id,user_id:this.user_id},
      header: {
        'Authorization': this.globalData.token, 
      },
      success: res => { 
        var data = res.data; // 获取响应数据
      console.log(JSON.stringify(data));
       }
    })
  },

  comment_search:function () {
    wx.request({
      url: 'http://127.0.0.1:3000/comment/search',
      method: 'post',
      data: {news_id:this.news_id},
      header: {
        'Authorization': this.globalData.token, 
      },
      success: res => { 
        var data = res.data; // 获取响应数据
        console.log(data);
        console.log(data.data[0]);
        console.log(data.data[0].comment);
        console.log(data.data[1]);
        // 将token保存为公共数据（用于在多页面中访问
       }
    })
  },
  collection_search:function(){
    wx.request({
      url: 'http://127.0.0.1:3000/collection/search',
      method: 'post',
      data: {user_id: this.user_id},
      header: {
        'Authorization': this.globalData.token, 
      },
      success: res => { 
        var data = res.data; // 获取响应数据
      console.log(JSON.stringify(data));
       }
    })
  },
  comment_insert:function(){
    wx.request({
      url: 'http://127.0.0.1:3000/comment/insert',
      method: 'post',
      data: {news_id: this.news_id,user_id:this.user_id,comment: this.comment},
      header: {
        'Authorization': this.globalData.token, 
      },
      success: res => { 
        var data = res.data; // 获取响应数据
      console.log(JSON.stringify(data));
       }
    })
  }
})