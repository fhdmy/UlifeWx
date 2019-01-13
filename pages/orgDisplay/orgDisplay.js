//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    showItem:false,//false为简介，true为动态
    abstractTitle:"<=简介",
    org:"上大学生会",
    orgAvatar:"/test/xhlogo.jpg",
    headImg:"/test/3.jpg",
    describe:"这是一个什么奇怪的活动，还反坏发哈个花花采暖IC阿迪啊会啊人员马刺啊缠绕膜爱臭美让。这是一个什么奇怪的活动，还反坏发哈个花花采暖IC阿迪啊会啊人员马刺啊缠绕膜爱臭美让。",
    watcher:10,
    star:4.5,
    actNum:14,
    abstract: "In sit amet condimentum felis, quis finibus sapien. Nunc felis nisi, pellentesque accumsan diam ut, accumsan porta turpis. Pellentesque maximus nec ipsum id condimentum. Integer consequat, massa eget laoreet scelerisque, sapien turpis varius urna, et tempor justo nisl eu lectus. Mauris vestibulum nibh id tortor varius, vitae dictum tortor maximus. Fusce vel dignissim turpis, a pulvinar enim. Sed imperdiet tellus ac ornare semper.celerisque, sapien turpis varius urna, et tempor justo nisl eu lectus.Mauris vestibulum nibh id tortor varius, vitae dictum tortor maximus.",
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
    ],
    hasWatched:false
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  toCollect:function(){
    this.setData({
      collected:!this.data.collected
    })
  },
  toWatch:function(){
    this.setData({
      hasWatched:!this.data.hasWatched
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

