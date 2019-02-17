//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    loading: false,
    activities: [],
    moresignupacts :"",
    presentsignup :0,
    signupmax :0,
    scroll: false
  },
  onLoad: function (options) {
    let _this = this;
    let id = wx.getStorageSync(md5.hex_md5("user_url"));
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading:true
    })
    let p1=new Promise(function(resolve,reject){
      wx.request({
        url: app.globalData.url + '/activity/participations/?student=' + id + '&activity__is_ended=False',
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
          else{
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              let computeddate = res.data.results[k].activity.start_at.split('T');
              let sacts ="activities["+k+"]";
              _this.setData({
                [sacts]:{
                  head_img: app.globalData.url + res.data.results[k].activity.head_img + '.thumbnail.2.jpg',
                  heading: res.data.results[k].activity.heading,
                  date: computeddate[0],
                  location: res.data.results[k].activity.location,
                  orgavatar: app.globalData.url + res.data.results[k].activity.owner.avatar,
                  isover: false,
                  acturl: res.data.results[k].activity.id,
                  org_id: res.data.results[k].activity.owner.id,
                  is_ended: res.data.results[k].activity.is_ended,
                }
              })
            }
            _this.setData({
              moresignupacts : res.data.next,
              presentsignup : res.data.results.length,
              signupmax : res.data.count
            })
            resolve(1)
          }
        }
      })
    })
    p1.then(function(results){
      _this.setData({
        loading:false
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
              var computeddate = res.data.results[k].activity.start_at.split('T');
              let actner = "activities[" + parseInt(_this.data.presentsignup + k) + "]";
              _this.setData({
                [actner]: {
                  head_img: app.globalData.url + res.data.results[k].activity.head_img + '.thumbnail.2.jpg',
                  heading: res.data.results[k].activity.heading,
                  date: computeddate[0],
                  location: res.data.results[k].activity.location,
                  orgavatar: app.globalData.url + res.data.results[k].activity.owner.avatar,
                  isover: false,
                  acturl: res.data.results[k].activity.id,
                  org_id: res.data.results[k].activity.owner.id,
                  is_ended: res.data.results[k].activity.is_ended,
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
})

