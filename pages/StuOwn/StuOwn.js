//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navH:0,
    nickName:"Xnick",
    studentAvatar:"/test/xnick.jpg",
    isLogin:false
  },
  onShow: function (options) {
    let _this=this;
    _this.setData({
      navH:app.globalData.navbarHeight,
      isLogin:app.globalData.isLogin
    })
  },
  editInform:function(){

  },
  login:function(){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  }
})
