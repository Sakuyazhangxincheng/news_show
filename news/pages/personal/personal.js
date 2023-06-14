const app = getApp();

Page({
  data: {
    nickName: wx.getStorageSync('nickName'),
    noName: true,
    api: 'a996bb33b1b9b67f425afb5e1278c826',
    showing: true,
    remind: '加载中',
    angle: 0,
    loginSuc: false,
    collections: [],  
    collectIds: [],
    alreadyCollect: false,  // 用户是否有收藏新闻
    loginInfo: {
      title: '微信授权',
      content: '获得您的公开信息(昵称、头像等)',
      logName: '北交新闻',
      logImage: '/pages/images/wx_login.png'
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false// 如需尝试获取用户信息可改为false
  },

  getInputName: function(e) {
    console.log(e);
    let name = e.detail.value;
    let local = e.detail.cursor;
    this.setData({
      nickName: name
    })
  },

  submitName() {
    // 把名字传输给后端，本地存缓存
    wx.setStorageSync('nickName', this.data.nickName);
    console.log(this.data.nickName);
    wx.request({
      url: 'http://localhost:3000/user/setName',
      method: 'POST',
      data: {
        username: this.data.nickName
      },
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      success: (res) => {
        if(res.data.status == 200) {
          // 设置成功
          this.setData({
            noName: false
          })
        }
      }
    })
  },

  login() {
    // wx.login()获取code
    wx.login({
      success: (res) => {
        wx.setStorageSync('code', res.code);
        wx.request({
          url: 'http://localhost:3000/user/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: (res) => {
            console.log(res.data);
            // 目的是为了让新用户插入数据库以及首页这边获取到用户的id
            wx.setStorageSync('token', res.data.token);
            wx.setStorageSync('userId', res.data.openid);
            this.setData({
              loginSuc: true
            })
          }
        })
      },
    })
  },

  getCollections() {
    // 获取用户收藏的新闻id
    wx.request({
      url: 'http://localhost:3000/collection/search',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('userId')
      },
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      success: (res) => {
        if(res.data.status == 400) {
          // 该用户没有收藏内容
          this.alreadyCollect = false;
          console.log('什么都没收藏啦~');
        } else if(res.data.status == 401) {
          // 查询数据库过程报错
          console.log('网络出问题啦~');
        } else {
          //成功，可展示新闻
          var values = [];
          const datas = res.data.result;
          for( var i=0; i<datas.length; i++) {
            values.push(datas[i].news_id);
          }
          console.log(res.data.result);
          console.log(values);
          this.setData({
            collectIds : values,
            alreadyCollect: true
          });
          console.log("1111",this.data.collectIds);
          this.getCollectionNews();
        }
      }
    })
  },
  getCollectionNews() {
    console.log("22222",this.data.collectIds);
    var collects=[];
    for(var i=0; i<this.data.collectIds.length;i++) {
      console.log(this.data.collectIds[i])
      // 根据collectIds里每一条id获取新闻
      wx.request({
        url: 'http://v.juhe.cn/toutiao/content?uniquekey='+this.data.collectIds[i]+'&key='+this.data.api,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
         },
         success: res => {
          console.log(res.data.result);
          var detail = res.data.result.detail;
          console.log('detail: ',detail);
          collects.push(detail);
          console.log(collects)
          this.setData({
            collections:collects
          })
         }
      })
    }
    console.log(this.data.collections);
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '个人主页',
    });
    let info = wx.getStorageSync('userInfo');
    if(info) {
      this.setData({
        hasUserInfo: true,
        canIUseOpenData: true,
        hasUserInfo: true,
        canIUseGetUserProfile: true,
        showing: false
      })
      this.login();
      this.getCollections();
    }
  },
  onReady() {
    setTimeout(()=> {
      this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange((res) => {
      let angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (this.data.angle !== angle) {
        this.setData({
          angle: angle
        });
      }
    });
  },
  onShow() {
    let userInfo = wx.getStorageSync('userInfo')
    let dialogComponent = this.selectComponent('.log-dialog');
    if (!userInfo) {
      dialogComponent && dialogComponent.show();
    } else {
      this.setData({
        userInfo: userInfo,
        showing: false
      })
      dialogComponent && dialogComponent.hide();
    }
    this.login();
    this.getCollections();
  },
  onConfirm(e) { // 点击允许
    let dialogComponent = this.selectComponent('.log-dialog');
    dialogComponent && dialogComponent.hide();
    let userInfo = JSON.parse(e.detail.detail.rawData)
    if (!userInfo) {
      return;
    }
    this.setData({
      userInfo: userInfo,
      canIUseOpenData: true,
      showing: false
    })
    wx.setStorageSync('userInfo', userInfo);
    this.login();
    this.getCollections();
    
  },
  onCancel() { // 点击拒绝
    let dialogComponent = this.selectComponent('.log-dialog');
    dialogComponent && dialogComponent.hide();
    this.setData({
      showing: true
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '获取您的个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userinfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userinfo', userinfo);
      },
      fail: function(e) {
        wx.showToast({
          title: '你选择了取消',
          icon: "none",
          duration: 1500,
          mask: true
        })
      }
    })
  }
})
