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
    wx.navigateTo({
      url: '/pages/OrgCJ IV/chuangjianIV'
    })
  },
  clearInputEvent: function (e) {
    let temp=this.data.requires;
    console.log(temp)
    console.log(e.target.id)
    temp.splice(e.target.id,1);
    console.log(temp)
    this.setData({
      requires:temp
    })
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
        }
      }
    })
  },
  inputTextValue:function(e){
    let ip="requires["+e.target.id+"].inner";
    this.setData({
      [ip]:e.detail.value
    })
  },
  inputTitleValue:function(e){
    let ip = "requires[" + e.target.id + "].title";
    this.setData({
      [ip]: e.detail.value
    })
  },
  addOption:function(e){
    let temp = this.data.requires;
    temp[e.target.id].inner[temp[e.target.id].inner.length]=""
    this.setData({
      requires: temp
    })
  },
  inputOptionValue:function(e){
    let index = e.target.id[0]
    let idx = e.target.id[1]
    let ip = "requires[" + index + "].inner["+idx+"]";
    this.setData({
      [ip]: e.detail.value
    })
  },
  clearOptionEvent:function(e){
    let index=e.target.id[0]
    let idx=e.target.id[1]
    let temp = this.data.requires;
    console.log(idx)
    console.log(temp[index].inner)
    temp[index].inner.splice(idx, 1);
    this.setData({
      requires: temp
    })
  },
  checkboxChange:function(e){
    console.log(e)
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
  }
})