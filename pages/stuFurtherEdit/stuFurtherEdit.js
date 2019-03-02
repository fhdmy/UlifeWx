//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    headImg: "",
    judgeArray: ["是", "否"],
    publishWatch: "是",
    publishVisitor: "是",
    publishCollect: "是",
    publishHistory: "是",
    loading: false,
    btnLoading:false
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })

    // 发请求
    _this.data.userurl = wx.getStorageSync(md5.hex_md5("user_url"));
    wx.request({
      url: app.globalData.url + '/account/students/' + _this.data.userurl + '/',
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
            headImg: app.globalData.url + res.data.bg_img + '.thumbnail.1.jpg',
            publishWatch: (res.data.is_watched_orgs_public == true ? "是" : "否"),
            publishVisitor: (res.data.is_visitor_public == true ? "是" : "否"),
            publishCollect: (res.data.is_fav_public == true ? "是" : "否"),
            publishHistory: (res.data.is_history_public == true ? "是" : "否"),
            // loading: false
          })
        }
      }
    })
  },
  bindVistorChange(e) {
    this.setData({
      publishVisitor: this.data.judgeArray[e.detail.value]
    })
  },
  bindCollectChange: function (e) {
    this.setData({
      publishCollect: this.data.judgeArray[e.detail.value]
    })
  },
  bindWatchChange: function (e) {
    this.setData({
      publishWatch: this.data.judgeArray[e.detail.value]
    })
  },
  bindHistoryChange: function (e) {
    this.setData({
      publishHistory: this.data.judgeArray[e.detail.value]
    })
  },
  save: function () {
    let _this = this;
    _this.setData({
      btnLoading: true
    })
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        method: 'PUT',
        url: app.globalData.url + '/account/students/' + _this.data.userurl + '/',
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          is_fav_public: _this.data.publishCollect == "是" ? true : false,
          is_history_public: _this.data.publishHistory == "是" ? true : false,
          is_watched_orgs_public: _this.data.publishWatch == "是" ? true : false,
          is_visitor_public: _this.data.publishVisitor == "是" ? true : false
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            _this.setData({
              btnLoading: false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            reject(1)
          }
          else {
            resolve(1)
          }
        }
      })
    })
    let p2 = new Promise(function (resolve, reject) {
      if (_this.data.headImg.substr(0, app.globalData.url.length) == app.globalData.url) {
        resolve(2)
      } else {
        wx.uploadFile({
          url: app.globalData.url + '/account/user-bg-img-upload/',
          filePath: _this.data.headImg,
          name: 'file',
          header: {
            'Content-Type': 'multipart/form-data',
            "Authorization": app.globalData.token
          },
          complete: (r) => {
            if (r.statusCode != 201) {
              _this.setData({
                btnLoading: false
              })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              reject(2)
            }
            else {
              resolve(2)
            }
          }
        })
      }
    })
    Promise.all([p1, p2]).then(function (results) {
      _this.setData({
        btnLoading: false
      })
      wx.navigateBack({
        delta: 1
      })
    })
  },
  changeHeadImg: function () {
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
          headImg: res.tempFilePaths[0]
        })
      },
    })
  },
})

