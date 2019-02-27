//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading: false,
    content:"",
    other:{
      'color':'rgb(66, 66, 66)',
      'textAlign':'left',
      'textDecoration':'none',
      'fontWeight':'noraml',
      'fontStyle':'normal'
    },
    showModel:false,
    placeHolder:false,
    setColor: 'rgb(66, 66, 66)',
    R:66,
    G:66,
    B:66
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    if (app.globalData.orgCJEditSetting!=""){
      let setting = app.globalData.orgCJEditSetting
      let color = setting.color;
      let a = color.split("(");
      let b = a[1].split(")");
      let c = b[0].split(",");
      _this.setData({
        content: setting.inner,
        setColor: setting.color,
        R: c[0],
        G: c[1],
        B: c[2],
        other:{
          color: setting.color,
          textAlign: setting.align,
          textDecoration: setting.text_decoration,
          fontWeight: setting.font_weight,
          fontStyle: setting.font_style,
        }
      })
      app.globalData.orgCJEditSetting=""
    }
  },
  confirm: function () {
    app.globalData.orgCJEditType="text";
    app.globalData.orgCJEditContent=this.data.content;
    app.globalData.orgCJEditSetting=this.data.other;
    wx.navigateBack({
      delta: 1
    })
  },
  inputContent: function (e) {
    if(e.detail.value=="")
      this.setData({
        placeHolder:false
      })
    else
      this.setData({
        placeHolder:true
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
  openCutiActionSheet:function(){
    let _this=this;
    wx.showActionSheet({
      itemList: ['粗体','斜体','无','取消'],
      success:(e)=>{
        if (e.tapIndex == 0){
          let m ="other.fontWeight"
          let l = "other.fontStyle";
          _this.setData({
            [m]:'bolder',
            [l]:'normal'
          })
        }
        else if (e.tapIndex == 1){
          let m = "other.fontWeight"
          let l = "other.fontStyle";
          _this.setData({
            [m]:'normal',
            [l]: 'italic'
          })
        }
        else if(e.tapIndex == 2){
          let m = "other.fontWeight";
          let l = "other.fontStyle";
          _this.setData({
            [m]: 'normal',
            [l]:'normal'
          })
        }
      }
    })
  },
  openUnderlineActionSheet:function(){
    let _this = this;
    wx.showActionSheet({
      itemList: ['下划线', '删除线', '无', '取消'],
      success: (e) => {
        if (e.tapIndex == 0) {
          let m = "other.textDecoration"
          _this.setData({
            [m]: 'underline'
          })
        }
        else if (e.tapIndex == 1) {
          let m = "other.textDecoration"
          _this.setData({
            [m]: 'line-through'
          })
        }
        else if (e.tapIndex == 2){
          let m = "other.textDecoration"
          _this.setData({
            [m]: 'none'
          })
        }
      }
    })
  },
  openColorActionSheet:function(){
    let _this = this;
    _this.setData({
      showModel:true
    })
  },
  openAlignActionSheet:function(){
    let _this = this;
    wx.showActionSheet({
      itemList: ['左对齐', '居中', '右对齐', '取消'],
      success: (e) => {
        if (e.tapIndex == 0) {
          let m = "other.textAlign"
          _this.setData({
            [m]: 'left'
          })
        }
        else if (e.tapIndex == 1) {
          let m = "other.textAlign"
          _this.setData({
            [m]: 'center'
          })
        }
        else if (e.tapIndex == 2){
          let m = "other.textAlign"
          _this.setData({
            [m]: 'right'
          })
        }
      }
    })
  },
  sliderRchange:function(e){
    this.setData({
      R:e.detail.value
    })
    let setColor = this.data.setColor;
    let b=setColor.split(",");
    let color="rgb("+this.data.R+","+b[1]+","+b[2]
    this.setData({
      setColor:color
    })
  },
  sliderGchange: function (e) {
    this.setData({
      G: e.detail.value
    })
    let setColor = this.data.setColor;
    let b = setColor.split(",");
    let color=b[0]+","+this.data.G+","+b[2]
    this.setData({
      setColor: color
    })
  },
  sliderBchange: function (e) {
    this.setData({
      B: e.detail.value
    })
    let setColor = this.data.setColor;
    let b = setColor.split(",");
    let color = b[0] + "," + b[1] + "," + this.data.B +")"
    this.setData({
      setColor: color
    })
  },
  confirmColor:function(){
    let m="other.color"
    this.setData({
      [m]: this.data.setColor,
      showModel: false
    })
  },
  cancelColor:function(){
    let color=this.data.other.color;
    let a=color.split("(");
    let b=a[1].split(")");
    let c=b[0].split(",");
    this.setData({
      R:c[0],
      G:c[1],
      B:c[2],
      setColor:color,
      showModel:false
    })
  }
})

