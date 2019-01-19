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
    loading: false
  },
  onLoad: function(options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    // 获得近期活动
    _this.setData({
      loading: true
    })
    let p1 = new Promise(function(resolve, reject) {
      wx.request({
        url: app.globalData.url + "/activity/activities/?ordering=-created_at&is_published=True",
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          // 网络请求问题
          if (res.statusCode != 200) {
            resolve(1);
          } else {
            for (let k = 0; k < res.data.results.length; k++) {
              // 设置数组
              var computeddate = res.data.results[k].start_at.split('T');
              var acontainer = "actcontainer[" + k + ']';
              _this.setData({
                [acontainer]: {
                  head_img: app.globalData.url + res.data.results[k].head_img + '.thumbnail.0.jpg',
                  heading: res.data.results[k].heading,
                  date: computeddate[0],
                  location: res.data.results[k].location,
                  orgavatar: app.globalData.url + res.data.results[k].owner.avatar + '.thumbnail.2.jpg',
                  isover: false,
                  acturl: res.data.results[k].id,
                  org_id: res.data.results[k].owner.id,
                  is_ended: res.data.results[k].is_ended
                },
                moreacts: res.data.next,
                presentacts: res.data.results.length,
                actmax: res.data.count
              });
            }
            resolve(1);
          }
        }
      });
    });
    // 获得滚播图片
    let p2 = new Promise(function(resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activity-homepaged/',
        head: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          // 网络请求问题
          if (res.statusCode != 200) {
            resolve(2);
          } else {
            for (let k = 0; k < res.data.length; k++) {
              var ccontainer = "carouselcontainer[" + k + "]";
              _this.setData({
                [ccontainer]: {
                  head_img: app.globalData.url + res.data[k].head_img + '.thumbnail.1.jpg',
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
    Promise.all([p1, p2]).then(function(results) {
      _this.setData({
        loading: false
      })
    })
  },
  openAct: function() {
    wx.navigateTo({
      url: '/pages/actShow/actShow',
    })
  }
})