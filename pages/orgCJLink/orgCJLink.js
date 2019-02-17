//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    focus: true,
    content: "",
  },
  onShow: function (options) {
    if (app.globalData.createLink != "")
      this.setData({
        content: app.globalData.createLink
      })
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
  },
  save: function () {
    let _this = this;
    let rtn=_this.getWeiXinUrl();
    if(!rtn)
      return;
  },
  upload: function () {
    let _this = this;
    let rtn =_this.getWeiXinUrl();
    if (!rtn)
      return;
  },
  getWeiXinUrl: function () {
    let _this = this;
    let p1=new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/weixin_scrapper/',
        method: "POST",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          url: _this.data.content
        },
        complete: (res) => {
          if (res.data == "Pls give me an url of Wechat Blog") {
            wx.showToast({
              title: '请输入微信推文的链接',
              image: '/images/about.png'
            })
            return false
          }
          else if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            return false
          } else {
            resolve(1)
          }
        }
      })
    })
    p1.then(function(){
      return true
    })
  },
  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  bindInputPicker: function (e) {
    this.setData({
      content: this.data.array[e.detail.value]
    })
  }
})

