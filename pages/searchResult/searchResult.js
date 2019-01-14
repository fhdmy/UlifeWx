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
    type:"活动",
    time:"",
    interest:"",
    hobby:"",
    sort:"综合排序",
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
  },
  chooseType:function(e){
    // console.log(e._relatedInfo.anchorTargetText)
    this.setData({
      type: e._relatedInfo.anchorTargetText
    })
  },
  chooseTime:function(e){
    this.setData({
      time: e._relatedInfo.anchorTargetText
    })
  },
  chooseInterest:function(e){
    this.setData({
      interest: e._relatedInfo.anchorTargetText
    })
  },
  chooseHobby:function(e){
    this.setData({
      hobby: e._relatedInfo.anchorTargetText
    })
  },
  chooseSort:function(e){
    this.setData({
      sort: e._relatedInfo.anchorTargetText
    })
  },
  clearChoose:function(){
    this.setData({
      type: "活动",
      time: "",
      interest: "",
      hobby: "",
      sort: "综合排序",
    })
  }
})