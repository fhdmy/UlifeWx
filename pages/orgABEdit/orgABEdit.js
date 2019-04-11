//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    loading: false,
    headImg: "",
    orgId: 0,
    computeddata: [],
    cal: 0,
    key: 0,
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
      loading: true,
      orgId: wx.getStorageSync(md5.hex_md5("org_url"))
    })
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/account/orgs/get_homepage/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            _this.setData({
              loading: false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            reject(1)
          }
          else {
            if (res.data.demonstration != null && res.data.demonstration.length > 0) {
              let demon = JSON.parse(res.data.demonstration)
              for(let j=0;j<demon.length;j++){
                let a = demon[j].inner.split("/")
                if (demon[j].type == 'img' && a[2] != 'ulife.org.cn'){
                  demon[j].inner=app.globalData.url+demon[j].inner
                }
              }
              _this.setData({
                computeddata: demon,
                key: demon.length,
                cal:demon.length
              })
            }
            if (res.data.bg_img != null) {
              _this.setData({
                headImg: app.globalData.url + res.data.bg_img
              })
            } else {
              _this.setData({
                headImg: '/images/stuownbg.jpg'
              })
            }
            resolve(1)
          }
        }
      })
    })
    p1.then(function () {
      _this.setData({
        loading: false
      })
      let autoSave = true;
      _this.save(autoSave);
    })
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
          let autoSave = true;
          _this.save(autoSave);
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
          let autoSave = true;
          _this.save(autoSave);
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
          let autoSave = true;
          _this.save(autoSave);
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
          let autoSave = true;
          _this.save(autoSave);
        }
      }
      else if (app.globalData.orgCJEditType == 'sort') {
        _this.setData({
          computeddata: app.globalData.orgCJEditContent
        })
        let autoSave = true;
        _this.save(autoSave);
      }
    }
    app.globalData.reeditIndex = -1;
    app.globalData.orgCJEditType = "";
    app.globalData.orgCJEditContent = "";
    app.globalData.orgCJEditSetting = "";
  },
  sort: function () {
    app.globalData.computeddata = this.data.computeddata;
    wx.navigateTo({
      url: '/pages/sort/sort',
    })
  },
  toSave: function () {
    this.save(false);
  },
  save: function (autoSave) {
    let _this = this;
    var m = [];
    for (let i = 0; i < _this.data.computeddata.length; i++) {
      m.push(new Promise(function (resolve, reject) {
        var x = _this.data.computeddata[i].inner.split("/");
        if (_this.data.computeddata[i].type == 'img' && x[4] != 'static') {
          wx.uploadFile({
            url: app.globalData.url + '/account/org-demo-upload/',
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
        }else resolve(i)
      }))
    } 
    Promise.all(m).then(function(res){
      let temp=[]
      for (let i = 0; i < _this.data.computeddata.length;i++){
        temp[i]={
          type:_this.data.computeddata[i].type,
          inner : _this.data.computeddata[i].inner,
          number : _this.data.computeddata[i].number,
          key : _this.data.computeddata[i].key
        }
        if(temp[i].type=='img'){
          let a=temp[i].inner.split(app.globalData.url)
          temp[i].inner=a[1]
        }
        if (temp[i].type == 'text') {
          temp[i].align = _this.data.computeddata[i].align;
          temp[i].color = _this.data.computeddata[i].color;
          temp[i].text_decoration = _this.data.computeddata[i].text_decoration;
          temp[i].font_weight = _this.data.computeddata[i].font_weight;
          temp[i].font_style = _this.data.computeddata[i].font_style;
        }
      }
      wx.request({
        url: app.globalData.url + '/account/orgs/' + _this.data.orgId + "/",
        method: "PUT",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          demonstration: JSON.stringify(temp),
          key: _this.data.key,
          version: '1.0.0'
        },
        complete: (res) => {
          if(res.statusCode!=200){
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
          else{
            if(autoSave==true)return;
            else{
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
        let bg = res.tempFilePaths[0]
        wx.uploadFile({
          url: app.globalData.url + '/account/user-bg-img-upload/',
          filePath: bg,
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
              _this.setData({
                headImg: bg
              })
              wx.showToast({
                title: '更换成功',
              })
            }
          }
        })
      },
    })
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
        }
        let autoSave = true;
        _this.save(autoSave);
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
              _this.save(autoSave);
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
          _this.save(autoSave);
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
        } else if(e.tapIndex == 1){
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
  }
})

