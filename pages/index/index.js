//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navH:0,
    userInfo: {},
    hasUserInfo: false,
    activities:[
      {
        img:"/test/3.jpg",
        heading:"ISHARE真人图书馆",
        date:"2018年1月5日",
        time:"15:00",
        location:"东区平台",
        orgAvatar:"/test/suselogo.jpg"
      },
      {
        img: "/test/5.jpg",
        heading: "ISHARE真人图书馆",
        date: "2018年1月5日",
        time: "15:00",
        location: "东区平台",
        orgAvatar: "/test/suselogo.jpg"
      }
    ],
    background: ['/test/1.jpg', '/test/2.jpg', '/test/3.jpg', '/test/4.jpg', '/test/5.jpg'],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    let _this=this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  openAct:function(){
    wx.navigateTo({
      url: '/pages/actShow/actShow',
    })
  }
})
