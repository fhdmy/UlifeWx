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
    wx.navigateTo({
      url: '/pages/stuEdit/stuEdit',
    })
  },
  login:function(){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  signUp:function(){
    // if(isLogin==false){

    // }
    wx.navigateTo({
      url: '/pages/stuSignUp/stuSignUp',
    })
  },
  watch: function () {
    // if(isLogin==false){

    // }
    wx.navigateTo({
      url: '/pages/stuWatch/stuWatch',
    })
  },
  collect: function () {
    // if(isLogin==false){

    // }
    wx.navigateTo({
      url: '/pages/stuCollect/stuCollect',
    })
  },
})
