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
    redDot:false,
    type:"none"
  },
  onShow: function (options) {
    let _this=this;
    _this.setData({
      navH:app.globalData.navbarHeight,
      isLogin:app.globalData.isLogin,
      studentAvatar:app.globalData.avatar,
      nickName:app.globalData.name,
      type:app.globalData.type
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
    if (this.data.type != 'org' && this.data.type != 'none')
      wx.navigateTo({
        url: '/pages/stuEdit/stuEdit',
      })
    else 
      // wx.showModal({
      //   title: '功能未完善',
      //   content: '请登录Ulife网页版进行操作',
      //   showCancel:false
      // })
      wx.navigateTo({
        url: '/pages/orgEdit/orgEdit',
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
        title: '请先登录账号',
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
        title: '请先登录账号',
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
        title: '请先登录账号',
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
        title: '请先登录账号',
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
        title: '请先登录账号',
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
      wx.showModal({
        title: '二维码无效',
        content: '只能扫描站内二维码',
        showCancel: false
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
  },
  toRules:function(){
    wx.navigateTo({
      url: '/pages/terms/terms',
    })
  },
  myAct:function(){
    wx.navigateTo({
      url: '/pages/myActs/myActs',
    })
  },
  orgSignup:function(){
    wx.navigateTo({
      url: '/pages/orgSignup/orgSignup',
    })
  },
  draft:function(){
    wx.navigateTo({
      url: '/pages/draft/draft',
    })
  },
  createAct:function(){
    wx.navigateTo({
      url: '/pages/createAct/createAct',
    })
  }
})
