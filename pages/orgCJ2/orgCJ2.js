// pages/OrgCJ I/chuangjianII.js
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    array1:['比赛','分享','互动'],
    array2:['游戏','影视','棋牌','文化艺术','运动/户外','学术科技'],
    actType: "比赛",
    hobby: "游戏",
    date: '2016-09-01',
    time: '12:01',
    headImg:"/images/createdefault.jpg",
    date:"2016-09-01",
    time:"12:01",
    location:"上海大学",
    describe:"",
    type:"link",
    placeHolder:false
  },
  onLoad: function (options){
    this.data.type = options.type;
  },
  onShow: function (options) {
    let _this = this;
    let time = new Date();
    _this.setData({
      navH: app.globalData.navbarHeight,
      location: app.globalData.createCJ2Content,
      date: time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate(),
      time: time.getHours() + ':' + time.getMinutes(),
    })
    if (app.globalData.createHeadImg!="")
      _this.setData({ headImg: app.globalData.createHeadImg})
    if (app.globalData.createDate != "")
      _this.setData({ date: app.globalData.createDate })
    if (app.globalData.createTime != "")
      _this.setData({ time: app.globalData.createTime })
    if (app.globalData.createLocation != "")
      _this.setData({ location: app.globalData.createLocation })
    if (app.globalData.createType != "")
      _this.setData({ actType: app.globalData.createType })
    if (app.globalData.createHobby != "")
      _this.setData({ hobby: app.globalData.createHobby })
    if (app.globalData.createDescribe != "")
      _this.setData({ describe: app.globalData.createDescribe })
    app.globalData.createCJ2Content ="上海大学";
    app.globalData.createCJ2Type="";
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    app.globalData.createDate = this.data.date
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
    app.globalData.createTime = this.data.time
  },
  toEditAreaLocation(){
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=orgCJ2&type=location',
    })
  },
  bindTypeChange(e){
    this.setData({
      actType: this.data.array1[e.detail.value]
    })
    app.globalData.createType = this.data.actType
  },
  bindHobbyChange(e) {
    this.setData({
      hobby: this.data.array2[e.detail.value]
    })
    app.globalData.createHobby = this.data.hobby
  },
  toNext:function(){
    wx.navigateTo({
      url: '/pages/orgCJ3/orgCJ3?type='+this.data.type
    })
  },
  inputDescribe:function(e){
    if(e.detail.value=="")
      this.setData({
        placeHolder:false
      })
    else
      this.setData({
        placeHolder: true
      })
    this.setData({
      describe: e.detail.value
    })
    app.globalData.createDescribe = this.data.describe
  },
  bindFocus:function(){
    this.setData({
      placeHolder:true
    })
  },
  changeHeadImg:function(){
    let _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let size = res.tempFiles[0].size;
        if (size > 10485760) {
          wx.showToast({
            title: '图片太大了',
            image: '/images/about.png'
          })
          return;
        }
        _this.setData({
          headImg: res.tempFilePaths[0]
        })
        app.globalData.createHeadImg = _this.data.headImg
      },
    })
  },
  toNext:function(){
    app.globalData.createHeadImg = this.data.headImg;
    app.globalData.createDate = this.data.date;
    app.globalData.createTime = this.data.time;
    app.globalData.createLocation = this.data.location;
    app.globalData.createType = this.data.actType;
    app.globalData.createHobby = this.data.hobby;
    app.globalData.createDescribe = this.data.describe;
    wx.navigateTo({
      url: '/pages/orgCJ3/orgCJ3?type=' + this.data.type,
    })
  }
})