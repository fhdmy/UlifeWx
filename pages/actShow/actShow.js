//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')
// var WxParse = require('../../utils/wxParse/wxParse.js');

Page({
  data: {
    globalUrl: app.globalData.url,
    navH: 0,
    loading: false,
    scroll: false,
    orgAvatar: "",
    orgName: "",
    orgId: 0,
    headImg: "",
    heading: "",
    describe: "",
    star: 2,
    date: "",
    time: "",
    location: "",
    hobby: "",
    type: "",
    requirement: [],
    select_name: true,
    select_phone_number: true,
    select_gender: true,
    select_college: true,
    select_grade: true,
    lists: [],
    linkhtml: "https://ulife.org.cn",
    ended: false,
    link: false,
    comment: [],
    morecomment: "",
    presentcomment: 0,
    commentmax: 0,
    collected: false,
    collectId: "",
    hasSignUp: false,
    actId: 0,
    teststyle: "",
    routerId: 0,
    filename: [],
    fileurl: []
  },
  onShow: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (app.globalData.actSignupSuccess == "ok") {
      this.setData({
        hasSignUp: true
      })
      wx.showToast({
        title: '报名成功',
      })
      app.globalData.actSignupSuccess = "";
    }
  },
  onShareAppMessage: function (options) {
    return {
      title: this.data.heading,  // 转发标题（默认：当前小程序名称）
      path: '/pages/actShow/actShow?actId='+this.data.actId, // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      imageUrl:this.data.headImg,
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
      navH: app.globalData.navbarHeight,
      // loading: true
    })
    let stuId = wx.getStorageSync(md5.hex_md5("user_url"));
    let orgId = wx.getStorageSync(md5.hex_md5("org_url"));
    if (app.globalData.type == "student" || app.globalData.type == "admin")
      _this.setData({
        routerId: stuId
      })
    else if (app.globalData.type == "org")
      _this.setData({
        routerId: orgId
      })
    let p1 = new Promise(function (resolve, reject) {
      // 获得活动
      wx.request({
        url: app.globalData.url + '/activity/activity-demo/' + options.actId + '/',
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
            let computedstart = res.data.start_at.split('T');
            let cst = computedstart[0].split("-");
            let comutedstarttime = computedstart[1].split(':');
            let info = JSON.parse(res.data.p_info);
            _this.data.actId=res.data.id
            _this.data.orgName=res.data.owner.org_name
            _this.setData({
              headImg: app.globalData.url + res.data.head_img + '.thumbnail.2.jpg',
              orgAvatar: app.globalData.url + res.data.owner.avatar + '.thumbnail.3.jpg',
              heading: res.data.heading,
              orgId: res.data.owner.id,
              date: (cst[1] + "/" + cst[2]),
              time: (comutedstarttime[0] + ':' + comutedstarttime[1]),
              describe: res.data.description,
              location: res.data.location,
              type: res.data._type,
              hobby: res.data.hobby,
              ended: res.data.is_ended,
              star: ((_this.data.is_ended == true) ? res.data.score : 2),
              link: res.data.link
            })
            _this.data.select_name=info[0]
            _this.data.select_phone=info[1]
            _this.data.select_gender=info[2]
            _this.data.select_college=info[3]
            _this.data.select_grade=info[4]
            _this.data.requirement = JSON.parse(res.data.requirement)
            if (!res.data.link)
              _this.setData({
                lists: JSON.parse(res.data.demonstration)
              })
            else
              _this.setData({
                linkhtml: JSON.parse(res.data.demonstration).linkhtml
              })
            if (res.data.file_uploaded.length != 0) {
              let file = JSON.parse(res.data.file_uploaded);
              for (let k = 0; k < file.length; k++) {
                let fu = "fileurl[" + k + "]"
                _this.setData({
                  [fu]: app.globalData.url + file[k]
                })
                let url = file[k];
                let name = url.split("/");
                let str = _this.data.actId + '_';
                let n = name[3].split(str);
                let fn = "filename[" + k + "]"
                _this.setData({
                  [fn]: n[1]
                })
              }
            }
            resolve(1);
          }
        }
      })
    })
    // 是否报名
    let pp = new Promise(function (resolve, reject) {
      if (app.globalData.type == "student" || app.globalData.type == "admin") {
        wx.request({
          url: app.globalData.url + '/activity/activities/' + options.actId + '/is_participated/',
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              // _this.setData({
              //   loading: false
              // })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              reject("pp")
            }
            else {
              _this.setData({
                hasSignUp: res.data == 'yes' ? true : false
              })
              resolve("pp")
            }
          }
        })
      } else {
        resolve("pp")
      }
    })
    // 是否收藏
    let pc = new Promise(function (resolve, reject) {
      if (app.globalData.type == "student" || app.globalData.type == "admin") {
        wx.request({
          url: app.globalData.url + '/activity/bookmarking-actdemo/?watcher=' + wx.getStorageSync(md5.hex_md5("user_url")) + '&target=' + options.actId,
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              // _this.setData({
              //   loading: false
              // })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              reject("pc")
            }
            else {
              _this.setData({
                collected: res.data.length == 0 ? false : true
              })
              if (_this.data.collected)
                _this.data.collectId=res.data[0].id
              resolve("pc")
            }
          }
        })
      } else {
        resolve(pc)
      }
    })
    // 获得评论
    p1.then(function (results) {
      var p2 = new Promise(function (resolve, reject) {
        if (_this.data.ended == true) {
          wx.request({
            url: app.globalData.url + '/activity/activities/' + options.actId + '/get_comment/',
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
                for (let k = 0; k < res.data.results.length; k++) {
                  let computeddate = res.data.results[k].commented_at.split('T');
                  let cl = "comment[" + k + "]";
                  _this.setData({
                    [cl]: {
                      index: res.data.results[k].index,
                      score: res.data.results[k].score,
                      avatar: app.globalData.url + res.data.results[k].commentator.avatar + '.thumbnail.3.jpg',
                      nickname: res.data.results[k].commentator.nickname,
                      id: res.data.results[k].commentator.id,
                      date: computeddate[0]
                    }
                  });
                }
                _this.data.morecomment=res.data.next
                _this.data.presentcomment=res.data.results.length
                _this.data.commentmax=res.data.count
                resolve(2);
              }
            }
          })
        } else resolve(2)
      })
      p2.then(function (results) {
        // _this.setData({
        //   loading: false
        // })
      })
    })
    // 添加历史浏览
    if (app.globalData.token != "") {
      wx.request({
        url: app.globalData.url + '/activity/browsering-histories/',
        header: {
          "Authorization": app.globalData.token
        },
        method: "POST",
        data: {
          watcher: parseInt(_this.data.routerId),
          target: parseInt(options.actId)
        },
        complete: (res) => {
          if (res.statusCode != 201 && res.statusCode!=200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
        }
      })
    }
  },
  toCollect: function () {
    let _this = this;
    if (app.globalData.type == 'org') {
      wx.showModal({
        title: '收藏无效',
        content: '组织不能收藏活动',
        showCancel: false,
        confirmColor: "#FE9246"
      })
      return;
    }
    else if (app.globalData.type == 'none') {
      wx.showToast({
        title: '请先登录账号',
        image: "/images/about.png"
      })
      return;
    }
    //关注
    if (!_this.data.collected) {
      wx.request({
        url: app.globalData.url + '/activity/bookmarkings/',
        method: "POST",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          watcher: parseInt(_this.data.routerId),
          target: parseInt(_this.data.actId)
        },
        complete: (res) => {
          if (res.statusCode != 201) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
          else {
            _this.setData({
              collectId: res.data.id,
              collected: true
            })
            wx.showToast({
              title: '收藏成功',
            })
          }
        }
      })
    }
    // 取消关注
    else {
      wx.request({
        url: app.globalData.url + '/activity/bookmarkings/' + _this.data.collectId + "/",
        method: "DELETE",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          watcher: parseInt(_this.data.routerId),
          target: parseInt(_this.data.actId)
        },
        complete: (res) => {
          if (res.statusCode != 204) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
          else {
            _this.setData({
              collected: false
            })
          }
        }
      })
    }
  },
  scrollBottom: function () {
    let _this = this;
    if (_this.data.commentmax == _this.data.presentcomment || _this.data.scroll == true)
      return;
    //更多活动
    _this.setData({
      loading: true,
      scroll: true
    })
    var pm = new Promise(function (resolve, reject) {
      wx.request({
        url: _this.data.morecomment,
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
              let computeddate = res.data.results[k].commented_at.split('T');
              let actner = "comment[" + parseInt(_this.data.presentcomment + k) + "]";
              _this.setData({
                [actner]: {
                  index: res.data.results[k].index,
                  score: res.data.results[k].score,
                  avatar: app.globalData.url + res.data.results[k].commentator.avatar + '.thumbnail.3.jpg',
                  nickname: res.data.results[k].commentator.nickname,
                  id: res.data.results[k].commentator.id,
                  date: computeddate[0]
                },
              })
            }
            _this.data.morecomment=res.data.next
            _this.data.presentcomment+=res.data.results.length
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
  reportAct: function () {
    wx.navigateTo({
      url: '/pages/actReport/actReport?actId=' + this.data.actId,
    })
  },
  openOrg: function (e) {
    wx.navigateTo({
      url: '/pages/orgDisplay/orgDisplay?orgId=' + this.data.orgId,
    })
  },
  openStu: function (e) {
    wx.navigateTo({
      url: '/pages/stuDisplay/stuDisplay?stuId=' + e.target.id,
    })
  },
  toSignup: function () {
    let _this = this;
    if (app.globalData.type == 'org') {
      wx.showModal({
        title: '报名无效',
        content: '组织不能报名活动',
        showCancel: false,
        confirmColor: "#FE9246"
      })
      return;
    }
    else if (app.globalData.type == 'none') {
      wx.showToast({
        title: '请先登录账号',
        image: '/images/about.png'
      })
      return;
    }
    else if (_this.data.ended) {
      wx.showToast({
        title: '活动已结束',
        image: '/images/about.png'
      })
      return;
    }
    // 取消报名
    if (_this.data.hasSignUp) {
      wx.showModal({
        content: '你确定要取消报名吗？',
        confirmText: '确定',
        cancelText: '取消',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.url + '/activity/activities/' + _this.data.actId + '/toggle_participation/',
              method: "POST",
              header: {
                "Authorization": app.globalData.token
              },
              complete: (res) => {
                if (res.statusCode != 200) {
                  wx.showToast({
                    title: '网络传输故障',
                    image: '/images/about.png'
                  })
                }
                else {
                  _this.setData({
                    hasSignUp: false
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('取消注销')
          }
        }
      })
    }
    else
      wx.navigateTo({
        url: '/pages/SignupHomepage/SignupHomepage?actId=' + _this.data.actId + "&select_name=" + _this.data.select_name + "&select_phone_number=" + _this.data.select_phone_number + "&select_gender=" + _this.data.select_gender + "&select_college=" + _this.data.select_college + "&select_grade=" + _this.data.select_grade + "&requirement=" + JSON.stringify(_this.data.requirement)
      })
  },
  previewImg: function (e) {
    let id = e.target.id
    wx.previewImage({
      current: app.globalData.url + this.data.lists[e.target.id].inner, // 当前显示图片的http链接
      urls: [app.globalData.url + this.data.lists[e.target.id].inner] // 需要预览的图片http链接列表
    })
  },
  openFile: function (e) {
    let _this = this;
    let fileUrl = _this.data.fileurl[e.currentTarget.id]
    _this.setData({
      loading: true
    })
    wx.downloadFile({
      url: fileUrl,
      header: {
        "Authorization": app.globalData.token
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }
        else {
          wx.openDocument({
            filePath: res.tempFilePath,
            success:(res)=>{
              _this.setData({
                loading: false
              })
            },
            fail:(error)=>{
              console.log(error);
              _this.setData({
                loading: false
              })
              wx.showToast({
                title: '打开文件失败',
                image: '/images/about.png'
              })
            }
          })
        }
      }
    })
  },
  openDescribe:function(){
    wx.showModal({
      title: this.data.heading,
      content: this.data.describe,
      showCancel:false,
      confirmColor: "#FE9246"
    })
  }
})