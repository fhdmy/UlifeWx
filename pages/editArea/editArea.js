//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    focus:true,
    pageFrom:"",
    pageType:"",
    content:"",
    actId:0,
    array:[],
    item:""
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
      if (options.from =='SignupHomepage'){
        if(options.type=='answer'){
          if(options.item=='text'){
            _this.setData({
              actId:options.id,
              content:options.answer,
              item:"text"
            })
          }else{
            _this.setData({
              array: JSON.parse(options.array),
              actId: options.id,
              content: options.answer,
              item:"select"
            })
          }
        }
      }
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
    else if(this.data.pageFrom=='SignupHomepage'){
      app.globalData.signupType = this.data.pageType;
      app.globalData.signupContent = this.data.content;
      if(this.data.item!=""){
        app.globalData.signupItem=this.data.item;
        app.globalData.signupId=this.data.actId;
      }
      wx.navigateBack({
        delta: 1
      })
    }
  },
  inputContent:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  bindInputPicker:function(e){
    this.setData({
      content: this.data.array[e.detail.value]
    })
  } 
})

