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
  },
  onLoad: function (options) {
    let _this = this;
    let id = wx.getStorageSync(md5.hex_md5("org_url"));
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading: true
    })
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/get_viewable/',
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
                  is_ended: res.data.results[k].is_ended,
                  link: res.data.results[k].link,
                  want_to_be_allowed_to_publish: res.data.results[k].want_to_be_allowed_to_publish,
                  org_id: res.data.results[k].owner.id,
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
                  is_ended: res.data.results[k].is_ended,
                  link: res.data.results[k].link,
                  want_to_be_allowed_to_publish: res.data.results[k].want_to_be_allowed_to_publish,
                  org_id: res.data.results[k].owner.id,
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
  showActionSheet:function(e){
    let _this=this;
    let i = e.detail;
    if(_this.data.activities[i].is_ended){
      wx.showActionSheet({
        itemList: ['编辑', '删除'],
        success(e) {
          if (e.tapIndex == 0) {
            _this.editAct(i);
          }
          else {
            _this.deleteAct(i);
          }
        }
      })
    }
    else{
      wx.showActionSheet({
        itemList: ['编辑', '结束', '删除'],
        success(e) {
          if (e.tapIndex == 0) {
            _this.editAct(i);
          }
          else if (e.tapIndex == 1) {
            _this.stopAct(i);
          }
          else {
            _this.deleteAct(i);
          }
        }
      })
    }
  },
  editAct: function (i){
    let _this = this;
    let link = _this.data.activities[i].link; _this.data.activities[i].acturl
    app.globalData.createActId = _this.data.activities[i].acturl
    // 链接活动
    if (link) {
      wx.navigateTo({
        url: '/pages/orgCJ1/orgCJ1?type=link&reedit=true',
      })
    }
    // 编辑活动
    else {
      wx.navigateTo({
        url: '/pages/orgCJ1/orgCJ1?type=edit&reedit=true',
      })
    }
  },
  stopAct: function (i){
    let _this = this;
    wx.request({
      url: app.globalData.url + '/activity/activities/' + _this.data.activities[i].acturl + "/set_ended/",
      header: {
        "Authorization": app.globalData.token
      },
      method: "POST",
      complete: (res) => {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }
        else {
          let temp = "activities[" + i + "].is_ended"
          _this.setData({
            [temp]: true
          })
        }
      }
    })
  },
  deleteAct:function(i){
    let _this = this;
    wx.request({
      url: app.globalData.url + '/activity/activities/' + _this.data.activities[i].acturl + "/",
      header: {
        "Authorization": app.globalData.token
      },
      method:"DELETE",
      complete:(res)=>{
        if(res.statusCode!=204){
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }
        else{
          let temp = _this.data.activities;
          temp.splice(i, 1);
          _this.setData({
            activities: temp
          })
        }
      }
    })
  }
})

