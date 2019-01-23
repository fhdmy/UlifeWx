//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')
var WxParse = require('../../utils/wxParse/wxParse.js');

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
    select_name:true,
    select_phone_number:true,
    select_gender:true,
    select_college: true,
    select_grade: true,
    lists: [],
    linkhtml: "",
    ended: false,
    link: false,
    comment: [],
    morecomment:"",
    presentcomment:0,
    commentmax:0,
    collected: false,
    collectId:"",
    hasSignUp: false,
    actId:0,
    teststyle:"",
    testhtml:"",
    routerId:0,
  },
  onShow:function(options){
    if (app.globalData.actSignupSuccess=="ok"){
      this.setData({
        hasSignUp:true
      })
      app.globalData.actSignupSuccess="";
    }
  },
  onLoad: function(options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading: true
    })
    let stuId = wx.getStorageSync(md5.hex_md5("user_url"));
    let orgId = wx.getStorageSync(md5.hex_md5("org_url"));
    if (app.globalData.type=="student" || app.globalData.type=="admin")
      _this.setData({
        routerId:stuId
      })
    else if (app.globalData.type == "org")
      _this.setData({
        routerId: orgId
      })
    let p1 = new Promise(function(resolve, reject) {
      // 获得活动
      wx.request({
        url: app.globalData.url + '/activity/activity-demo/' + options.actId + '/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            resolve(1)
          } else {
            let computedstart = res.data.start_at.split('T');
            let cst = computedstart[0].split("-");
            let comutedstarttime = computedstart[1].split(':');
            let info = JSON.parse(res.data.p_info);
            _this.setData({
              actId:res.data.id,
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
              select_name : info[0],
              select_phone_number : info[1],
              select_gender : info[2],
              select_college : info[3],
              select_grade : info[4]
            })
            if (!res.data.link)
              _this.setData({
                lists: JSON.parse(res.data.demonstration)
              })
            else
              _this.setData({
                linkhtml: JSON.parse(res.data.demonstration).linkhtml
              })
            resolve(1);
          }
        }
      })
    })
    // 是否报名
    let pp=new Promise(function(resolve,reject){
      if(app.globalData.type=="student" || app.globalData.type=="admin"){
        wx.request({
          url: app.globalData.url + '/activity/activities/' +options.actId+'/is_participated/',
          header: {
            "Authorization":app.globalData.token
          },
          complete:(res)=>{
            if(res.statusCode!=200){
              _this.setData({
                loading:false
              })
              reject("pp")
            }
            else{
              _this.setData({
                hasSignUp: res.data=='yes'?true:false
              })
              resolve("pp")
            }
          }
        })
      }else{
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
      }else{
        resolve(pc)
      }
    })
    // 获得评论
    p1.then(function(results) {
      var p2 = new Promise(function(resolve, reject) {
        if (_this.data.ended == true) {
          wx.request({
            url: app.globalData.url + '/activity/activities/' + options.actId + '/get_comment/',
            header: {
              "Authorization": app.globalData.token
            },
            complete: (res) => {
              if (res.statusCode != 200) {
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
                  morecomment : res.data.next,
                  presentcomment : res.data.results.length,
                  commentmax : res.data.count
                })
                resolve(2);
              }
            }
          })
        } else resolve(2)
      })
      var html = `
        <!DOCTYPE html>
<html>
<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <script nonce="368111801" type="text/javascript">
        window.logs = {
            pagetime: {}
        };
        window.logs.pagetime['html_begin'] = (+new Date());
    </script>
    <style>
        .a {
            color: red;
        }
    </style>
</head>
<body>
    <p class="a">这是一个红色的文字</p>
    <script>
      window.logs = {
            pagetime: {}
        };
        window.logs.pagetime['html_begin'] = (+new Date());
    </script>
</body>
</html>
      ` 
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
      //     console.log(richText)
      //     WxParse.wxParse("article",'html',richText,_this,0)
      //   }
      // })
      p2.then(function(results) {
        _this.setData({
          loading: false
        })
      })
    })
    // 添加历史浏览
    if(app.globalData.token!=""){
      wx.request({
        url: app.globalData.url + '/activity/browsering-histories/',
        header: {
          "Authorization": app.globalData.token
        },
        method:"POST",
        data:{
          watcher: parseInt(_this.data.routerId),
          target: parseInt(options.actId)
        },
        complete:(res)=>{
          if(res.statusCode!=201){
            
          }
        }
      })
    }
  },
  toCollect: function() {
    let _this=this;
    if (app.globalData.type == 'org') {
      wx.showToast({
        title: '组织不能收藏活动！',
      })
      return;
    }
    else if (app.globalData.type == 'none') {
      wx.showToast({
        title: '请先登录！',
      })
      return;
    }
    _this.setData({
      loading:true
    })
    //关注
    if(!_this.data.collected){
      wx.request({
        url: app.globalData.url +'/activity/bookmarkings/',
        method:"POST",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          watcher: parseInt(_this.data.routerId),
          target: parseInt(_this.data.actId)
        },
        complete:(res)=>{
          if(res.statusCode!=201)
            _this.setData({
              loading:false
            })
          else
            _this.setData({
              loading:false,
              collected:true
            })
        }
      })
    }
    // 取消关注
    else{
      wx.request({
        url: app.globalData.url + '/activity/bookmarkings/'+_this.data.collectId+"/",
        method: "DELETE",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          watcher: parseInt(_this.data.routerId),
          target: parseInt(_this.data.actId)
        },
        complete: (res) => {
          if(res.statusCode!=204)
            _this.setData({
              loading:false
            })
          else
            _this.setData({
              loading:false,
              collected:false
            })
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
  reportAct: function() {
    wx.navigateTo({
      url: '/pages/actReport/actReport?actId='+this.data.actId,
    })
  },
  openOrg: function(e) {
    wx.navigateTo({
      url: '/pages/orgDisplay/orgDisplay',
    })
  },
  openStu: function(e) {
    wx.navigateTo({
      url: '/pages/stuDisplay/stuDisplay?stuId=' + e.target.id,
    })
  },
  toSignup:function(){
    let _this = this;
    if(app.globalData.type=='org'){
      wx.showToast({
        title: '组织不能报名活动！',
      })
      return;
    }
    else if (app.globalData.type == 'none') {
      wx.showToast({
        title: '请先登录！',
      })
      return;
    }
    // 取消报名
    if(_this.data.hasSignUp){
      wx.showModal({
        content: '你确定要取消报名吗？',
        confirmText: '确定',
        cancelText: '取消',
        success(res) {
          if (res.confirm) {
            _this.setData({
              loading: true
            })
            wx.request({
              url: app.globalData.url + '/activity/activities/' + _this.data.actId + '/toggle_participation/',
              method: "POST",
              header: {
                "Authorization": app.globalData.token
              },
              complete: (res) => {
                console.log(res)
                _this.setData({
                  loading:false
                })
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
  }
})