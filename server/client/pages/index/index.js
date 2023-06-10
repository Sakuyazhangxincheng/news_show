// index.js
Page({
  globalData:{token: null},
  data:{
    username:null,
    password:null
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
          data: {code: res.code,username:this.username,password:this.password},
          success: res => { 
            if(res.data.token==null)
            {
              console.log("wrong")
            }
            else{
              console.log('token: ' + res.data.token)
            // 将token保存为公共数据（用于在多页面中访问）
            this.globalData.token = res.data.token 
            // 将token保存到数据缓存（下次打开小程序无需重新获取token）
             wx.setStorage({
              key: 'token',
              data: res.data.token}) }
            },
        })
      }})
  },

  search:function () {
    wx.request({
      url: 'http://127.0.0.1:3000/search',
      method: 'post',
      //data: {code: res.code},
      success: res => { 
        var data = res.data; // 获取响应数据
      console.log(JSON.stringify(data));

      if (Array.isArray(data.result)) {
        data.result.forEach(user => {
          console.log("User ID:", user.user_id);
          console.log("Username:", user.username);
          console.log("Password:", user.password);
          console.log("Image URL:", user.img_url);
          console.log("--------------------");
        });
}
        // 将token保存为公共数据（用于在多页面中访问
       }
    })
  },
  collect_search:function(){
    wx.request({
      url: 'http://127.0.0.1:3000/collection/search',
      method: 'post',
      data: {username: this.username},
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
