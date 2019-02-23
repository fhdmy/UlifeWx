//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading: false,
    scroll: false,
    showItem: true,
    abstractTitle: "<=关注",
    stu: "",
    stuAvatar: "",
    stuId: 0,
    headImg: "",
    shareImg:"",
    watch: 0,
    participate: 0,
    credit: "100%",
    is_visitor_public: true,
    is_fav_public: true,
    is_history_public: true,
    is_watched_orgs_public: true,
    activities1: [],
    morecollects: "",
    presentcollects: 0,
    collectmax: 0,
    activities2: [],
    moreatt: "",
    presentatt: 0,
    thattmax: 0
  },
  onShareAppMessage: function (options) {
    return {
      title: this.data.stu,  // 转发标题（默认：当前小程序名称）
      path: '/pages/stuDisplay/stuDisplay?stuId=' + this.data.stuId, // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      imageUrl: this.data.shareImg,
      success(e) {
        // shareAppMessage: ok,
        // shareTickets 数组，每一项是一个 shareTicket ，对应一个转发对象
        // 需要在页面onLoad()事件中实现接口
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
        console.log(e)
        // shareAppMessage:fail cancel
        // shareAppMessage:fail(detail message) 
      },
      complete() { }
    }
  },
  onLoad: function (options) {
    let _this = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    // _this.setData({
    //   loading: true
    // })
    //获得基本信息
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/account/student-visitor-homepage/' + options.stuId + '/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            resolve(1)
          }
          else {
            _this.setData({
              headImg: app.globalData.url + res.data.bg_img + '.thumbnail.2.jpg',
              shareImg: app.globalData.url + res.data.bg_img + '.thumbnail.0.jpg',
              stuAvatar: app.globalData.url + res.data.avatar + '.thumbnail.3.jpg',
              stu: res.data.nickname,
              watch: res.data.watching_count,
              participate: res.data.participation_count,
              credit: res.data.credit + "%",
              stuId: res.data.user,
              is_visitor_public: res.data.is_visitor_public,
              is_fav_public: res.data.is_fav_public,
              is_history_public: res.data.is_history_public,
              is_watched_orgs_public: res.data.is_watched_orgs_public
            })
            resolve(1)
          }
        }
      })
    })
    // 收藏的活动
    let p2 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/bookmarkings/?watcher=' + options.stuId,
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            resolve(2)
          }
          else {
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              let computeddate = res.data.results[k].target.start_at.split('T');
              let ac = "activities1[" + k + "]"
              _this.setData({
                [ac]: {
                  head_img: app.globalData.url + res.data.results[k].target.head_img + '.thumbnail.2.jpg',
                  heading: res.data.results[k].target.heading,
                  date: computeddate[0],
                  location: res.data.results[k].target.location,
                  orgavatar: app.globalData.url + res.data.results[k].target.owner.avatar,
                  isover: false,
                  acturl: res.data.results[k].target.id,
                  org_id: res.data.results[k].target.owner.id,
                  is_ended: res.data.results[k].target.is_ended,
                  bookmarkingurl: res.data.results[k].id
                }
              })
            }
            _this.data.morecollects= res.data.next
            _this.data.presentcollects= res.data.results.length
            _this.data.collectmax= res.data.count
            resolve(2)
          }
        }
      })
    })
    // 参加的活动
    let p3 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/participations/?student=' + options.stuId + '&activity__is_ended=True',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            resolve(3)
          }
          else {
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              let computeddate = res.data.results[k].activity.start_at.split('T');
              let ac = "activities2[" + k + "]"
              _this.setData({
                [ac]: {
                  head_img: app.globalData.url + res.data.results[k].activity.head_img + '.thumbnail.2.jpg',
                  heading: res.data.results[k].activity.heading,
                  date: computeddate[0],
                  location: res.data.results[k].activity.location,
                  orgavatar: app.globalData.url + res.data.results[k].activity.owner.avatar,
                  isover: false,
                  acturl: res.data.results[k].activity.id,
                  org_id: res.data.results[k].activity.owner.id
                }
              })
            }
            _this.data.moreatt= res.data.next
            _this.data.presentatt= res.data.results.length
            _this.data.thattmax= res.data.count
            resolve(3)
          }
        }
      })
    })
    Promise.all([p1, p2, p3]).then(function (results) {
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
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
            }
          }
        })
      }
      // _this.setData({
      //   loading: false
      // })
    })
  },
  toDynamic: function () {
    this.setData({
      showItem: false
    })
  },
  toAbstract: function () {
    this.setData({
      showItem: true
    })
  },
  scrollBottom: function () {
    let _this = this;
    //更多收藏
    if (_this.data.showItem) {
      if (_this.data.collectmax == _this.data.presentcollects || _this.data.scroll == true)
        return;
      _this.setData({
        loading: true,
        scroll: true
      })
      var pm = new Promise(function (resolve, reject) {
        wx.request({
          url: _this.data.morecollects,
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              resolve("pm");
            }
            else {
              for (let k = 0; k < res.data.results.length; k++) {
                // 设置数组
                var computeddate = res.data.results[k].target.start_at.split('T');
                let actner = "activities1[" + parseInt(_this.data.presentcollects + k) + "]";
                _this.setData({
                  [actner]: {
                    head_img: app.globalData.url + res.data.results[k].target.head_img + '.thumbnail.2.jpg',
                    heading: res.data.results[k].target.heading,
                    date: computeddate[0],
                    location: res.data.results[k].target.location,
                    orgavatar: app.globalData.url + res.data.results[k].target.owner.avatar,
                    isover: false,
                    acturl: res.data.results[k].target.id,
                    org_id: res.data.results[k].target.owner.id,
                    is_ended: res.data.results[k].target.is_ended,
                    bookmarkingurl: res.data.results[k].id
                  },
                })
              }
              _this.data.morecollects=res.data.next
              _this.data.presentcollects+=res.data.results.length
              resolve("pm");
            }
          }
        })
      })
      pm.then(function (results) {
        _this.setData({
          loading: false,
          scroll: false
        })
      })
    }
    // 参加的活动
    else{
      if (_this.data.thattmax == _this.data.presentatt || _this.data.scroll == true)
        return;
      _this.setData({
        loading: true,
        scroll: true
      })
      var pm = new Promise(function (resolve, reject) {
        wx.request({
          url: _this.data.moreatt,
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              resolve("pm");
            }
            else {
              for (let k = 0; k < res.data.results.length; k++) {
                // 设置数组
                var computeddate = res.data.results[k].activity.start_at.split('T');
                let actner = "activities2[" + parseInt(_this.data.presentatt + k) + "]";
                _this.setData({
                  [actner]: {
                    head_img: app.globalData.url + res.data.results[k].activity.head_img + '.thumbnail.2.jpg',
                    heading: res.data.results[k].activity.heading,
                    date: computeddate[0],
                    location: res.data.results[k].activity.location,
                    orgavatar: app.globalData.url + res.data.results[k].activity.owner.avatar,
                    isover: false,
                    acturl: res.data.results[k].activity.id,
                    org_id: res.data.results[k].activity.owner.id
                  },
                })
              }
              _this.data.moreatt=res.data.next
              _this.data.presentatt+=res.data.results.length
              resolve("pm");
            }
          }
        })
      })
      pm.then(function (results) {
        _this.setData({
          loading: false,
          scroll: false
        })
      })
    }
  }
})

