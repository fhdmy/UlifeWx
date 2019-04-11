//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    loading: false,
    createHeadImg: "/images/createdefault.jpg",
    createHeading: "",
    createDate: "",
    createTime: "",
    createLocation: "",
    createType: "",
    createHobby: "",
    createDescribe: "",
    createRequires: "",
    createSelectArray: "",
    p_info: [true, true, true, true, true],
    actId: -1,
    orgId: 0,
    computeddata: [],
    cal: 0,
    key: 0,
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
      orgId: wx.getStorageSync(md5.hex_md5("org_url"))
    })
    if (app.globalData.createDemonstration != "") {
      let demon = app.globalData.createDemonstration
      for (let j = 0; j < demon.length; j++) {
        let a = demon[j].inner.split("/")
        if (demon[j].type == 'img' && a[2] != 'ulife.org.cn') {
          demon[j].inner = app.globalData.url + demon[j].inner
        }
      }
      _this.setData({
        computeddata: demon,
        key: demon.length,
        cal: demon.length
      })
    }
  },
  onShow: function (options) {
    let _this = this;
    if (app.globalData.orgCJEditContent != "") {
      // 更新标题
      if (app.globalData.orgCJEditType == 'title') {
        if (app.globalData.reeditIndex != -1) {
          let temp = "computeddata[" + app.globalData.reeditIndex + "].inner";
          _this.setData({
            [temp]: app.globalData.orgCJEditContent
          })
          _this.save(true, false);
        } else {
          let m = "computeddata[" + _this.data.cal + "]"
          _this.setData({
            [m]: {
              type: 'title',
              inner: app.globalData.orgCJEditContent,
              number: _this.data.cal,
              key: _this.data.key
            }
          })
          _this.data.key++;
          _this.data.cal++;
          _this.save(true, false);
        }
      } else if (app.globalData.orgCJEditType == 'text') {
        if (app.globalData.reeditIndex != -1) {
          let temp = _this.data.computeddata
          let index = app.globalData.reeditIndex
          let m = "computeddata[" + index + "]"
          _this.setData({
            [m]: {
              type: 'text',
              inner: app.globalData.orgCJEditContent,
              number: temp[index].number,
              key: temp[index].number,
              align: app.globalData.orgCJEditSetting.textAlign,
              color: app.globalData.orgCJEditSetting.color,
              text_decoration: app.globalData.orgCJEditSetting.textDecoration,
              font_weight: app.globalData.orgCJEditSetting.fontWeight,
              font_style: app.globalData.orgCJEditSetting.fontStyle
            }
          })
          _this.save(true, false);
        } else {
          let m = "computeddata[" + _this.data.cal + "]"
          _this.setData({
            [m]: {
              type: 'text',
              inner: app.globalData.orgCJEditContent,
              number: _this.data.cal,
              key: _this.data.key,
              align: app.globalData.orgCJEditSetting.textAlign,
              color: app.globalData.orgCJEditSetting.color,
              text_decoration: app.globalData.orgCJEditSetting.textDecoration,
              font_weight: app.globalData.orgCJEditSetting.fontWeight,
              font_style: app.globalData.orgCJEditSetting.fontStyle
            }
          })
          _this.data.key++;
          _this.data.cal++;
          _this.save(true, false);
        }
      }
      else if (app.globalData.orgCJEditType == 'sort') {
        _this.setData({
          computeddata: app.globalData.orgCJEditContent
        })
        _this.save(true, false);
      }
    }
    _this.setData({
      createHeading: app.globalData.createHeading,
      createHeadImg: app.globalData.createHeadImg
    })
    this.data.createDate = app.globalData.createDate
    this.data.createTime = app.globalData.createTime
    this.data.createLocation = app.globalData.createLocation
    this.data.createType = app.globalData.createType
    this.data.createHobby = app.globalData.createHobby
    this.data.createDescribe = app.globalData.createDescribe
    this.data.createRequires = app.globalData.createRequires
    this.data.createSelectArray = app.globalData.createSelectArray
    if (app.globalData.createSelectArray){
      this.data.p_info[2] = app.globalData.createSelectArray[0].checked
      this.data.p_info[3] = app.globalData.createSelectArray[1].checked
      this.data.p_info[4] = app.globalData.createSelectArray[2].checked
    }
    if (app.globalData.createActId != -1)
      this.data.actId = app.globalData.createActId

    app.globalData.reeditIndex = -1;
    app.globalData.orgCJEditType = "";
    app.globalData.orgCJEditContent = "";
    app.globalData.orgCJEditSetting = "";
    if (_this.data.actId == -1)
      this.createSave();
    app.globalData.actId = -1;
  },
  sort: function () {
    app.globalData.computeddata = this.data.computeddata;
    wx.navigateTo({
      url: '/pages/sort/sort',
    })
  },
  save: function (autoSave, upLoad) {
    let _this = this;
    if (_this.data.createHeading.length > 20 || _this.data.createHeading.length == 0) {
      wx.showToast({
        title: '标题长度错误',
        image: '/images/about.png'
      })
      return;
    }
    app.globalData.createDemonstration = _this.data.computeddata
    app.globalData.createCal=_this.data.cal;
    app.globalData.createKey=_this.data.key;
    // 图片上传
    var m = [];
    for (let i = 0; i < _this.data.computeddata.length; i++) {
      m.push(new Promise(function (resolve, reject) {
        let x = _this.data.computeddata[i].inner.split("/");
        if (_this.data.computeddata[i].type == 'img' && x[4] != 'static') {
          wx.uploadFile({
            url: app.globalData.url + '/activity/act-demo-upload/',
            filePath: _this.data.computeddata[i].inner,
            name: 'file',
            header: {
              "Authorization": app.globalData.token,
              "Content-Type": 'multipart/form-data'
            },
            complete: (res) => {
              if (res.statusText == 'Request Entity Too Large') {
                wx.showToast({
                  title: '图片太大了',
                  image: '/images/about.png'
                })
                reject("toolarge")
              }
              else if (res.statusCode != 201) {
                wx.showToast({
                  title: '网络传输故障',
                  image: '/images/about.png'
                })
                reject("webproblem")
              }
              else {
                _this.data.computeddata[i].inner = app.globalData.url+JSON.parse(res.data).l_img[0];
                resolve(i)
              }
            }
          })
        } else resolve(i)
      }))
    }
    Promise.all(m).then(function (res) {
      let a = _this.data.createHeadImg.split("/")
      if (_this.data.createHeadImg == "/images/createdefault.jpg") {
        let head_img_url = "/static/default/createdefault.jpg";
        _this.saveMain(head_img_url, upLoad, autoSave);
      }
      else if (a[2] == 'ulife.org.cn'){
        let b = _this.data.createHeadImg.split(app.globalData.url)
        let head_img_url=b[1]
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
              _this.saveMain(head_img_url, upLoad, autoSave);
            }
          }
        })
      }
    })
  },
  saveMain: function (head_img_url, upLoad, autoSave) {
    let _this = this;
    let temp = []
    for (let i = 0; i < _this.data.computeddata.length; i++) {
      temp[i] = {
        type: _this.data.computeddata[i].type,
        inner: _this.data.computeddata[i].inner,
        number: _this.data.computeddata[i].number,
        key: _this.data.computeddata[i].key
      }
      if (temp[i].type == 'img') {
        let a = temp[i].inner.split(app.globalData.url)
        temp[i].inner = a[1]
      }
      if (temp[i].type == 'text'){
        temp[i].align = _this.data.computeddata[i].align;
        temp[i].color = _this.data.computeddata[i].color;
        temp[i].text_decoration = _this.data.computeddata[i].text_decoration;
        temp[i].font_weight = _this.data.computeddata[i].font_weight;
        temp[i].font_style = _this.data.computeddata[i].font_style;
      }
    }
    // 正文
    let p3 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/' + _this.data.actId + "/",
        method: "PUT",
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
          link: false,
          key: _this.data.key,
          // file_uploaded: JSON.stringify(tempfile),
          p_info: JSON.stringify(_this.data.p_info),
          demonstration: JSON.stringify(temp),
          requirement: JSON.stringify(_this.data.createRequires),
          version: '1.0.0',
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            reject(3)
          } else {
            _this.data.actId = res.data.id;
            if (upLoad == true)
              _this.uploadMain(head_img_url);
            else {
              if (autoSave == true) return;
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
  uploadMain: function (head_img_url) {
    let _this = this;
    let temp = []
    for (let i = 0; i < _this.data.computeddata.length; i++) {
      temp[i] = {
        type: _this.data.computeddata[i].type,
        inner: _this.data.computeddata[i].inner,
        number: _this.data.computeddata[i].number,
        key: _this.data.computeddata[i].key
      }
      if (temp[i].type == 'img') {
        let a = temp[i].inner.split(app.globalData.url)
        temp[i].inner = a[1]
      }
      if (temp[i].type == 'text') {
        temp[i].align = _this.data.computeddata[i].align;
        temp[i].color = _this.data.computeddata[i].color;
        temp[i].text_decoration = _this.data.computeddata[i].text_decoration;
        temp[i].font_weight = _this.data.computeddata[i].font_weight;
        temp[i].font_style = _this.data.computeddata[i].font_style;
      }
    }
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
    let publishUrl, puMethod;
    if (app.globalData.createIsPublish == true) {
      publishUrl = "/"
      puMethod = "PUT"
    } else if (app.globalData.createIsPublish == false) {
      publishUrl = "/want_to_be_allowed_to_publish/"
      puMethod = "POST"
    }
    else {
      publishUrl = "/want_to_be_allowed_to_publish/"
      puMethod = "POST"
    }
    // 草稿箱发表活动
    wx.request({
      url: app.globalData.url + '/activity/activities/' + _this.data.actId + publishUrl,
      method: puMethod,
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
        link: false,
        key: _this.data.key,
        // file_uploaded: JSON.stringify(tempfile),
        p_info: JSON.stringify(_this.data.p_info),
        demonstration: JSON.stringify(temp),
        requirement: JSON.stringify(_this.data.createRequires),
        version: '1.0.0',
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        } else {
          wx.showToast({
            title: '上传成功',
          })
          let timer = setTimeout(function () {
            wx.switchTab({
              url: '/pages/StuOwn/StuOwn',
            })
          }, 3000)
        }
      }
    })
  },
  upload: function () {
    let _this = this;
    let autoSave = false;
    let upLoad = true;
    if (_this.data.createDate == "" || _this.data.createTime == '' || _this.data.createLocation == '' || _this.data.createType == '' || _this.data.createHobby == '' || _this.data.createDescribe == '') {
      wx.showToast({
        title: '信息不完整',
        image: '/images/about.png'
      })
      return;
    }
    _this.save(autoSave, upLoad);
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
          createHeadImg: res.tempFilePaths[0]
        })
        app.globalData.createHeadImg = _this.data.createHeadImg
        let autoSave = true;
        let upLoad = false;
        _this.save(autoSave, upLoad);
      },
    })
  },
  bindInputHeading: function (e) {
    this.setData({
      createHeading: e.detail.value
    })
    app.globalData.createHeading = this.data.createHeading
  },
  addText: function (e) {
    wx.navigateTo({
      url: '/pages/orgCJText/orgCJText',
    })
  },
  addImg: function (e) {
    let _this = this;
    wx.chooseImage({
      success: function (res) {
        for (let i = 0; i < res.tempFiles.length; i++) {
          let size = res.tempFiles[i].size;
          if (size > 10485760) {
            wx.showToast({
              title: '图片太大了',
              image: '/images/about.png'
            })
            return;
          }
          let m = "computeddata[" + _this.data.cal + "]"
          _this.setData({
            [m]: {
              type: 'img',
              inner: res.tempFilePaths[i],
              number: _this.data.cal,
              key: _this.data.key
            }
          })
          _this.data.key++;
          _this.data.cal++;
          let autoSave = true;
          let upLoad = false;
          _this.save(autoSave, upLoad);
        }
      },
    })
  },
  addTitle: function (e) {
    let id = e.target.id;
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=orgCJEdit&type=title',
    })
  },
  showImageActionSheet: function (e) {
    let _this = this;
    let index = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ['编辑', '删除','取消'],
      success: (e) => {
        if (e.tapIndex == 0) {
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
              let m = "computeddata[" + index + "].inner"
              _this.setData({
                [m]: res.tempFilePaths[0]
              })
              let autoSave = true;
              let upLoad = false;
              _this.save(autoSave, upLoad);
            },
          })
        } else if (e.tapIndex == 1){
          let temp = _this.data.computeddata;
          temp.splice(index, 1);
          _this.setData({
            computeddata: temp
          })
          _this.data.cal--;
          let autoSave = true;
          let upLoad = false;
          _this.save(autoSave, upLoad);
        }
      }
    })
  },
  showTextActionSheet: function (e) {
    let _this = this;
    let index = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ['编辑', '删除','取消'],
      success: (e) => {
        if (e.tapIndex == 0) {
          app.globalData.orgCJEditSetting = _this.data.computeddata[index]
          app.globalData.reeditIndex = index
          wx.navigateTo({
            url: '/pages/orgCJText/orgCJText',
          })
        } else if (e.tapIndex == 1){
          let temp = _this.data.computeddata;
          temp.splice(index, 1);
          _this.setData({
            computeddata: temp
          })
          _this.data.cal--;
        }
      }
    })
  },
  showTitleActionSheet: function (e) {
    let _this = this;
    let index = e.currentTarget.id;
    wx.showActionSheet({
      itemList: ['编辑', '删除','取消'],
      success: (e) => {
        if (e.tapIndex == 0) {
          app.globalData.orgCJEditContent = _this.data.computeddata[index].inner
          app.globalData.reeditIndex = index
          wx.navigateTo({
            url: '/pages/editArea/editArea?from=orgCJEdit&type=title',
          })
        } else if (e.tapIndex == 1){
          let temp = _this.data.computeddata;
          temp.splice(index, 1);
          _this.setData({
            computeddata: temp
          })
          _this.data.cal--;
        }
      }
    })
  },
  // 创建actId
  createSave: function () {
    let _this = this;
    _this.setData({
      loading: true
    })
    if (_this.data.createHeading.length > 20 || _this.data.createHeading.length == 0) {
      wx.showToast({
        title: '标题长度错误',
        image: '/images/about.png'
      })
      return;
    }
    if (_this.data.createHeadImg == "/images/createdefault.jpg") {
      let head_img_url = "/static/default/createdefault.jpg";
      _this.createSaveMain(head_img_url);
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
            _this.setData({
              loading: false
            })
            wx.showToast({
              title: '图片太大了',
              image: '/images/about.png'
            })
          }
          else if (res.statusCode != 201) {
            _this.setData({
              loading: false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          } else {
            let bgImg = JSON.parse(res.data)
            let head_img_url = bgImg.bg_img;
            _this.createSaveMain(head_img_url);
          }
        }
      })
    }
  },
  createSaveMain: function (head_img_url) {
    let _this = this;
    // 正文
    let p3 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/',
        method: "POST",
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
          link: false,
          key: _this.data.key,
          // file_uploaded: JSON.stringify(tempfile),
          p_info: JSON.stringify(_this.data.p_info),
          demonstration: JSON.stringify(_this.data.computeddata),
          requirement: JSON.stringify(_this.data.createRequires),
          version: '1.0.0',
        },
        complete: (res) => {
          if (res.statusCode != 201) {
            _this.setData({
              loading: false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            reject(3)
          } else {
            _this.data.actId = res.data.id;
            _this.setData({
              loading: false
            })
          }
        }
      })
    })
  },
})

