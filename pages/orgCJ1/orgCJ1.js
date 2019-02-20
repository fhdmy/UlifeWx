// pages/OrgCJ I/chuangjianI.js
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    type:"link",
    heading: "",
    focus: true,
    loading:false
  },
  onShow: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
    })
    if(app.globalData.createHeading!="")
      _this.setData({
        heading: app.globalData.createHeading
      })
  },
  onLoad: function (options){
    let _this=this;
    this.data.type = options.type;
    app.globalData.createHeading="";
    app.globalData.createHeadImg = "";
    app.globalData.createDate = "";
    app.globalData.createTime = "";
    app.globalData.createLocation = "";
    app.globalData.createType = "";
    app.globalData.createHobby = "";
    app.globalData.createDescribe = "";
    app.globalData.createRequires = "";
    app.globalData.createSelectArray = "";
    app.globalData.createLink="";
    app.globalData.createIsPublish="";
    app.globalData.createDemonstration="";
    app.globalData.createCal=-1;
    app.globalData.createKey=-1;
    if(options.reedit){
      _this.setData({
        loading:true
      })
      wx.request({
        url: app.globalData.url +'/activity/activities/'+app.globalData.createActId+"/",
        header: {
          "Authorization": app.globalData.token
        },
        complete:(res)=>{
          if(res.statusCode!=200){
            _this.setData({
              loading:false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
          else{
            if (res.data.p_info != "") {
              let info = JSON.parse(res.data.p_info);
              app.globalData.createSelectArray = [{ val: "select_gender", name: "性别", checked: true },
                { val: "select_college", name: "院系", checked: true },
                { val: "select_grade", name: "年级", checked: true },]
              app.globalData.createSelectArray[0].checked = info[2]
              app.globalData.createSelectArray[1].checked = info[3];
              app.globalData.createSelectArray[2].checked = info[4];
            }
            app.globalData.createIsPublish = res.data.is_published;
            let computeddate = res.data.created_at.split('T');
            let computedstart = res.data.start_at.split('T');
            let comutedstarttime = computedstart[1].split(':');
            if (res.data.head_img != null) {
              app.globalData.createHeadImg = app.globalData.url + res.data.head_img;
            }
            if(_this.data.type=='link'){
              app.globalData.createLink = JSON.parse(res.data.demonstration).linktext;
            }
            else{
              app.globalData.createDemonstration=JSON.parse(res.data.demonstration);
            }
            app.globalData.createDescribe = res.data.description;
            app.globalData.createHeading = res.data.heading;
            _this.setData({
              heading:res.data.heading
            })
            app.globalData.createHobby = res.data.hobby;
            app.globalData.createLocation = res.data.location;
            _this.data.createDate = computedstart[0];
            _this.data.createTime = comutedstarttime[0] + ':' + comutedstarttime[1];
            _this.data.createType = res.data._type;
            app.globalData.createRequires = JSON.parse(res.data.requirement);
            _this.setData({
              loading:false
            })
          }
        }
      })
    }
    else
      app.globalData.createActId = -1;
  },
  bindInput: function (e) {
    this.setData({
      heading: e.detail.value
    })
    app.globalData.createHeading = this.data.heading
  },
  toNext: function() {
    if (this.data.heading.length > 20 || this.data.heading.length == 0) {
      wx.showToast({
        title: '标题长度错误',
        image: '/images/about.png'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/orgCJ2/orgCJ2?type='+this.data.type
    })
  }
})