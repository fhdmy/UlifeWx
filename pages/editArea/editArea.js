//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    pageFrom:"",
    pageType:"",
    content:"",
    actId:0,
    array:[],
    item:"",
    placeHolder:false
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
      else if (options.from =='orgCJEdit'){
        if (app.globalData.orgCJEditContent!="")
          _this.setData({
            content: app.globalData.orgCJEditContent
          })
        app.globalData.orgCJEditContent=""
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
    else if (this.data.pageFrom == 'orgCJ2'){
      app.globalData.createCJ2Type = this.data.pageType;
      app.globalData.createCJ2Content = this.data.content;
      wx.navigateBack({
        delta: 1
      })
    }
    else if (this.data.pageFrom == 'orgCJEdit'){
      app.globalData.orgCJEditType = this.data.pageType;
      app.globalData.orgCJEditContent = this.data.content;
      wx.navigateBack({
        delta: 1
      })
    }
  },
  inputContent:function(e){
    if (e.detail.value=="")
      this.setData({
        placeHolder:false
      })
    else
      this.setData({
        placeHolder: true
      })
    this.setData({
      content: e.detail.value
    })
  },
  bindFocus:function(){
    this.setData({
      placeHolder:true
    })
  },
  bindInputPicker:function(e){
    this.setData({
      content: this.data.array[e.detail.value]
    })
  } 
})

