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
    loading: false,
    focusKeyBoard:false
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
  focusInput(){
    this.setData({
      focusKeyBoard:true
    })
  },
  blurInput(){
    this.setData({
      focusKeyBoard:false
    })
  },
  login: function () {
    let _this = this;
    if (this.data.number == "" || this.data.pwd == "") {
      this.setData({
        alert: "不能为空"
      })
      return;
    }
    if (!this.judge()) {
      return;
    }
    const pattern = /^\d{8}$/; //八位数字
    _this.setData({
      loading: true
    })
    var p1 = new Promise(function (resolve, reject) {
      //学生登录
      if (_this.number(_this.data.number) == true) {
        wx.request({
          url: app.globalData.url + '/account/students/login/',
          method: "POST",
          data: {
            j_username: _this.data.number,
            j_password: base64.encode(_this.data.pwd)
          },
          complete: (res) => {
            if (res.data == 'SNO verification failed') {
              _this.setData({
                alert: "账号或密码错误",
                loading: false
              })
              reject("fail")
            }
            // 网络请求失败
            else if (res.statusCode != 200) {
              reject("fail")
              _this.setData({
                loading:false
              })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
            }
            else {
              wx.clearStorageSync();
              wx.setStorageSync(md5.hex_md5("token"), res.data.token);
              wx.setStorageSync(md5.hex_md5("user_url"), res.data.profile_url);
              wx.removeStorageSync(md5.hex_md5("org_url"));
              if (res.data.is_ulife_your_daddy == 'yes') {
                wx.setStorageSync(md5.hex_md5("admin"), "true");
                app.globalData.type = "admin";
              }
              else
                app.globalData.type = "student";
              app.globalData.isLogin = true;
              resolve("success")
            }
          }
        })
      }
      // 组织登录
      else {
        wx.request({
          url: app.globalData.url + '/account/org-login/',
          method: "POST",
          data: {
            username: _this.data.number,
            password: base64.encode(_this.data.pwd)
          },
          complete: (res) => {
            if (res.data.non_field_errors == "Unable to log in with provided credentials.") {
              _this.setData({
                alert: "账号或密码错误",
                loading:false
              })
              reject("fail")
            }
            // 网络请求问题
            else if (res.statusCode != 200) {
              reject("fail")
              _this.setData({
                loading: false
              })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
            }
            else {
              wx.clearStorageSync();
              wx.setStorageSync(md5.hex_md5("token"), res.data.token);
              wx.setStorageSync(md5.hex_md5("org_url"), res.data.profile_url);
              wx.removeStorageSync(md5.hex_md5("user_url"));
              app.globalData.type="org";
              app.globalData.isLogin = true;
              resolve("success")
            }
          }
        })
      }
    })
    p1.then(function (results) {
      let url0, url1;
      url0 = wx.getStorageSync(md5.hex_md5("user_url"))
      url1 = wx.getStorageSync(md5.hex_md5("org_url"));
      app.globalData.token = (wx.getStorageSync(md5.hex_md5("token")) == "" ? "" : "Token " + wx.getStorageSync(md5.hex_md5("token")));
      app.globalData.avatar = wx.getStorageSync(md5.hex_md5("avatar"));
      let p3 = new Promise(function (resolve, reject) {
        if (url0 != "") {
          var admin = wx.getStorageSync(md5.hex_md5("admin"));
          if (admin != "")
            app.globalData.type = "student";
          else if (admin == "true")
            app.globalData.type = "admin";
          // 普通用户
          wx.request({
            url: app.globalData.url + '/account/students/get_toolbar/',
            header: {
              "Authorization": app.globalData.token
            },
            complete: (res) => {

              if (res.data.detail == "Token has expired" || res.data.detail == "Invalid token") {
                app.globalData.type = "none";
                wx.clearStorageSync();
                reject("fail")
                _this.setData({
                  loading: false
                })
              } else if (res.statusCode != 200) {
                reject("fail")
                _this.setData({
                  loading: false
                })
                wx.showToast({
                  title: '网络传输故障',
                  image: '/images/about.png'
                })
              } else {
                app.globalData.isLogin = true;
                app.globalData.uid = res.data.user;
                wx.setStorageSync(md5.hex_md5("uid"), res.data.user);
                app.globalData.inbox_count = res.data.inbox_count;
                app.globalData.avatar = app.globalData.url + res.data.avatar + '.thumbnail.3.jpg';
                wx.setStorageSync(md5.hex_md5("avatar"), app.globalData.avatar);
                app.globalData.name = res.data.nickname;
                wx.setStorageSync(md5.hex_md5("name"), res.data.nickname);
                resolve("success")
              }
            }
          })
        }
        else if (url1 != "") {
          // 组织用户
          app.globalData.type = "org";
          wx.request({
            url: app.globalData.url + '/account/orgs/get_toolbar/',
            header: {
              "Authorization": app.globalData.token
            },
            complete: function (res) {
              if (res.data.detail == "Token has expired" || res.data.detail == "Invalid token") {
                app.globalData.type = "none";
                wx.clearStorageSync();
                reject("fail")
                _this.setData({
                  loading: false
                })
              } else if (res.statusCode != 200) {
                reject("fail")
                _this.setData({
                  loading: false
                })
                wx.showToast({
                  title: '网络传输故障',
                  image: '/images/about.png'
                })
              } else {
                app.globalData.isLogin = true;
                wx.setStorageSync(md5.hex_md5("uid"), res.data.user);
                app.globalData.uid = res.data.user;
                app.globalData.inbox_count = res.data.inbox_count;
                app.globalData.avatar = app.globalData.url + res.data.avatar + '.thumbnail.3.jpg';
                wx.setStorageSync(md5.hex_md5("avatar"), app.globalData.avatar);
                app.globalData.name = res.data.org_name;
                wx.setStorageSync(md5.hex_md5("name"), app.globalData.org_name);
                resolve("success")
              }
            }
          })
        }
      })
      p3.then(function(results){
        _this.setData({
          loading: false
        })
        wx.navigateBack({
          delta: 1
        })
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
          app.globalData.isLogin = false;
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
