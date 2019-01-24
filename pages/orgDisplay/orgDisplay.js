//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

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
    hasWatched: false,
    watchUrl:""
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
          } else {
            _this.setData({
              headImg: app.globalData.url + res.data.bg_img + '.thumbnail.2.jpg',
              orgAvatar: app.globalData.url + res.data.avatar + '.thumbnail.3.jpg',
              org: res.data.org_name,
              watch: res.data.watcher_count,
              stars: res.data.stars,
              actNum: res.data.activity_count,
              orgId: options.orgId,
              lists: JSON.parse(res.data.demonstration)
            })
            resolve(1)
          }
        }
      })
    })
    // 是否关注
    let p2 = new Promise(function (resolve, reject) {
      let stuId=wx.getStorageSync(md5.hex_md5("user_url"));
      wx.request({
        url: app.globalData.url + '/account/watching-status/?watcher=' + stuId + '&target=' + options.orgId,
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
          } else {
            if (res.data.length == 0) {
              // 未关注
              _this.setData({
                hasWatched:false
              })
            } else {
              // 关注了
              _this.setData({
                watchUrl: res.data[0].id,
                hasWatched: true
              })
            }
            resolve(2)
          }
        }
      })
    })
    Promise.all([p1,p2]).then(function(results) {
      // 添加访客
      if (app.globalData.token != "" && app.globalData.uid != _this.data.orgId) {
        wx.request({
          url: app.globalData.url + '/message/visitings/',
          method: "POST",
          header: {
            "Authorization": app.globalData.token
          },
          data: {
            'watcher': app.globalData.uid,
            'target': _this.data.orgId
          },
          complete: (res) => {
            if(res.statusCode!=201){
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
            }
          }
        })
      }
      _this.setData({
        loading: false
      })
    })
  },
  towatch: function() {
    let _this=this;
    if (app.globalData.isLogin==false){
      wx.showToast({
        title: '请先登录Ulife账号！',
        image: "/images/about.png"
      })
      return;
    }
    let p3=new Promise(function(resolve,reject){
      // 取消关注
      if (_this.data.hasWatched == true) {
        wx.request({
          url: app.globalData.url+'/account/watchings/'+_this.data.watchUrl,
          method:"DELETE",
          header: {
            "Authorization": app.globalData.token
          },
          complete:(res)=>{
            console.log(res)
            if(res.statusCode!=204){
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
              reject(3)
            }else{
              _this.setData({
                hasWatched: false
              })
              resolve(3)
            }
          }
        })
      }
      // 进行关注
      else {
        let stuId = wx.getStorageSync(md5.hex_md5("user_url"));
        wx.request({
          url: app.globalData.url +'/account/watchings/',
          method:"POST",
          header: {
            "Authorization" : app.globalData.token
          },
          data:{
            'watcher': stuId,
            'target': _this.data.orgId
          },
          complete:(res)=>{
            if(res.statusCode!=201){
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
              reject(3)
            }
            else{
              _this.setData({
                watchUrl: res.data.id,
                hasWatched:true
              })
              wx.showToast({
                title: '关注成功！'
              })
              resolve(3)
            }
          }
        })
      }
    })
    // p3.then(function(results){

    // })
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