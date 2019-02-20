// pages/OrgCJ III/chuangjianIII.js
// pages/OrgCJ I/chuangjianI.js
const app = getApp()
Page({
  data: {
    select_name: true,
    select_gender: true,
    requires: [{
      type: 'text',
      inner: ''
    }],
    navH: 0,
    selectArray:[
      { val:"select_gender",name:"性别",checked:true},
      { val: "select_college", name: "院系", checked: true },
      { val: "select_grade", name: "年级", checked: true },
    ]
  },
  onShow: function (options) {
    let _this = this;
    if (app.globalData.createRequires!=""){
      this.setData({
        requires:app.globalData.createRequires
      })
    }
    if(app.globalData.createSelectArray!=""){
      this.setData({
        selectArray: app.globalData.createSelectArray
      })
    }
    _this.setData({
      navH: app.globalData.navbarHeight,
      isLogin: app.globalData.isLogin,
      studentAvatar: app.globalData.avatar,
      nickName: app.globalData.name
    })
  },
  onLoad: function (options) {
    this.data.type = options.type;
  },
  toNext: function () {
    app.globalData.createRequires = this.data.requires
    app.globalData.createSelectArray = this.data.selectArray
    if(this.data.type=="link")
      wx.navigateTo({
        url: '/pages/orgCJLink/orgCJLink'
      })
    else
      wx.navigateTo({
        url: '/pages/orgCJEdit/orgCJEdit',
      })
  },
  clearInputEvent: function (e) {
    let temp=this.data.requires;
    temp.splice(e.target.id,1);
    this.setData({
      requires:temp
    })
    app.globalData.createRequires=this.data.requires
  },
  addchoice: function(){
    let _this=this;
    wx.showActionSheet({
      itemList: ['简答框','选择框'],
      success(e) {
        if (e.tapIndex == 0) {
          let temp=_this.data.requires;
          temp[temp.length]={
            type:"text",
            inner:""
          }
          _this.setData({
            requires:temp
          })
          app.globalData.createRequires = _this.data.requires
        }
        else {
          let temp = _this.data.requires;
          temp[temp.length] = {
            type: "select",
            title:"",
            inner:[]
          }
          _this.setData({
            requires: temp
          })
          app.globalData.createRequires = _this.data.requires
        }
      }
    })
  },
  inputTextValue:function(e){
    let ip="requires["+e.target.id+"].inner";
    this.setData({
      [ip]:e.detail.value
    })
    app.globalData.createRequires = this.data.requires
  },
  inputTitleValue:function(e){
    let ip = "requires[" + e.target.id + "].title";
    this.setData({
      [ip]: e.detail.value
    })
    app.globalData.createRequires = this.data.requires
  },
  addOption:function(e){
    let temp = this.data.requires;
    temp[e.target.id].inner[temp[e.target.id].inner.length]=""
    this.setData({
      requires: temp
    })
    app.globalData.createRequires = this.data.requires
  },
  inputOptionValue:function(e){
    let index = e.target.id[0]
    let idx = e.target.id[1]
    let ip = "requires[" + index + "].inner["+idx+"]";
    this.setData({
      [ip]: e.detail.value
    })
    app.globalData.createRequires = this.data.requires
  },
  clearOptionEvent:function(e){
    let index=e.target.id[0]
    let idx=e.target.id[1]
    let temp = this.data.requires;
    temp[index].inner.splice(idx, 1);
    this.setData({
      requires: temp
    })
    app.globalData.createRequires = this.data.requires
  },
  checkboxChange:function(e){
    let items = this.data.selectArray
    let values = e.detail.value
    for (let i = 0; i < items.length; ++i) {
      items[i].checked = false
      for (let j = 0; j < values.length; ++j) {
        if (items[i].val === values[j]) {
          items[i].checked = true
          break
        }
      }
    }
    this.setData({
      selectArray:items
    })
    app.globalData.createSelectArray=this.data.selectArray
  }
})