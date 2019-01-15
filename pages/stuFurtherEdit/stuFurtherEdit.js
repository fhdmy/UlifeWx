//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    headImg:"/test/activitydisplay.jpg",
    judgeArray:["是","否"],
    publishWatch:"是",
    publishVisitor: "是",
    publishCollect: "是",
    publishHistory: "是",
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  bindVistorChange(e) {
    this.setData({
      publishVisitor: this.data.gradeArray[e.detail.value]
    })
  },
  bindCollectChange:function(e){
    this.setData({
      publishCollect: this.data.collegeArray[e.detail.value]
    })
  },
  bindWatchChange: function (e) {
    this.setData({
      publishWatch: this.data.judgeArray[e.detail.value]
    })
  },
  bindHistoryChange: function (e) {
    this.setData({
      publishHistory: this.data.collegeArray[e.detail.value]
    })
  },
  save:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  changeHeadImg:function(){
    wx.chooseImage({
      success: function(res) {
        console.log(res)
      },
    })
  },
})

