// components/navbar/index.js
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
    pageName: String,
    pageType: String,
    qRCodeMsg: String,
    displayAvatar:String,
    hasWatched:Boolean
    // showNav: {
    //   type: Boolean,
    //   value: true
    // },
    // showHome: {
    //   type: Boolean,
    //   value: true
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    attached: function () {
      this.setData({
        navH: app.globalData.navbarHeight
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // //回退
    back: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    // //回主页
    // toIndex: function () {
    //   wx.navigateTo({
    //     url: '/pages/admin/home/index/index'
    //   })
    // },
    search:function(){
      wx.navigateTo({
        url: '/pages/searchEntry/searchEntry'
      })
    },
    getQRCode: function () {
      var _this = this;
      wx.scanCode({        //扫描API
        success: function (res) {
          console.log(res);    //输出回调信息
          _this.setData({
            qRCodeMsg: res.result
          });
          wx.showToast({
            title: '成功',
            duration: 2000
          })
        }
      })
    },
    changeaccount:function(){
      
    },
    searchChoose:function(){
      this.triggerEvent('searchChoose', {}, {})
    },
    toWatch:function(){
      this.triggerEvent('towatch', {}, {})
    }
  }
})