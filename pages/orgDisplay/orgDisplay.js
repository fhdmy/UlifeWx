//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    scrollTop: 0,
    globalUrl: app.globalData.url,
    loading: false,
    abstractTitle: "<=简介",
    org: "",
    orgAvatar: "",
    orgId: 0,
    headImg: "",
    watch: 0,
    star: 2,
    actNum: 0,
    lists: [],
    activities: [{
        head_img: "/test/3.jpg",
        heading: "ISHARE真人图书馆",
        date: "2018年1月5日",
        time: "15:00",
        location: "东区平台",
        orgAvatar: "/test/suselogo.jpg"
      },
      {
        head_img: "/test/5.jpg",
        heading: "ISHARE真人图书馆",
        date: "2018年1月5日",
        time: "15:00",
        location: "东区平台",
        orgAvatar: "/test/suselogo.jpg"
      }
    ],
    hasWatched: false
  },
  onLoad: function(options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading: true
    })
    let p1 = new Promise(function(resolve, reject) {
      wx.request({
        url: app.globalData.url + '/account/org-visitor-homepage/' + options.orgId + '/',
        headers: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            resolve(1)
          } else {
            _this.setData({
              headImg: app.globalData.url + res.data.bg_img + '.thumbnail.2.jpg',
              orgAvatar: app.globalData.url + res.data.avatar + '.thumbnail.3.jpg',
              org: res.data.org_name,
              watch: res.data.watcher_count,
              stars: res.data.stars,
              actNum: res.data.activity_count,
              orgId: res.data.user,
              lists: JSON.parse(res.data.demonstration)
            })
            resolve(1)
          }
        }
      })
    })
    Promise.all([p1]).then(function(results) {
      _this.setData({
        loading: false
      })
    })
  },
  towatch: function() {
    this.setData({
      hasWatched: !this.data.hasWatched
    })
  },
  toDynamic: function() {
    let _this = this;
    var query = wx.createSelectorQuery();
    query.select("#abstract").boundingClientRect();
    query.exec(function(res) {
      let height = res[0].height;
      let screenWidth=wx.getSystemInfoSync().windowWidth;
      height = height*750/screenWidth;
      _this.setData({
        scrollTop: parseInt(480 + height) + "rpx"
      })
    })
  },
  toAbstract: function() {
    let _this = this;
    _this.setData({
      scrollTop: 480 + "rpx"
    })
  }
})