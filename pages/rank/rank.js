//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    target: {
      org_id: 0,
      avatar: "",
      index: "",
      org_name: ""
    },
    org_rank: [],
    activity_rank: [],
    loading: false
  },
  onLoad: function(options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading:true
    })
    // 推荐组织
    let p1 = new Promise(function(resolve, reject) {
      wx.request({
        url: app.globalData.url + '/account/weeklyrecommendation/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          // 网络请求问题
          if (res.statusCode != 200) {
            resolve(1);
          } else {
            if (res.data != "No recommendation") {
              _this.setData({
                target: {
                  org_id: res.data.org.id,
                  avatar: app.globalData.url + res.data.org.avatar + '.thumbnail.2.jpg',
                  index: res.data.index,
                  org_name: res.data.org_name
                }
              })
            }
            resolve(1);
          }
        }
      })
    });
    let p2 = new Promise(function(resolve, reject) {
      // 组织排行榜
      wx.request({
        url: app.globalData.url + '/account/orgs/get_ranking/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          // 网络请求问题
          if (res.statusCode != 200) {
            resolve(2);
          } else {
            for (let j = 0; j < 5 && j < res.data.length; j++) {
              var orank = "org_rank[" + j + "]";
              _this.setData({
                [orank]: {
                  org_name: res.data[j].org_name,
                  stars: res.data[j].stars,
                  avatar: app.globalData.url + res.data[j].avatar + '.thumbnail.3.jpg',
                  org_id: res.data[j].id
                }
              });
            }
            resolve(2);
          }
        }
      })
    });
    let p3 = new Promise(function(resolve, reject) {
      // 活动排行榜
      wx.request({
        url: app.globalData.url + '/activity/activities/get_ranking/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          // 网络请求问题
          if (res.statusCode != 200) {
            resolve(3);
          } else {
            for (let k = 0; k < 9 && k < res.data.length; k++) {
              let computeddate = res.data[k].start_at.split('T');
              let acrank = "activity_rank[" + k + "]";
              _this.setData({
                [acrank]: {
                  head_img: app.globalData.url + res.data[k].head_img + '.thumbnail.0.jpg',
                  heading: res.data[k].heading,
                  date: computeddate[0],
                  location: res.data[k].location,
                  orgavatar: app.globalData.url + res.data[k].owner.avatar + '.thumbnail.2.jpg',
                  isover: false,
                  acturl: res.data[k].id,
                  org_id: res.data[k].owner.id,
                  is_ended: res.data[k].is_ended
                }
              });
            }
            resolve(3);
          }
        }
      })
    });
    Promise.all([p1,p2,p3]).then(function(){
      _this.setData({
        loading: false
      })
    })
  },
  openOrg: function(e) {
    wx.navigateTo({
      url: '/pages/orgDisplay/orgDisplay?orgId='+e.target.id,
    })
  }
})