//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    newVersion: `暂时没有新版本说明。
    `
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  }
})

