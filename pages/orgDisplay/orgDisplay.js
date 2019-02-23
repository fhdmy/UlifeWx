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
    shareImg:"",
    watch: 0,
    star: 2,
    actNum: 0,
    lists: [],
    activities:[],
    hasWatched: false,
    watchUrl:"",
    moremyacts: "",
    presentmyacts: 0,
    myactsmax: 0
  },
  onShareAppMessage: function (options) {
    return {
      title: this.data.org,  // 转发标题（默认：当前小程序名称）
      path: '/pages/orgDisplay/orgDisplay?orgId=' + this.data.orgId, // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
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
  onLoad: function(options) {
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
    let p1 = new Promise(function(resolve, reject) {
      wx.request({
        url: app.globalData.url + '/account/org-visitor-homepage/' + options.orgId + '/',
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
          } else {
            _this.data.shareImg=app.globalData.url + res.data.bg_img + '.thumbnail.0.jpg'
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
              title: '网络传输故障',
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
    let p3=new Promise(function(resolve,reject){
      wx.request({
        url: app.globalData.url + '/activity/activities/?owner=' + options.orgId + '&is_published=True',
        header: {
          "Authorization": app.globalDatatoken
        },
        complete:(res)=>{
          if(res.statusCode!=200){
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            resolve(3)
          }else{
            for (let k = 0; k < res.data.results.length; k++) {
              let computeddate = res.data.results[k].start_at.split('T');
              let ac="activities["+k+"]";
              _this.setData({
                [ac]:{
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
            _this.data.moremyacts = res.data.next
            _this.data.presentmyacts = res.data.results.length
            _this.data.myactsmax = res.data.count
            resolve(3)
          }
        }
      })
    })
    Promise.all([p1,p2,p3]).then(function(results) {
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
  towatch: function() {
    let _this=this;
    if (app.globalData.isLogin==false){
      wx.showToast({
        title: '请先登录账号',
        image: "/images/about.png"
      })
      return;
    }
    if(app.globalData.type=='org'){
      wx.showModal({
        title: '关注无效',
        content: '组织不能进行关注',
        showCancel: false
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
                title: '网络传输故障',
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
                title: '网络传输故障',
                image: '/images/about.png'
              })
              reject(3)
            }
            else{
              _this.data.watchUrl=res.data.id
              _this.setData({
                hasWatched:true
              })
              wx.showToast({
                title: '关注成功'
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
  },
  previewImg: function (e) {
    let id = e.target.id
    wx.previewImage({
      current: app.globalData.url + this.data.lists[e.target.id].inner, // 当前显示图片的http链接
      urls: [app.globalData.url + this.data.lists[e.target.id].inner] // 需要预览的图片http链接列表
    })
  },
  scrollBottom: function () {
    let _this = this;
    if (_this.data.myactsmax == _this.data.presentmyacts || _this.data.scroll == true)
      return;
    //更多活动
    _this.setData({
      loading: true,
      scroll: true
    })
    var pm = new Promise(function (resolve, reject) {
      wx.request({
        url: _this.data.moremyacts,
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
              let actner = "activities[" + parseInt(_this.data.presentmyacts + k) + "]";
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
            _this.data.moremyacts=res.data.next
            _this.data.presentmyacts+=res.data.results.length
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
  },
})