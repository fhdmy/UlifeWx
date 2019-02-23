//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    actcontainer: [],
    carouselcontainer: [],
    moreacts: '',
    presentacts: 0,
    actmax: 0,
    loading: false,
    scroll:false
  },
  onShareAppMessage:function(options){
    return {
      title: 'Ulife',  // 转发标题（默认：当前小程序名称）
      path: '/pages/index/index', // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
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
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    _this.sendRequest();
  },
  sendRequest(){
    let _this=this;
    // 获得近期活动
    // _this.setData({
    //   loading: true
    // })
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + "/activity/activities/?ordering=-created_at&is_published=True",
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          // 网络请求问题
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            resolve(1);
          } else {
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              var computeddate = res.data.results[k].start_at.split('T');
              var acontainer = "actcontainer[" + k + ']';
              _this.setData({
                [acontainer]: {
                  head_img: app.globalData.url + res.data.results[k].head_img + '.thumbnail.2.jpg',
                  heading: res.data.results[k].heading,
                  date: computeddate[0],
                  location: res.data.results[k].location,
                  orgavatar: app.globalData.url + res.data.results[k].owner.avatar,
                  isover: false,
                  acturl: res.data.results[k].id,
                  org_id: res.data.results[k].owner.id,
                  is_ended: res.data.results[k].is_ended
                },
              });
              _this.data.moreacts = res.data.next
              _this.data.presentacts = res.data.results.length
              _this.data.actmax=res.data.count
            }
            resolve(1);
          }
        }
      });
    });
    // 获得滚播图片
    let p2 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activity-homepaged/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          // 网络请求问题
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            resolve(2);
          } else {
            for (let k = 0; k < res.data.length; k++) {
              var ccontainer = "carouselcontainer[" + k + "]";
              _this.setData({
                [ccontainer]: {
                  head_img: app.globalData.url + res.data[k].head_img + '.thumbnail.2.jpg',
                  number: k,
                  acturl: res.data[k].id,
                  heading: res.data[k].heading
                }
              });
            }
            resolve(2);
          }
        }
      })
    });
    Promise.all([p1, p2]).then(function (results) {
      // _this.setData({
      //   loading: false
      // })
    })
  },
  scrollBottom: function () {
    let _this=this;
    if(_this.data.actmax==_this.data.presentacts || _this.data.scroll==true)
      return;
    //更多活动
    _this.setData({
      loading:true,
      scroll:true
    })
    var pm = new Promise(function (resolve, reject) {
      wx.request({
        url: _this.data.moreacts,
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
              let actner = "actcontainer[" + parseInt(_this.data.presentacts + k) + "]";
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
            _this.data.moreacts=res.data.next
            _this.data.presentacts+=res.data.results.length
            resolve("pm");
          }
        }
      })
    })
    pm.then(function (results) {
      _this.setData({
        loading:false,
        scroll:false
      })
    })
  },
  openAct: function (e) {
    wx.navigateTo({
      url: '/pages/actShow/actShow?actId=' + e.target.id,
    })
  },
})