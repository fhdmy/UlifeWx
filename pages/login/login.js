//index.js
//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')
var base64 = require('../../utils/base64.js')

Page({
  data: {
    navH: 0,
    alert: "",
    type: "login",
    number: "",
    pwd: "",
    loading:false
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    this.setData({
      type: options.type
    })
  },
  login: function () {
    let _this = this;
    if (this.data.number == "" || this.data.pwd == "") {
      this.setData({
        alert: "不能为空！"
      })
      return;
    }
    if (!this.judge()) {
      return;
    }
    const pattern = /^\d{8}$/; //八位数字
    _this.setData({
      loading:true
    })
    //学生登录
    if (this.number(this.data.number) == true) {
      var p1=new Promise(function(resolve,reject){
        wx.request({
          url: app.globalData.url + '/account/students/login/',
          method: "POST",
          data: {
            j_username: _this.data.number,
            j_password: base64.encode(_this.data.pwd)
          },
          complete: (res) => {
            console.log(res)
            resolve(1)
            if (res.data == 'SNO verification failed') {
              _this.setData({
                alert: "账号或密码错误！"
              })
            }
            // 网络请求失败
            else if (res.statusCode != 200) {

            }
            else {
              wx.clearStorageSync();
              wx.setStorageSync(md5.hex_md5("token"), res.data.token);
              wx.setStorageSync(md5.hex_md5("user_url"), res.data.profile_url);
              wx.removeStorageSync(md5.hex_md5("org_url"));
              if (res.data.is_ulife_your_daddy == 'yes') {
                wx.setStorageSync(md5.hex_md5("admin"), "true");
              }
              app.globalData.isLogin = true;
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    }
    // 组织登录
    else{
      var p2 = new Promise(function (resolve, reject) {
        wx.request({
          url: app.globalData.url + '/account/org-login/',
          method: "POST",
          data: {
            username: _this.data.number,
            password: base64.encode(_this.data.pwd)
          },
          complete: (res) => {
            resolve(2)
            console.log(res)
            if (res.data.non_field_errors == "Unable to log in with provided credentials.") {
              _this.setData({
                alert: "账号或密码错误！"
              })
            }
            // 网络请求问题
            else if (res.statusCode != 200) {

            }
            else {
              wx.clearStorageSync();
              wx.setStorageSync(md5.hex_md5("token"), res.data.token);
              wx.setStorageSync(md5.hex_md5("org_url"), res.data.profile_url);
              wx.removeStorageSync(md5.hex_md5("user_url"));
              app.globalData.isLogin = true;
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    }
    Promise.all([p1,p2]).then(function(results){
      _this.setData({
        loading:false
      })
    })
  },
  logout: function () {
    wx.showModal({
      content: '你真的想注销吗？',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          app.globalData.isLogin=false;
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {
          console.log('取消注销')
        }
      }
    })
  },
  bindNumber: function (e) {
    this.setData({
      number: e.detail.value
    })
    this.judge();
  },
  bindPwd: function (e) {
    this.setData({
      pwd: e.detail.value
    })
    this.judge();
  },
  judge: function () {
    var pattern = /^[0-9]*$/;
    if (pattern.test(this.data.number) == true && this.data.number.length != 8) {
      this.setData({
        alert: "请输入8位数字的学号！"
      })
      return false;
    }
    else if (this.data.pwd.length < 6) {
      this.setData({
        alert: "密码长度过短！"
      })
    }
    else {
      this.setData({
        alert: ""
      })
      return true;
    }
  },
  number: value => {
    const pattern = /^[0-9]*$/;
    var t;
    if (pattern.test(value) == false || value.length != 8)
      t = false;
    else
      t = true
    return t || '请输入8位数字的学号！';
  },
})
