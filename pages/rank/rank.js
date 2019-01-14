//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    RecommandOrgAvatar: "/test/suselogo.jpg",
    RecommandOrgInform: "上海大学经济学院学生会成立于2008年9月，是受经济学院党委与团委知道的青年学生群众性组织，前身为上海大学国际工商与管理学院学生会。上海大学经济学院学生会成立于2008年9月，是受经济学院党委与团委知道的青年学生群众性组织，前身为上海大学国际工商与管理学院学生会。",
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
    orgRank: [
      {
        img:'/test/suselogo.jpg',
        org:"经济学院学生会",
        star:5.0
      },
      {
        img:'/test/xhlogo.jpg',
        org:'上大校会',
        star:4.8
      },
      {
        img: '/test/xnick.jpg',
        org: "经济学院学生会",
        star: 5.0
      }, 
      {
        img: '/test/suselogo.jpg',
        org: "经济学院学生会",
        star: 5.0
      },
      {
        img: '/test/suselogo.jpg',
        org: "经济学院学生会",
        star: 5.0
      }
    ]
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  openOrg:function(){
    wx.navigateTo({
      url: '/pages/orgDisplay/orgDisplay',
    })
  }
})

