//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    pageFrom:"",
    pageType:"",
    content:""
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    if(options){
      _this.setData({
        pageFrom:options.from,
        pageType:options.type
      })
    }
  },
  save:function(){
    if(this.data.pageFrom=="stuEdit"){
      // wx.navigateTo({
      //   url: '/pages/stuEdit/stuEdit?type='+this.data.pageType+'&content='+this.data.content,
      // })
      app.globalData.stuEditType=this.data.pageType;
      app.globalData.stuEditContent=this.data.content;
      wx.navigateBack({
        delta: 1
      })
    }
  },
  inputContent:function(e){
    this.setData({
      content: e.detail.value
    })
  }
})

