//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    loading:false,
    userurl:"",
    avatar:"",
    nickname:"",
    realname:"",
    phone:"",
    sex:"男",
    college:"社区学院",
    grade:"大一",
    gradeArray:["大一","大二","大三","大四","其他"],
    collegeArray: [
      '理学院', '生命科学学院', '文学院', '法学院', '外国语学院', '社会学院', '计算机工程与科学学院','机电工程与自动化学院', '通信与信息工程学院', '环境与化学工程学院', '材料科学与工程学院', '中欧工程技术学院', '土木工程系', '材料基因组工程研究院','经济学院', '管理学院', '图书情报档案系', '悉尼工商学院', '管理教育研究院','上海电影学院', '上海美术学院', '音乐学院', '数码艺术学院', '上海温哥华电影学院','社区学院', '钱伟长学院', '体育学院','其他',
    ],
    sexArray:["男","女","保密"]
  },
  onShow: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
    })
    var stuEditType = app.globalData.stuEditType;
    if(stuEditType=="nickname"){
      this.setData({
        nickname:app.globalData.stuEditContent
      })
    }
    else if(stuEditType=='realname'){
      this.setData({
        realname:app.globalData.stuEditContent
      })
    }
    else if(stuEditType=='phone'){
      this.setData({
        phone:app.globalData.stuEditContent
      })
    }
  },
  onLoad:function(){
    let _this=this;
    _this.setData({
      loading:true
    })
    //发请求
    _this.data.userurl = wx.getStorageSync(md5.hex_md5("user_url"));
    wx.request({
      url: app.globalData.url + '/account/students/' + _this.data.userurl + '/',
      header: {
        "Authorization": app.globalData.token
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          _this.setData({
            loading: false
          })
        }
        else {
          let gender;
          if (res.data.gender == "male")
            gender = "男";
          else if (res.data.gender == "female")
            gender = "女";
          else gender = "保密";
          _this.setData({
            phone: res.data.phone_number,
            nickname: res.data.nickname,
            realname: res.data.realname,
            college: res.data.college,
            grade: res.data.grade,
            sex: gender,
            avatar: wx.getStorageSync(md5.hex_md5("avatar")),
            loading: false
          })
        }
      }
    })
  },
  bindGradeChange(e) {
    this.setData({
      grade: this.data.gradeArray[e.detail.value]
    })
  },
  bindCollegeChange:function(e){
    this.setData({
      college: this.data.collegeArray[e.detail.value]
    })
  },
  bindSexChange: function (e) {
    this.setData({
      sex: this.data.sexArray[e.detail.value]
    })
  },
  toFurtherInform:function(){
    wx.navigateTo({
      url: '/pages/stuFurtherEdit/stuFurtherEdit',
    })
  },
  save:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  changeAvatar:function(){
    wx.chooseImage({
      success: function(res) {
        console.log(res)
      },
    })
  },
  toEditAreaNickname:function(){
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=stuEdit&type=nickname',
    })
  },
  toEditAreaRealname: function () {
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=stuEdit&type=realname',
    })
  },
  toEditAreaPhone: function () {
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=stuEdit&type=phone',
    })
  }
})

