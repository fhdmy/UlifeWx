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
    if (app.globalData.actSignupSuccess == "ok") {
      this.setData({
        hasSignUp: true
      })
      wx.showToast({
        title: '报名成功！',
      })
      app.globalData.actSignupSuccess = "";
    }
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading: true
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
              title: '网络传输故障！',
              image: '/images/about.png'
            })
            resolve(1)
          } else {
            let computedstart = res.data.start_at.split('T');
            let cst = computedstart[0].split("-");
            let comutedstarttime = computedstart[1].split(':');
            let info = JSON.parse(res.data.p_info);
            _this.setData({
              actId: res.data.id,
              headImg: app.globalData.url + res.data.head_img + '.thumbnail.2.jpg',
              orgAvatar: app.globalData.url + res.data.owner.avatar + '.thumbnail.3.jpg',
              orgName: res.data.owner.org_name,
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
              link: res.data.link,
              requirement: JSON.parse(res.data.requirement),
              select_name: info[0],
              select_phone_number: info[1],
              select_gender: info[2],
              select_college: info[3],
              select_grade: info[4]
            })
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
              _this.setData({
                loading: false
              })
              wx.showToast({
                title: '网络传输故障！',
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
              _this.setData({
                loading: false
              })
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
              reject("pc")
            }
            else {
              _this.setData({
                collected: res.data.length == 0 ? false : true
              })
              if (_this.data.collected)
                _this.setData({
                  collectId: res.data[0].id
                })
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
                  title: '网络传输故障！',
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
                _this.setData({
                  morecomment: res.data.next,
                  presentcomment: res.data.results.length,
                  commentmax: res.data.count
                })
                resolve(2);
              }
            }
          })
        } else resolve(2)
      })
      // wx.request({
      //   url: 'https://ulife.org.cn/static/weixin/vpij7tdrdd3c7i0yt6w9d148y57dl2da/entry.html',
      //   complete:(res)=>{
      //     var html=res.data;
      //     var body="";
      //     var bodySplit = html.split("<body");
      //     var nextBodySplit=bodySplit[1].split(">");
      //     var before = nextBodySplit[0];
      //     var wb=bodySplit[1].split(before+">");
      //     var hBody = wb[1].split("</body>");
      //     body = hBody[0]
      //     var scriptSplit=body.split("<script");
      //     var beforeScript = scriptSplit[0];
      //     var linkText=beforeScript;
      //     for(let i=1;i<scriptSplit.length;i++){
      //       var afterSplit = scriptSplit[i].split("</script>");
      //       var afterScript=afterSplit[1];
      //       linkText=linkText+afterScript;
      //     }
      //     var linkSplit=linkText.split("<link")
      //     var beforeLink=linkSplit[0];
      //     var richText=beforeLink;
      //     for (let i = 1; i < linkSplit.length; i++) {
      //       var aSplit = linkSplit[i].split("/>");
      //       var as = linkSplit[i].split(aSplit[0]+"/>");
      //       richText = richText + as[1];
      //     }
      //     let a=richText.split("<img")
      //     var srcText=a[0]
      //     for (let i = 1; i < a.length; i++) {
      //       let b = a[i].split(">");   
      //       let inner=b[0];
      //       let afi=a[i].split(inner)
      //       let pattern1 = /data-src=([' "])[^ ' "]*\1/;
      //       let dataSrc = inner.match(pattern1);
      //       if(dataSrc==null){
      //         srcText=srcText+"<img"+inner+afi[1];
      //       }
      //       else{
      //         let d=dataSrc[0]
      //         let dataInner='src="'+d.substr(10,d.length-11)+'"'
      //         let replaceInner=inner.replace(/src=([' "])[^ ' "]*\1/g, dataInner);
      //         srcText=srcText+"<img"+replaceInner+afi[1];
      //       }
      //     }
      //     WxParse.wxParse("article", 'html', srcText,_this,0)
      //   }
      // })
      p2.then(function (results) {
        _this.setData({
          loading: false
        })
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
          if (res.statusCode != 201) {
            wx.showToast({
              title: '网络传输故障！',
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
      wx.showToast({
        title: '组织不能收藏活动！',
      })
      return;
    }
    else if (app.globalData.type == 'none') {
      wx.showToast({
        title: '请先登录Ulife账号！',
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
              title: '网络传输故障！',
              image: '/images/about.png'
            })
          }
          else {
            _this.setData({
              collectId: res.data.id,
              collected: true
            })
            wx.showToast({
              title: '收藏成功！',
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
              title: '网络传输故障！',
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
              title: '网络传输故障！',
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
            _this.setData({
              morecomment: res.data.next,
              presentcomment: (res.data.results.length + _this.data.presentcomment)
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
      wx.showToast({
        title: '组织不能报名活动！',
        image: '/images/about.png'
      })
      return;
    }
    else if (app.globalData.type == 'none') {
      wx.showToast({
        title: '请先登录Ulife账号！',
        image: '/images/about.png'
      })
      return;
    }
    else if (_this.data.ended) {
      wx.showToast({
        title: '活动已结束！',
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
                    title: '网络传输故障！',
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
            title: '网络传输故障！',
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
                title: '打开文件失败！',
                image: '/images/about.png'
              })
            }
          })
        }
      }
    })
  }
})