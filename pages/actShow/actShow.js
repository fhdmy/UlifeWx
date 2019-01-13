//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    orgAvatar:"/test/suselogo.jpg",
    headImg:"/test/success.jpg",
    heading:"云光寻履迹",
    describe:"这是一个什么奇怪的活动，还反坏发哈个花花采暖IC阿迪啊会啊人员马刺啊缠绕膜爱臭美让。这是一个什么奇怪的活动，还反坏发哈个花花采暖IC阿迪啊会啊人员马刺啊缠绕膜爱臭美让。",
    star:3.6,
    date:"3/14",
    time:"15:00",
    location:"新世纪村口",
    hobby:"运动/户外",
    type:"比赛",
    comment:[
      {
        avatar:"/test/xnick.jpg",
        nickname:"Xnick",
        date:"2017/09/08",
        index:"让ui好人car花女购入啊过于冗长暖谷有人v啊u插入呀才能让个v印染工艺人餐盎然CR卡hi v你噶与个人啊u如果擦干惹怒嘎v内裤人民擦汗入眠v海瑞哈v怒如果v啊u要你如果率啊与个人你啊忍耐牙槽骨那吗用啊于次日个奶个v阿奴如果采用此乃杨灿灿菜如v啊ui软v改一个绿啊晕如果v阿姨如果v把韵律感路过那vu率啊u人奥i啊CR华北v个人努亚耻辱啊个v有如果啊"
      },
      {
        avatar: "/test/xnick.jpg",
        nickname: "Xnick",
        date: "2017/09/08",
        index: "让ui好人car花女购入啊过于冗长暖谷有人v啊u插入呀才能让个v印染工艺人餐盎然CR卡hi v你噶与个人啊u如果擦干惹怒嘎v内裤人民擦汗入眠v海瑞哈v怒如果v啊u要你如果率啊与个人你啊忍耐牙槽骨那吗用啊于次日个奶个v阿奴如果采用此乃杨灿灿菜如v啊ui软v改一个绿啊晕如果v阿姨如果v把韵律感路过那vu率啊u人奥i啊CR华北v个人努亚耻辱啊个v有如果啊"
      }
    ],
    collected:false,
    hasSignUp:false
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  toCollect:function(){
    this.setData({
      collected:!this.data.collected
    })
  },
  openOrg: function () {
    wx.navigateTo({
      url: '/pages/orgDisplay/orgDisplay',
    })
  },
  openStu:function(){
    wx.navigateTo({
      url: '/pages/stuDisplay/stuDisplay',
    })
  }
})

