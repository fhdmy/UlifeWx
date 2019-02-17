// pages/OrgCJ I/chuangjianI.js
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    type:"link",
    heading: "",
    focus: true,
  },
  onShow: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
    })
    if(app.globalData.createHeading!="")
      _this.setData({
        heading: app.globalData.createHeading
      })
  },
  onLoad: function (options){
    this.data.type = options.type;
    app.globalData.heading="";
    app.globalData.createHeadImg = "";
    app.globalData.createDate = "";
    app.globalData.createTime = "";
    app.globalData.createLocation = "";
    app.globalData.createType = "";
    app.globalData.createHobby = "";
    app.globalData.createDescribe = "";
    app.globalData.createRequires = [];
    app.globalData.createSelectArray = [];
    app.globalData.createLink="";
  },
  bindInput: function (e) {
    this.setData({
      heading: e.detail.value
    })
  },
  toNext: function() {
    app.globalData.createHeading=this.data.heading;
    wx.navigateTo({
      url: '/pages/orgCJ2/orgCJ2?type='+this.data.type
    })
  }
})