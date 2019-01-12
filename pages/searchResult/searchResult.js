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
    searchContent:"",
    activities: [
      {
        img: "/test/3.jpg",
        heading: "ISHARE真人图书馆",
        date: "2018年1月5日",
        time: "15:00",
        location: "东区平台",
        orgAvatar: "/test/suselogo.jpg"
      },
      {
        img: "/test/5.jpg",
        heading: "ISHARE真人图书馆",
        date: "2018年1月5日",
        time: "15:00",
        location: "东区平台",
        orgAvatar: "/test/suselogo.jpg"
      },
      {
        img: "/test/5.jpg",
        heading: "ISHARE真人图书馆",
        date: "2018年1月5日",
        time: "15:00",
        location: "东区平台",
        orgAvatar: "/test/suselogo.jpg"
      }
    ],
    swiper:false
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
  search:function(){

  },
  bindInput:function(e){
    this.setData({
      searchContent: e.detail.value
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  searchChoose:function(){
    this.setData({
      swiper:!this.data.swiper
    })
  }
})