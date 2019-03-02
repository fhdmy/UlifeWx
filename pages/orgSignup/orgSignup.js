//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    loading: false,
    activities: [],
    moresignupacts: "",
    presentsignup: 0,
    signupmax: 0,
    scroll: false,
    loadOk:false
  },
  onLoad: function (options) {
    let _this = this;
    let id = wx.getStorageSync(md5.hex_md5("org_url"));
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    // _this.setData({
    //   loading: true
    // })
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/?owner=' + id + '&is_ended=False&is_published=True&ordering=-created_at',
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
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              let computeddate = res.data.results[k].start_at.split('T');
              let sacts = "activities[" + k + "]";
              _this.setData({
                [sacts]: {
                  head_img: app.globalData.url + res.data.results[k].head_img + '.thumbnail.2.jpg',
                  heading: res.data.results[k].heading,
                  date: computeddate[0],
                  location: res.data.results[k].location,
                  orgavatar: app.globalData.url + res.data.results[k].owner.avatar,
                  isover: false,
                  acturl: res.data.results[k].id,
                  org_id: res.data.results[k].owner.id,
                }
              })
            }
            _this.data.moresignupacts=res.data.next
            _this.data.presentsignup= res.data.results.length
            _this.data.signupmax= res.data.count
            resolve(1)
          }
        }
      })
    })
    p1.then(function (results) {
      _this.setData({
        loadOk:true
      })
    })
  },
  scrollBottom: function () {
    let _this = this;
    if (_this.data.signupmax == _this.data.presentsignup || _this.data.scroll == true)
      return;
    //更多活动
    _this.setData({
      scroll: true
    })
    var pm = new Promise(function (resolve, reject) {
      wx.request({
        url: _this.data.moresignupacts,
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
              var computeddate = res.data.results[k].start_at.split('T');
              let actner = "activities[" + parseInt(_this.data.presentsignup + k) + "]";
              _this.setData({
                [actner]: {
                  head_img: app.globalData.url + res.data.results[k].head_img + '.thumbnail.2.jpg',
                  heading: res.data.results[k].heading,
                  date: computeddate[0],
                  location: res.data.results[k].location,
                  orgavatar: app.globalData.url + res.data.results[k].owner.avatar,
                  isover: false,
                  acturl: res.data.results[k].id,
                  org_id: res.data.results[k].owner.id,
                },
              })
            }
            _this.data.moresignupacts=res.data.next
            _this.data.presentsignup+=res.data.results.length
            resolve("pm");
          }
        }
      })
    })
    Promise.all([pm]).then(function (results) {
      _this.setData({
        scroll: false
      })
    })
  },
})

