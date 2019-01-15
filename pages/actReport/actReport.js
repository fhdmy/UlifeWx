//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    reportContent:"",
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  confirm:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  inputContent:function(e){
    this.setData({
      reportContent: e.detail.value
    })
  }
})

