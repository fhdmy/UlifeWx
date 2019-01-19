//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navH:0,
    nickName:"",
    studentAvatar:"",
    isLogin:false,
    qrUrl:"",
    loading:false
  },
  onShow: function (options) {
    let _this=this;
    _this.setData({
      navH:app.globalData.navbarHeight,
      isLogin:app.globalData.isLogin,
      studentAvatar:app.globalData.avatar,
      nickName:app.globalData.name
    })
  },
  editInform:function(){
    wx.navigateTo({
      url: '/pages/stuEdit/stuEdit',
    })
  },
  login:function(){
    wx.navigateTo({
      url: '/pages/login/login?type=login'
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
  toAbout:function(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  }, 
  toNewVersion:function(){
    wx.navigateTo({
      url: '/pages/newVersion/newVersion',
    })
  },
  toStuHistory:function(){
    wx.navigateTo({
      url: '/pages/stuHistory/stuHistory',
    })
  },
  toStuMsg:function(){
    wx.navigateTo({
      url: '/pages/stuMsg/stuMsg',
    })
  },
  qrCodeMsg:function(e){
    this.setData({
      qrUrl:e.detail.qrCode
    })
  }
})
