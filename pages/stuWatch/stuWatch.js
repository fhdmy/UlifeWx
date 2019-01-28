//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    choosen: 0,
    loading: false,
    activities: [],
    moresignupacts: "",
    presentsignup: 0,
    signupmax: 0,
    scroll: false,
    watcher: []
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading: true
    })
    let id = wx.getStorageSync(md5.hex_md5("user_url"))
    let p2 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/account/watchings/?watcher=' + id,
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障！',
              image: '/images/about.png'
            })
            resolve(2);
          }
          else {
            for (let k = 0; k < res.data.length; k++) {
              let wter = "watcher[" + k + "]";
              _this.setData({
                [wter]: {
                  orgavatar: app.globalData.url + res.data[k].target.avatar,
                  orgname: res.data[k].target.org_name,
                  orgid: res.data[k].target.id,
                  watchId: res.data[k].id
                }
              })
            }
            resolve(2);
          }
        }
      })
    })
    p2.then(function(results){
      let p1 = new Promise(function (resolve, reject) {
        let ids = "";
        for (let j = 0; j < _this.data.watcher.length; j++) {
          if (j == _this.data.watcher.length - 1) {
            ids = ids + _this.data.watcher[j].orgid;
            break;
          }
          ids = ids + _this.data.watcher[j].orgid + ',';
        }
        wx.request({
          url: app.globalData.url + '/activity/activities/?owner__in=' + ids,
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
    })
  },
  scrollBottom: function () {
    let _this = this;
    if (_this.data.signupmax == _this.data.presentsignup || _this.data.scroll == true || _this.data.choosen==1)
      return;
    //更多活动
    _this.setData({
      loading: true,
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
              title: '网络传输故障！',
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
  },
  cancelWatch: function (e) {
    let _this = this;
    let id = e.target.id;
    let spt = id.split("-");
    let index = spt[1];
    let watchId = spt[0];
    wx.showModal({
      content: '你真的想取消关注吗？',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          //取消关注api
          _this.cancelWatchRequest(index, watchId);
        } else if (res.cancel) {
          console.log('取消按钮')
        }
      }
    })
  },
  cancelWatchRequest: function (index, watchId) {
    let _this = this;
    _this.setData({
      loading: false
    })
    wx.request({
      url: app.globalData.url + '/account/watchings/' + watchId,
      method: "DELETE",
      header: {
        "Authorization": app.globalData.token
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
        } else {
          let temp = _this.data.watcher;
          temp.splice(index, 1);
          _this.setData({
            watcher: temp,
            loading: false
          })
        }
      }
    })
  },
  openOrg: function (e) {
    wx.navigateTo({
      url: '/pages/orgDisplay/orgDisplay?orgId=' + e.target.id,
    })
  }
})

