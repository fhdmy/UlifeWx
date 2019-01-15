//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    choosen:0,
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
      }
    ]
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  chooseTab0:function(){
    this.setData({
      choosen:0
    })
  },
  chooseTab1: function () {
    this.setData({
      choosen: 1
    })
  }
})

