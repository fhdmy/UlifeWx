//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    choosen:0,
    loading: false,
    activities: [],
    moresignupacts: "",
    presentsignup: 0,
    signupmax: 0,
    scroll: false,
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    var id = wx.getStorageSync(md5.hex_md5("user_url"))
    if (id == "") {
      wx.showModal({
        title: '未登录Ulife',
        content: '请登录后再进入此页面。',
        showCancel: false,
        confirmText: '确定',
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
    _this.setData({
      loading: true
    })
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/?owner__in=' + id,
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            resolve(1)
          }
          else {
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              let computeddate = res.data.results[k].start_at.split('T');
              let sacts = "activities[" + k + "]";
              _this.setData({
                [sacts]: {
                  head_img: app.globalData.url + res.data.results[k].head_img + '.thumbnail.0.jpg',
                  heading: res.data.results[k].heading,
                  date: computeddate[0],
                  location: res.data.results[k].location,
                  orgavatar: app.globalData.url + res.data.results[k].owner.avatar + '.thumbnail.2.jpg',
                  isover: false,
                  acturl: res.data.results[k].id,
                  org_id: res.data.results[k].owner.id,
                  is_ended: res.data.results[k].is_ended,
                }
              })
            }
            _this.setData({
              moresignupacts: res.data.next,
              presentsignup: res.data.results.length,
              signupmax: res.data.count
            })
            resolve(1)
          }
        }
      })
    })
    p1.then(function (results) {
      _this.setData({
        loading: false
      })
    })
  },
  scrollBottom: function () {
    let _this = this;
    if (_this.data.signupmax == _this.data.presentsignup || _this.data.scroll == true)
      return;
    //更多活动
    _this.setData({
      loading: true,
      scroll: true
    })
    var pm = new Promise(function (resolve, reject) {
      wx.request({
        url: _this.data.moresignupacts,
        headers: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            resolve("pm");
          }
          else {
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              var computeddate = res.data.results[k].start_at.split('T');
              let actner = "activities[" + parseInt(_this.data.presentsignup + k) + "]";
              _this.setData({
                [actner]: {
                  head_img: app.globalData.url + res.data.results[k].head_img + '.thumbnail.0.jpg',
                  heading: res.data.results[k].heading,
                  date: computeddate[0],
                  location: res.data.results[k].location,
                  orgavatar: app.globalData.url + res.data.results[k].owner.avatar + '.thumbnail.2.jpg',
                  isover: false,
                  acturl: res.data.results[k].id,
                  org_id: res.data.results[k].owner.id,
                  is_ended: res.data.results[k].is_ended,
                },
              })
            }
            _this.setData({
              moresignupacts: res.data.next,
              presentsignup: (res.data.results.length + _this.data.presentsignup)
            })
            resolve("pm");
          }
        }
      })
    })
    Promise.all([pm]).then(function (results) {
      _this.setData({
        loading: false,
        scroll: false
      })
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

