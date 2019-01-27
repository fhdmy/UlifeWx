//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    choosen: 0,
    loading: false,
    activities1: [],
    moresignupacts1: "",
    presentsignup1: 0,
    signupmax1: 0,
    activities2: [],
    moresignupacts2: "",
    presentsignup2: 0,
    signupmax2: 0,
    scroll: false,
  },
  onLoad: function (options) {
    let _this = this;
    let id = wx.getStorageSync(md5.hex_md5("user_url"));
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading: true
    })
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/browsering-histories/?watcher=' + id,
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障！',
              image: '/images/about.png'
            })
            resolve(1)
          }
          else {
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              let computeddate = res.data.results[k].target.start_at.split('T');
              let sacts = "activities1[" + k + "]";
              _this.setData({
                [sacts]: {
                  head_img: app.globalData.url + res.data.results[k].target.head_img + '.thumbnail.0.jpg',
                  heading: res.data.results[k].target.heading,
                  date: computeddate[0],
                  location: res.data.results[k].target.location,
                  orgavatar: app.globalData.url + res.data.results[k].target.owner.avatar + '.thumbnail.2.jpg',
                  isover: false,
                  acturl: res.data.results[k].target.id,
                  org_id: res.data.results[k].target.owner.id,
                  is_ended: res.data.results[k].target.is_ended,
                }
              })
            }
            _this.setData({
              moresignupacts1: res.data.next,
              presentsignup1: res.data.results.length,
              signupmax1: res.data.count
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
  chooseTab0: function () {
    this.setData({
      choosen: 0
    })
  },
  chooseTab1: function () {
    let _this = this;
    _this.setData({
      choosen: 1
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
    if (_this.data.activities2.length == 0) {
      _this.setData({
        loading: true
      })
      let p2 = new Promise(function (resolve, reject) {
        wx.request({
          url: app.globalData.url + '/activity/participations/?student=' + id + '&activity__is_ended=True',
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
              resolve(2)
            }
            else {
              for (let k = 0; k < res.data.results.length; k++) {
                // 设置数组
                let computeddate = res.data.results[k].activity.start_at.split('T');
                let sacts = "activities2[" + k + "]";
                _this.setData({
                  [sacts]: {
                    head_img: app.globalData.url + res.data.results[k].activity.head_img + '.thumbnail.0.jpg',
                    heading: res.data.results[k].activity.heading,
                    date: computeddate[0],
                    location: res.data.results[k].activity.location,
                    orgavatar: app.globalData.url + res.data.results[k].activity.owner.avatar + '.thumbnail.2.jpg',
                    isover: false,
                    acturl: res.data.results[k].activity.id,
                    org_id: res.data.results[k].activity.owner.id,
                    is_ended: res.data.results[k].activity.is_ended,
                  }
                })
              }
              _this.setData({
                moresignupacts2: res.data.next,
                presentsignup2: res.data.results.length,
                signupmax2: res.data.count
              })
              resolve(2)
            }
          }
        })
      })
      p2.then(function (results) {
        _this.setData({
          loading: false
        })
      })
    }
  },
  scrollBottom: function () {
    let _this = this;
    //历史浏览
    if (_this.data.choosen == 0) {
      if (_this.data.signupmax1 == _this.data.presentsignup1 || _this.data.scroll == true)
        return;
      //更多活动
      _this.setData({
        loading: true,
        scroll: true
      })
      var pm = new Promise(function (resolve, reject) {
        wx.request({
          url: _this.data.moresignupacts1,
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
              resolve("pm");
            }
            else {
              for (let k = 0; k < res.data.results.length; k++) {
                // 设置数组
                var computeddate = res.data.results[k].target.start_at.split('T');
                let actner = "activities1[" + parseInt(_this.data.presentsignup1 + k) + "]";
                _this.setData({
                  [actner]: {
                    head_img: app.globalData.url + res.data.results[k].target.head_img + '.thumbnail.0.jpg',
                    heading: res.data.results[k].target.heading,
                    date: computeddate[0],
                    location: res.data.results[k].target.location,
                    orgavatar: app.globalData.url + res.data.results[k].target.owner.avatar + '.thumbnail.2.jpg',
                    isover: false,
                    acturl: res.data.results[k].target.id,
                    org_id: res.data.results[k].target.owner.id,
                    is_ended: res.data.results[k].target.is_ended,
                  },
                })
              }
              _this.setData({
                moresignupacts1: res.data.next,
                presentsignup1: (res.data.results.length + _this.data.presentsignup1)
              })
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
    // 历史参加
    else {
      if (_this.data.signupmax2 == _this.data.presentsignup2 || _this.data.scroll == true)
        return;
      //更多活动
      _this.setData({
        loading: true,
        scroll: true
      })
      var pm = new Promise(function (resolve, reject) {
        wx.request({
          url: _this.data.moresignupacts2,
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
              resolve("pm");
            }
            else {
              for (let k = 0; k < res.data.results.length; k++) {
                // 设置数组
                var computeddate = res.data.results[k].activity.start_at.split('T');
                let actner = "activities2[" + parseInt(_this.data.presentsignup2 + k) + "]";
                _this.setData({
                  [actner]: {
                    head_img: app.globalData.url + res.data.results[k].activity.head_img + '.thumbnail.0.jpg',
                    heading: res.data.results[k].activity.heading,
                    date: computeddate[0],
                    location: res.data.results[k].activity.location,
                    orgavatar: app.globalData.url + res.data.results[k].activity.owner.avatar + '.thumbnail.2.jpg',
                    isover: false,
                    acturl: res.data.results[k].activity.id,
                    org_id: res.data.results[k].activity.owner.id,
                    is_ended: res.data.results[k].activity.is_ended,
                  },
                })
              }
              _this.setData({
                moresignupacts2: res.data.next,
                presentsignup2: (res.data.results.length + _this.data.presentsignup2)
              })
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
  },
  clearView: function () {
    let _this = this;
    _this.setData({
      loading: true
    })
    let stuId = wx.getStorageSync(md5.hex_md5("user_url"));
    wx.request({
      url: app.globalData.url + '/activity/browsering-history-wipe/',
      method: "DELETE",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        'stu_id': stuId
      },
      complete: (res) => {
        wx.showToast({
          title: 'test！',
          image: '/images/about.png'
        })
        if (res.statusCode != 204) {
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '网络传输故障！',
            image: '/images/about.png'
          })
        }
        else {
          _this.setData({
            activities1: 0,
            presentsignup1: 0,
            signupmax1: 0,
            loading: false
          })
        }
      }
    })
  },
  clearAttend: function () {
    let _this = this;
    _this.setData({
      loading: true
    })
    let stuId = wx.getStorageSync(md5.hex_md5("user_url"));
    wx.request({
      url: app.globalData.url + '/activity/ended-participation-wipe/',
      method: "DELETE",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        'stu_id': stuId
      },
      complete: (res) => {
        if (res.statusCode != 204) {
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '网络传输故障！',
            image: '/images/about.png'
          })
        }
        else {
          _this.setData({
            activities2: 0,
            presentsignup2: 0,
            signupmax2: 0,
            loading: false
          })
        }
      }
    })
  }
})

