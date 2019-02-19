//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading: false,
    participants:[],
    formItem:"详细信息"
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
      participants:app.globalData.signupDetail,
      formItem: app.globalData.formItem
    })
  },
  openStu:function(e){
    wx.navigateTo({
      url: '/pages/stuDisplay/stuDisplay?stuId=' + e.target.id,
    })
  }
})

