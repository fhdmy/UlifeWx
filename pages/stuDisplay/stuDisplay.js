//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading:false,
    showItem:true,
    abstractTitle:"<=关注",
    stu:"",
    stuAvatar:"",
    stuId:0,
    headImg:"",
    watch:0,
    participate:0,
    credit:"100%",
    is_visitor_public: true,
    is_fav_public: true,
    is_history_public: true,
    is_watched_orgs_public: true,
    activities: [
      {
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
    ]
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading:true
    })
    //获得基本信息
    let p1=new Promise(function(resolve,reject){
      wx.request({
        url: app.globalData.url + '/account/student-visitor-homepage/' + options.stuId + '/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            resolve(1)
          }
          else {
            _this.setData({
              headImg: app.globalData.url + res.data.bg_img + '.thumbnail.2.jpg',
              stuAvatar: app.globalData.url + res.data.avatar + '.thumbnail.3.jpg',
              stu: res.data.nickname,
              watch: res.data.watching_count,
              participate: res.data.participation_count,
              credit: res.data.credit+"%",
              stuId: res.data.user,
              is_visitor_public:res.data.is_visitor_public,
              is_fav_public:res.data.is_fav_public,
              is_history_public:res.data.is_history_public,
              is_watched_orgs_public:res.data.is_watched_orgs_public
            })
            resolve(1)
          }
        }
      })
    })
    p1.then(function(results){
      // 添加访客
      if (app.globalData.token != "" && app.globalData.uid != _this.data.stuId) {
        wx.request({
          url: app.globalData.url + '/message/visitings/',
          method: "POST",
          header: {
            "Authorization": app.globalData.token
          },
          data: {
            'watcher': app.globalData.uid,
            'target': _this.data.stuId
          },
          complete: (res) => {
            if (res.statusCode != 201) {

            }
          }
        })
      }
      _this.setData({
        loading:false
      })
    })
  },
  toDynamic: function () {
    this.setData({
      showItem:false
    })
  },
  toAbstract: function () {
    this.setData({
      showItem:true
    })
  }
})

