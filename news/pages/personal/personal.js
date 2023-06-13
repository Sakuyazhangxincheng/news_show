const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
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
  login: function() {
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
            // 目的是为了让新用户插入数据库以及首页这边获取到用户的id
            console.log('token:'+res.data.token);
            console.log('openid: '+res.data.openid);
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
  getCollections: function() {
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
          const values = [];
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
        }
      }
    })
  },
  showdatas: function() {
    console.log(this.data.collectIds[0]);
  },
  onShareAppMessage: function() {
    return {
      title: '个人主页',
      path: '/pages/home/home',
      success: function(res) {
      }
    }
  },
  gotoHome() {
    wx.redirectTo({
      url: '/pages/home/home',
    });
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
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', userInfo);
      }
    })
  }
})
