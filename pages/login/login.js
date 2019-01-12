//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navH:0,
    alert:"密码错误"
  },
  onLoad: function (options) {
    let _this=this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  login:function(){
    app.globalData.isLogin=true;
    wx.navigateBack({
      delta: 1
    })
  }
})
