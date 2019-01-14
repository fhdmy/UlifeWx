// pages/searchEntry/searchEntry.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: 0,
    historyButton:[
      "ISHARE", "经济学院学生会","星际"
    ],
    searchContent:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  clear:function(){
    this.setData({
      historyButton:[]
    })
  },
  search:function(){
    wx.navigateTo({
      url: '/pages/searchResult/searchResult',
    })
  },
  bindInput:function(e){
    this.setData({
      searchContent: e.detail.value
    })
  }
})