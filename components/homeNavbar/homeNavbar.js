// 以下为参考网址
//http://www.cnblogs.com/sese/p/9761713.html
//https://blog.csdn.net/w390058785/article/details/83857427
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,    //标题
    pageType: String,    //判断使用该组件的页面类型，决定html以不同的形式展示
    qRCodeMsg: String,   //扫描二维码用
    displayAvatar:String,  //组织和学生展示界面的头像url
    hasWatched:Boolean,   //组织展示界面是否关注的判断依据
    reLoad: Boolean
  },
  data: {

  },
  lifetimes: {
    attached: function () {
      this.setData({
        navH: app.globalData.navbarHeight  //自定义导航栏高度设置
      })
    }
  },
  methods: {
    //回退
    back: function () {
      let pages=getCurrentPages();
      if(pages.length==1){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      else
        wx.navigateBack({
          delta: 1
        })
    },
    search:function(){
      wx.navigateTo({
        url: '/pages/searchEntry/searchEntry'
      })
    },
    getQRCode: function () {  //复制自官方文档
      var _this = this;
      wx.scanCode({        //扫描API
        success: function (res) {
          console.log(res);    //输出回调信息
          _this.setData({
            qRCodeMsg: res.result
          });
          _this.triggerEvent("qrCodeMsg", {qrCode:_this.data.qRCodeMsg},{}) //向父组件传递值，参考官方文档
        }
      })
    },
    changeaccount:function(){
      wx.navigateTo({
        url: '/pages/login/login?type=changeAccount'
      })
    },
    searchChoose:function(){
      this.triggerEvent('searchChoose', {}, {})
    },
    toWatch:function(){
      this.triggerEvent('towatch', {}, {})
    },
    sort:function(){
      this.triggerEvent('sort', {}, {})
    },
    save: function () {
      this.triggerEvent('save', {}, {})
    },
    upload: function () {
      this.triggerEvent('upload', {}, {})
    },
    refresh:function(){
      if (this.properties.pageType=='home'){
        this.triggerEvent('refresh', {}, {})
      }else return;
    }
  }
})