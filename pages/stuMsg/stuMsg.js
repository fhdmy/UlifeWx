//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  }
})

