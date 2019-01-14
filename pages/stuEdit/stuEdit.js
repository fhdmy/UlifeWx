//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    avatar:"/test/xnick.jpg",
    nickname:"Xnick",
    realname:"姜辰昊",
    phone:"13681678224",
    sex:"女",
    college:"经济学院",
    grade:"大二",
    gradeArray:["大一","大二","大三","大四","其他"],
    collegeArray: [
      '理学院', '生命科学学院', '文学院', '法学院', '外国语学院', '社会学院', '计算机工程与科学学院','机电工程与自动化学院', '通信与信息工程学院', '环境与化学工程学院', '材料科学与工程学院', '中欧工程技术学院', '土木工程系', '材料基因组工程研究院','经济学院', '管理学院', '图书情报档案系', '悉尼工商学院', '管理教育研究院','上海电影学院', '上海美术学院', '音乐学院', '数码艺术学院', '上海温哥华电影学院','社区学院', '钱伟长学院', '体育学院','其他',
    ],
    sexArray:["男","女"]
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    if(options){
      if(options.type=="nickname"){
        this.setData({
          nickname:options.content
        })
      }
      else if(options.type=="realname"){
        this.setData({
          realname:options.content
        })
      }
      else if(options.type=="phone"){
        this.setData({
          phone:options.content
        })
      }
    }
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
      url: '',
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

