// pages/searchEntry/searchEntry.js
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    searchContent:"",
    focus:true,
    searchHistory:[]
  },
  onShow: function (options) {
    let _this = this;
    if (wx.getStorageSync(md5.hex_md5("searchHistory"))){
      _this.setData({
        navH: app.globalData.navbarHeight,
        searchContent:"",
        searchHistory: JSON.parse(wx.getStorageSync(md5.hex_md5("searchHistory")))
      })
    }else{
      _this.setData({
        navH: app.globalData.navbarHeight,
        searchContent: ""
      })
    }
  },
  clear:function(){
    wx.removeStorageSync(md5.hex_md5("searchHistory"));
    this.setData({
      searchHistory:[]
    })
  },
  search:function(){
    let _this=this;
    let regu = "^[ ]+$";
    let re = new RegExp(regu);
    if (re.test(_this.data.searchContent) == true)
      _this.setData({
        searchContent:""
      })
    let judge=false;
    for(let i=0;i<_this.data.searchHistory.length;i++){
      if (_this.data.searchHistory[i] == _this.data.searchContent){
        judge=true;
        break;
      }
    }
    if (_this.data.searchContent.length!=0 && judge==false) {
      let sNext = "searchHistory[" + _this.data.searchHistory.length + "]"
      _this.setData({
        [sNext]: _this.data.searchContent
      })
      let sHistory = JSON.stringify(_this.data.searchHistory)
      wx.setStorageSync(md5.hex_md5("searchHistory"), sHistory);
    }
    wx.navigateTo({
      url: '/pages/searchResult/searchResult?content=' + _this.data.searchContent,
    })
  },
  chooseItem:function(e){
    this.setData({
      searchContent:e.target.id
    });
    this.search();
  },
  bindInput:function(e){
    this.setData({
      searchContent: e.detail.value
    })
  }
})