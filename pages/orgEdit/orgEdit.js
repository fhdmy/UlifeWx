//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')
var base64 = require('../../utils/base64.js')

Page({
  data: {
    navH: 0,
    loading:false,
    avatar:"",
    password:"",
    userurl:0,
    hiddenmodalput:true,
    oldPwd:"",
    newPwd:"",
    cfmPwd:""
  },
  onShow: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
    })
  },
  onLoad:function(){
    let _this=this;
    _this.setData({
      avatar:wx.getStorageSync(md5.hex_md5("avatar"))
    })
  },
  toFurtherInform:function(){
    wx.navigateTo({
      url: '/pages/orgABEdit/orgABEdit',
    })
  },
  toEditAreaNewPwd:function(){
    this.setData({
      hiddenmodalput:false,
      newPwd: "",
      oldPwd: "",
      cfmPwd:""
    })
  },
  inputOldPwd:function(e){
    this.setData({
      oldPwd: e.detail.value,
    })
  },
  inputNewPwd: function (e) {
    this.setData({
      newPwd: e.detail.value
    })
  },
  inputConfirm: function (e) {
    this.setData({
      cfmPwd: e.detail.value
    })
  },
  confirm:function(){
    let _this=this;
    if (_this.data.newPwd == _this.data.oldPwd){
      wx.showToast({
        title: '与旧密码一致',
        image: '/images/about.png'
      })
      return
    }
    if(_this.data.newPwd!=_this.data.cfmPwd){
      wx.showToast({
        title: '密码不一致',
        image: '/images/about.png'
      })
      return
    }
    let orgId=wx.getStorageSync(md5.hex_md5("org_url"));
    wx.request({
      url: app.globalData.url + '/account/orgs/change_password/',
      method:"POST",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        old_passwd: base64.encode(_this.data.oldPwd),
        new_passwd: base64.encode(_this.data.newPwd)
      },
      complete:function(res){
        if (res.data =="Password does not match"){
          wx.showToast({
            title: '旧密码不正确',
            image: '/images/about.png'
          })
        }
        else if(res.statusCode!=200){
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }else{
          _this.setData({
            hiddenmodalput: true,
            newPwd: "",
            oldPwd: "",
            cfmPwd: ""
          })
        }
      }
    })
  },
  cancel:function(){
    this.setData({
      hiddenmodalput: true,
      newPwd: "",
      oldPwd: "",
      cfmPwd: ""
    })
  },
  changeAvatar:function(){
    let _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let size = res.tempFiles[0].size;
        if (size > 10485760) {
          wx.showToast({
            title: '图片太大了',
            image: '/images/about.png'
          })
          return;
        }
        _this.setData({
          avatar: res.tempFilePaths[0]
        })
        wx.uploadFile({
          url: app.globalData.url +'/account/user-avatar-upload/',
          filePath: _this.data.avatar,
          name: 'file',
          header: {
            'Content-Type': 'multipart/form-data',
            "Authorization": app.globalData.token
          },
          complete:(res)=>{
            if (res.statusCode != 201) {
              _this.setData({
                loading: false
              })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
            }
            else {
              let data = JSON.parse(res.data)
              wx.setStorageSync(md5.hex_md5("avatar"), app.globalData.url + data.avatar)
              app.globalData.avatar = app.globalData.url + data.avatar
              wx.showToast({
                title: '更改成功',
              })
            }
          }
        })
      },
    })
  }
})

