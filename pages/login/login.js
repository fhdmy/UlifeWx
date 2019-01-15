//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navH:0,
    alert:"密码错误",
    type:"login"
  },
  onLoad: function (options) {
    let _this=this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    this.setData({
      type:options.type
    })
  },
  login:function(){
    app.globalData.isLogin=true;
    wx.navigateBack({
      delta: 1
    })
  },
  logout:function(){
    wx.showModal({
      content: '你真的想注销吗？',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {
          console.log('取消注销')
        }
      }
    })
  }
})
