//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    headImg:"",
    judgeArray:["是","否"],
    publishWatch:"是",
    publishVisitor: "是",
    publishCollect: "是",
    publishHistory: "是",
    loading:false
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })

    // 发请求
    _this.data.userurl = wx.getStorageSync(md5.hex_md5("user_url"));
    wx.request({
      url: app.globalData.url + '/account/students/' + _this.data.userurl + '/',
      header: {
        "Authorization": app.globalData.token
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          _this.setData({
            loading: false
          })
        }
        else {
          _this.setData({
            headImg: app.globalData.url + res.data.bg_img + '.thumbnail.1.jpg',
            publishWatch: (res.data.is_watched_orgs_public==true?"是":"否"),
            publishVisitor: (res.data.is_visitor_public == true ? "是" : "否"),
            publishCollect: (res.data.is_fav_public == true ? "是" : "否"),
            publishHistory: (res.data.is_history_public == true ? "是" : "否"),
            loading: false
          })
        }
      }
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

