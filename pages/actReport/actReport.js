//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading: false,
    reportContent: "",
    id: 0,
    placeHolder:false,
    btnLoading:false
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
      id: options.actId
    })
  },
  confirm: function () {
    let _this = this;
    if(_this.data.reportContent.length==0){
      wx.showToast({
        title: '举报内容为空',
        image: '/images/about.png'
      })
    }
    if (app.globalData.isLogin == false) {
      wx.showToast({
        title: '请先登录账号',
        image: "/images/about.png"
      })
      return;
    }
    _this.setData({
      btnLoading: true
    })
    wx.request({
      url: app.globalData.url + '/activity/activities/' + _this.data.id + '/jubao/',
      method: "POST",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        index: _this.data.reportContent
      },
      complete: (res) => {
        if(res.statusCode!=200){
          _this.setData({
            btnLoading: false
          })
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }
        else{
          _this.setData({
            btnLoading: false
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  inputContent: function (e) {
    if(e.detail.value=="")
      this.setData({
        placeHolder:false
      })
    else
      this.setData({
        placeHolder: true
      })
    this.setData({
      reportContent: e.detail.value
    })
  },
  bindFocus:function(){
    this.setData({
      placeHolder: true
    })
  }
})

