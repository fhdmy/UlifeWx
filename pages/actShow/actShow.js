//获取应用实例
const app = getApp()
var WxParse = require('../../utils/wxParse/wxParse.js');

Page({
  data: {
    globalUrl: app.globalData.url,
    navH: 0,
    loading: false,
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
    lists: [],
    linkhtml: "",
    ended: false,
    link: false,
    comment: [],
    collected: false,
    hasSignUp: false,

    teststyle:"",
    testhtml:""
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
      // 获得活动
      wx.request({
        url: app.globalData.url + '/activity/activity-demo/' + options.actId + '/',
        headers: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            resolve(1)
          } else {
            let computedstart = res.data.start_at.split('T');
            let cst = computedstart[0].split("-");
            let comutedstarttime = computedstart[1].split(':');
            _this.setData({
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
              requirement: JSON.parse(res.data.requirement)
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
    // 获得评论
    p1.then(function(results) {
      var p2 = new Promise(function(resolve, reject) {
        if (_this.data.ended == true) {
          wx.request({
            url: app.globalData.url + '/activity/activities/' + options.actId + '/get_comment/',
            headers: {
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
      wx.request({
        url: 'https://ulife.org.cn/static/weixin/vpij7tdrdd3c7i0yt6w9d148y57dl2da/entry.html',
        complete:(res)=>{
          var html=res.data;
          var body="";
          var bodySplit = html.split("<body");
          var nextBodySplit=bodySplit[1].split(">");
          var before = nextBodySplit[0];
          var wb=bodySplit[1].split(before+">");
          var hBody = wb[1].split("</body>");
          body = hBody[0]
          var scriptSplit=body.split("<script");
          var beforeScript = scriptSplit[0];
          var linkText=beforeScript;
          for(let i=1;i<scriptSplit.length;i++){
            var afterSplit = scriptSplit[i].split("</script>");
            var afterScript=afterSplit[1];
            linkText=linkText+afterScript;
          }
          var linkSplit=linkText.split("<link")
          var beforeLink=linkSplit[0];
          var richText=beforeLink;
          for (let i = 1; i < linkSplit.length; i++) {
            var aSplit = linkSplit[i].split("/>");
            var as = linkSplit[i].split(aSplit[0]+"/>");
            richText = richText + as[1];
          }
          console.log(richText)
          WxParse.wxParse("article",'html',richText,_this,0)
        }
      })
      p2.then(function(results) {
        _this.setData({
          loading: false
        })
      })
    })
  },
  toCollect: function() {
    this.setData({
      collected: !this.data.collected
    })
  },
  reportAct: function() {
    wx.navigateTo({
      url: '/pages/actReport/actReport',
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
  }
})