//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navH:0,
    nickName:"",
    studentAvatar:"",
    isLogin:false,
    loading:false,
    redDot:false
  },
  onShow: function (options) {
    let _this=this;
    _this.setData({
      navH:app.globalData.navbarHeight,
      isLogin:app.globalData.isLogin,
      studentAvatar:app.globalData.avatar,
      nickName:app.globalData.name
    })
    if (app.globalData.inbox_count>0){
      wx.showTabBarRedDot({
        index: 2,
      })
      _this.setData({
        redDot:true
      })
    }
    else{
      wx.hideTabBarRedDot({
        index: 2,
      })
      _this.setData({
        redDot: false
      })
    }
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
    if (app.globalData.isLogin == false) {
      wx.showToast({
        title: '请先登录Ulife账号！',
        image: "/images/about.png"
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/stuSignUp/stuSignUp',
    })
  },
  watch: function () {
    if (app.globalData.isLogin == false) {
      wx.showToast({
        title: '请先登录Ulife账号！',
        image: "/images/about.png"
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/stuWatch/stuWatch',
    })
  },
  collect: function () {
    if (app.globalData.isLogin == false) {
      wx.showToast({
        title: '请先登录Ulife账号！',
        image: "/images/about.png"
      })
      return;
    }
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
    if (app.globalData.isLogin == false) {
      wx.showToast({
        title: '请先登录Ulife账号！',
        image: "/images/about.png"
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/stuHistory/stuHistory',
    })
  },
  toStuMsg:function(){
    if(app.globalData.isLogin==false){
      wx.showToast({
        title: '请先登录Ulife账号！',
        image:"/images/about.png"
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/stuMsg/stuMsg',
    })
  },
  qrCodeMsg:function(e){
    let url = e.detail.qrCode;
    let urlJudge=url.split("/");
    if (urlJudge[0] != 'https:' || urlJudge[2] != 'ulife.org.cn' || urlJudge[3] !='activity'){
      wx.showToast({
        title: '只能扫描站内二维码！',
        image: "/images/about.png"
      })
      return;
    }
    let urlSpit = url.split("https://ulife.org.cn/activity/");
    let id=urlSpit[1];
    wx.navigateTo({
      url: '/pages/actShow/actShow?actId='+id,
    })
  },
  websit:function(e){
    wx.showModal({
      title: 'Ulife网站',
      content: 'https://ulife.org.cn（建议在pc上打开）',
      showCancel:false
    })
  }
})
