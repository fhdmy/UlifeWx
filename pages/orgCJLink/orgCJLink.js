//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    focus: true,
    loading: false,
    content: "",
    createHeading: "",
    createHeadImg: "",
    createDate: "",
    createTime: "",
    createLocation: "",
    createType: "",
    createHobby: "",
    createDescribe: "",
    createRequires: "",
    createSelectArray: "",
    createLink: "",
    orgId: 0,
    linkhtml: "",
    p_info: [true, true, true, true, true],
    actId: -1,
    fileUrl: [],
    fileName: [],
    placeHolder:false
  },
  onShow: function (options) {
    if (app.globalData.createLink != "")
      this.setData({
        content: app.globalData.createLink
      })
    this.data.createHeading = app.globalData.createHeading
    this.data.createHeadImg = app.globalData.createHeadImg
    this.data.createDate = app.globalData.createDate
    this.data.createTime = app.globalData.createTime
    this.data.createLocation = app.globalData.createLocation
    this.data.createType = app.globalData.createType
    this.data.createHobby = app.globalData.createHobby
    this.data.createDescribe = app.globalData.createDescribe
    this.data.createRequires = app.globalData.createRequires
    this.data.createSelectArray = app.globalData.createSelectArray
    this.data.createLink = app.globalData.createLink
    if (app.globalData.createSelectArray){
      this.data.p_info[2] = app.globalData.createSelectArray[0].checked
      this.data.p_info[3] = app.globalData.createSelectArray[1].checked
      this.data.p_info[4] = app.globalData.createSelectArray[2].checked
    }
    if (app.globalData.createActId != -1)
      this.data.actId = app.globalData.createActId
    if (this.data.actId == -1)
      this.save(true,false,false);
    else
      this.save(true,false,true);
    app.globalData.actId = -1;
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
      orgId: wx.getStorageSync(md5.hex_md5("org_url"))
    })
  },
  save: function (autoSave,upLoad,hasActId) {
    let _this = this;
    if (_this.data.createHeading.length > 20 || _this.data.createHeading.length == 0) {
      wx.showToast({
        title: '标题长度错误',
        image: '/images/about.png'
      })
      return;
    }
    let p1 = new Promise(function (resolve, reject) {
      if(hasActId==true){
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
              return;
            }
            else if (res.statusCode != 200) {
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              return;
            } else {
              _this.data.linkhtml = 'https://ulife.org.cn' + res.data.entry;
              resolve(1)
            }
          }
        })
      }
      else resolve(1)
    })
    p1.then(function () {
      let a = _this.data.createHeadImg.split("/")
      if (_this.data.createHeadImg == "/images/createdefault.jpg") {
        let head_img_url = "/static/default/createdefault.jpg";
        _this.saveMain(autoSave,head_img_url, upLoad, hasActId);
      }
      else if (a[2] == 'ulife.org.cn') {
        let b = _this.data.createHeadImg.split(app.globalData.url)
        let head_img_url = b[1]
        _this.saveMain(head_img_url, upLoad, autoSave);
      }
      else {
        wx.uploadFile({
          url: app.globalData.url + '/activity/act-head-img-upload/',
          filePath: _this.data.createHeadImg,
          name: 'file',
          header: {
            'Content-Type': 'multipart/form-data',
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusText == "Request Entity Too Large") {
              wx.showToast({
                title: '图片太大了',
                image: '/images/about.png'
              })
            }
            else if (res.statusCode != 201) {
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
            } else {
              let bgImg = JSON.parse(res.data)
              let head_img_url = bgImg.bg_img;
              _this.saveMain(autoSave,head_img_url, upLoad, hasActId);
            }
          }
        })
      }
    })
  },
  saveMain: function (autoSave,head_img_url, upLoad, hasActId) {
    let _this = this;
    // 正文
    let p3 = new Promise(function (resolve, reject) {
      let actId,actMethod;
      if (hasActId==true){
        actId = _this.data.actId+"/";
        actMethod="PUT"
      }
      else if (hasActId == false){
        actId ="";
        actMethod = "POST"
      }
      else{
        actId = _this.data.actId + "/";
        actMethod = "PUT"
      }
      wx.request({
        url: app.globalData.url + '/activity/activities/'+actId,
        method: actMethod,
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          start_at: _this.data.createDate + 'T' + _this.data.createTime + ':00.000000Z',
          location: _this.data.createLocation,
          _type: _this.data.createType,
          hobby: _this.data.createHobby,
          description: _this.data.createDescribe,
          owner: _this.data.orgId,
          heading: _this.data.createHeading,
          head_img: head_img_url,
          link: true,
          key: 0,
          // file_uploaded: JSON.stringify(tempfile),
          p_info: JSON.stringify(_this.data.p_info),
          demonstration: JSON.stringify({
            'linktext': _this.data.content,
            'linkhtml': _this.data.linkhtml
          }),
          requirement: JSON.stringify(_this.data.createRequires),
          version: '1.0.0',
        },
        complete: (res) => {
          if (res.statusCode != 201 && res.statusCode!=200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            reject(3)
          } else {
            _this.data.actId = res.data.id;
            if (upLoad==true)
              _this.uploadMain(head_img_url);
            else{
              if(autoSave==true)return;
              wx.showToast({
                title: '保存成功',
              })
              let timer = setTimeout(function () {
                wx.switchTab({
                  url: '/pages/StuOwn/StuOwn',
                })
              }, 3000)
            }   
          }
        }
      })
    })
  },
  uploadFile: function () {
    wx.showModal({
      title: '该功能暂不支持',
      content: '请在Ulife网页版上进行操作',
      showCancel: false
    })
  },
  uploadMain: function (head_img_url){
    let _this=this;
    // 删除空的选项框
    for (let u = 0; u < _this.data.createRequires.length; u++) {
      if (_this.data.createRequires[u].type == 'text' && _this.data.createRequires[u].inner == '') {
        _this.data.createRequires.splice(u, 1);
      } else if (_this.data.createRequires[u].type == 'select') {
        if (_this.data.createRequires[u].inner.length == 0 || _this.data.createRequires[u].title == '') {
          _this.data.createRequires.splice(u, 1);
          continue;
        }
        for (let m = 0; m < _this.data.createRequires[u].inner.length; m++) {
          if (_this.data.createRequires[u].inner[m] == '') {
            _this.data.createRequires[u].inner.splice(m, 1);
          }
        }
      }
    }
    // 草稿箱发表活动
    let publishUrl,puMethod;
    if (app.globalData.createIsPublish==true){
      publishUrl="/"
      puMethod="PUT"
    } else if (app.globalData.createIsPublish == false){
      publishUrl = "/want_to_be_allowed_to_publish/"
      puMethod="POST"
    }
    else{
      publishUrl = "/want_to_be_allowed_to_publish/"
      puMethod = "POST"
    }
    wx.request({
      url: app.globalData.url + '/activity/activities/' + _this.data.actId +publishUrl,
      method:puMethod,
      header: {
        "Authorization": app.globalData.token
      },
      data:{
        start_at: _this.data.createDate + 'T' + _this.data.createTime + ':00.000000Z',
        location: _this.data.createLocation,
        _type: _this.data.createType,
        hobby: _this.data.createHobby,
        description: _this.data.createDescribe,
        owner: _this.data.orgId,
        heading: _this.data.createHeading,
        head_img: head_img_url,
        link: true,
        key: 0,
        // file_uploaded: JSON.stringify(tempfile),
        p_info: JSON.stringify(_this.data.p_info),
        demonstration: JSON.stringify({
          'linktext': _this.data.content,
          'linkhtml': _this.data.linkhtml
        }),
        requirement: JSON.stringify(_this.data.createRequires),
        version: '1.0.0',
      },
      complete:(res)=>{
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        } else {
          wx.showToast({
            title: '上传成功',
          })
          let timer = setTimeout(function(){
            wx.switchTab({
              url: '/pages/StuOwn/StuOwn',
            })
          },3000)
        }
      }
    })
  },
  upload: function () {
    let _this = this;
    if (_this.data.createDate == "" || _this.data.createTime == '' || _this.data.createLocation == '' || _this.data.createType == '' || _this.data.createHobby == '' || _this.data.createDescribe == '') {
      wx.showToast({
        title: '信息不完整',
        image: '/images/about.png'
      })
      return;
    }
    let upLoad=true;
    let hasActId=true;
    let autoSave=true;
    _this.save(autoSave,upLoad, hasActId);
  },
  inputContent: function (e) {
    if (e.detail.value=="")
      this.setData({
        placeHolder:false
      })
    else
      this.setData({
        placeHolder:true
      })
    this.setData({
      content: e.detail.value
    })
    app.globalData.createLink=this.data.content;
  },
  bindFocus:function(){
    this.setData({
      placeHolder:true
    })
  }
})

