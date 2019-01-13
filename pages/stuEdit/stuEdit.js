//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    avatar:"/test/xnick.jpg",
    nickname:"Xnick",
    realname:"姜辰昊",
    phone:"13681678224",
    sex:"女",
    college:"经管大类",
    grade:"大二"
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  toFurtherInform:function(){
    wx.navigateTo({
      url: '',
    })
  },
  save:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  changeAvatar:function(){
    wx.chooseImage({
      success: function(res) {
        console.log(res)
      },
    })
  },
  toEditArea:function(){
    wx.navigateTo({
      url: '/pages/editArea/editArea',
    })
  }
})

