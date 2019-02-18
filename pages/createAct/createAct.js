// pages/OrgChuangjian/OrgChuangJian.js
const app = getApp()
Page({
  data: {
    navH: 0,
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
    })
  },
  createEdit:function() {
    wx.navigateTo({
      url: '/pages/orgCJ1/orgCJ1?type=edit',
    })
  },
  createLink: function () {
    wx.navigateTo({
      url: '/pages/orgCJ1/orgCJ1?type=link',
    })
  },
})