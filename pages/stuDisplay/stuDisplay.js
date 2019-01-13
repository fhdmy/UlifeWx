//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    showItem:false,//false为简介，true为动态
    abstractTitle:"<=关注",
    stu:"Xnick",
    stuAvatar:"/test/xnick.jpg",
    headImg:"/test/3.jpg",
    watch:10,
    participate:8,
    credit:"100%",
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
  toDynamic:function(){
    this.setData({
      showItem:true
    })
  },
  toAbstract:function(){
    this.setData({
      showItem: false
    })
  }
})

