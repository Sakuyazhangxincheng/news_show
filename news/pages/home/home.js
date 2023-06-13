// pages/home/home.js
Page({
  data: {
    fList: [],
    list: [],
    key:'9d2932830c8085478849c5c45d083f0f',
    count: 0,
    show: [],
    tabName:"",
    url:"",
    addNew:true,
    newName:"",
    tabCur: 0, //默认选中
    tabs: [{
        name: '头条',
        id: 0
      },
      {
        name: '国内',
        id: 1
      },
      {
        name: '国际',
        id: 2
      },
      {
        name: '娱乐',
        id: 3
      },
      {
        name: '体育',
        id: 4
      },
      {
        name: '军事',
        id: 5
      },
      {
        name: '科技',
        id: 6
      },
      {
        name: '财经',
        id: 8
      },
      {
        name: '游戏',
        id: 9
      },
      {
        name: '汽车',
        id: 10
      },
      {
        name: '健康',
        id: 11
      },
    ]

  },
  onPullDownRefresh:function(){
    this.setData({
      count:this.data.count+1
    })
    console.log(this.data.count)
    console.log(this.data.list.length)
    
    if(this.data.count>this.data.list.length-1){
      if(this.data.addNew){
        this.getMore()
        this.setData({
          addNew:false,
          count:3
        })  
      }else {
        this.setData({
          count:0,
          show:this.data.list[0]
        })
      }
    }
    this.setData({
      show:this.data.list[this.data.count]
    })
    wx.stopPullDownRefresh()
  },
  onLoad: function (options){
    this.getNews()
  },
  getNews() {
    var id = this.data.tabCur
    if(id==0){
      let type = ''
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
      
    }else if(id==1){
      let type = 'guonei'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
    }else if(id==2){
      let type = 'guoji'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})

    }else if(id==3){
      let type = 'yule'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
    }else if(id==4){
      let type = 'tiyu'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})

    }else if(id==5){
      let type = 'junshi'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
    }else if(id==6){
      let type = 'keji'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
    }else if(id==7){
      let type = 'caijing'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
    }else if(id==8){
      let type = 'youxi'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
    }else if(id==9){
      let type = 'qiche'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
    }else if(id==10){
      let type = 'jiankang'
      let url = `http://v.juhe.cn/toutiao/index?type=${type}&page=1&page_size=30&is_filter=1&key=${this.data.key}`;
      wx.request({
        url: url,
      header: {
       'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        this.setData({
          fList: res.data.result.data
        })
        console.log(this.data.fList)
        this.getrecom()
      }})
    }
  },
  getrecom() {
    var result = []
    for (var i = 0; i < this.data.fList.length; i += 5) {
      if(this.data.fList[i]!=null)
      result.push(this.data.fList.slice(i, i + 5));
    }
    this.setData({
      list: result
    })
    console.log(this.data.list)
    this.setData({
      show:this.data.list[0]
    })
  },
  //选择条目
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      addNew: true,
      scrollLeft: (e.currentTarget.dataset.id - 2) * 200,
      count: 0,
      list:[]
    })
    this.getNews()
  },
  onReachBottom: function(){
    console.log("触底")
    if(this.data.count<this.data.list.length-1){
      wx.showLoading({
        title: '更多精彩内容',
      })
      setTimeout(()=>
      {
        this.setData({
          show:this.data.show.concat(this.data.list[this.data.count+1]),
          count:this.data.count+1
        }) 
        console.log(this.data.show)
      }, 500)
      wx.hideLoading()
    } else 
    {
      wx.showToast({
      title: '没有更多新闻了！',
      icon: 'success'
    })
    }
  }
})