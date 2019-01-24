// pages/searchEntry/searchEntry.js
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    loading:false,
    scroll: false,
    searchContent:"",
    type:"活动",
    time:"全部",
    interest:"全部",
    hobby:"全部",
    sort:"综合排序",
    activities: [],
    moreacts : "",
    presentacts : 0,
    actmax : 0,
    swiper:false,
    searchorgs:[],
    searchType:0,
    searchHistory:[]
  },
  onLoad: function (options) {
    let _this = this;
    if (wx.getStorageSync(md5.hex_md5("searchHistory"))) {
      _this.setData({
        navH: app.globalData.navbarHeight,
        searchContent: options.content,
        searchHistory: JSON.parse(wx.getStorageSync(md5.hex_md5("searchHistory")))
      })
    }
    else{
      _this.setData({
        navH: app.globalData.navbarHeight,
        searchContent: options.content
      })
    }
    _this.searchRequest();
  },
  searchRequest:function(){
    let _this=this;
    let fuc_content, fuc_time, fuc_type, fuc_hobby, fuc_opt;
    _this.setData({
      loading:true
    })
    switch(_this.data.time){
      case ('全部'):
        fuc_time = '';
        break;
      case ('一天内'):
        fuc_time = 'start_at__days_ago=一天内&';
        break;
      case ('一周内'):
        fuc_time = 'start_at__days_ago=一周内&';
        break;
      case ('一个月内'):
        fuc_time = 'start_at__days_ago=一个月内&';
        break;
      case ('休息日'):
        fuc_time = 'start_at__week_day__in=6,7&';
        break;
      case ('工作日'):
        fuc_time = 'start_at__week_day__in=1,2,3,4,5&';
        break;
      case ('寒暑假'):
        fuc_time = 'start_at__month_day__in=1,2,7,8&';
        break;
    }
    fuc_content = (_this.data.searchContent == '') ? '' : ('search=' + _this.data.searchContent + '&');
    fuc_type = (_this.data.interest == '全部') ? '' : ('_type=' + _this.data.interest + '&');
    fuc_hobby = (_this.data.hobby == '全部') ? '' : ('hobby=' + _this.data.hobby + '&');
    switch (_this.data.sort) {
      case ('综合排序'):
        fuc_opt = 'ordering=is_ended,-browsering_count,-start_at';
        break;
      case ('时间排序'):
        fuc_opt = '';
        break;
      case ('浏览最多'):
        fuc_opt = 'ordering=-browsering_count';
        break;
    }
    let p1=new Promise(function(resolve,reject){
      // 搜索活动
      if(_this.data.type=='活动'){
        wx.request({
          url: app.globalData.url + '/activity/activities/?' + fuc_content + fuc_time + fuc_type + fuc_hobby + fuc_opt + '&is_published=true',
        header: {
          "Authorization": app.globalData.token
        },
        complete:(res)=>{
          if(res.statusCode!=200){
            resolve(1)
            wx.showToast({
              title: '网络传输故障！',
              image: '/images/about.png'
            })
          }
          else{
            for (let k = 0; k < res.data.results.length; k++) {
              let computeddate = res.data.results[k].start_at.split('T');
              let sact="activities["+k+"]";
              _this.setData({
                [sact]:{
                  head_img: app.globalData.url + res.data.results[k].head_img + '.thumbnail.0.jpg',
                  heading: res.data.results[k].heading,
                  date: computeddate[0],
                  location: res.data.results[k].location,
                  orgavatar: app.globalData.url + res.data.results[k].owner.avatar + '.thumbnail.2.jpg',
                  isover: false,
                  acturl: res.data.results[k].id,
                  org_id: res.data.results[k].owner.id,
                  is_ended: res.data.results[k].is_ended
                }
              })
            }
            _this.setData({
              moreacts : res.data.next,
              presentacts : res.data.results.length,
              actmax : res.data.count,
            })
            resolve(1)
          }
        }
      })
      }
      // 搜索组织
      else{
        fuc_content = (_this.data.searchContent == '') ? '' : _this.data.searchContent;
        wx.request({
          url: app.globalData.url + '/account/orgs/?search=' + fuc_content,
          header: {
            "Authorization": app.globalData.token
          },
          complete:(res)=>{
            if(res.statusCode!=200){
              resolve(1)
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
            }
            else{
              for (let k = 0; k < res.data.length; k++) {
                let sorg ="searchorgs["+k+"]";
                _this.setData({
                  [sorg]:{
                    activity_count: res.data[k].activity_count,
                    avatar: app.globalData.url + res.data[k].avatar + '.thumbnail.2.jpg',
                    org_name: res.data[k].org_name,
                    stars: res.data[k].stars,
                    watcher_count: res.data[k].watcher_count,
                    id: res.data[k].id 
                  }
                })
              }
              resolve(1)
            }
          }
        })
      }
    })
    p1.then(function(results){
      _this.setData({
        loading:false
      })
    })
  },
  search:function(){
    let _this = this;
    let regu = "^[ ]+$";
    let re = new RegExp(regu);
    if (re.test(_this.data.searchContent) == true)
      _this.setData({
        searchContent: ""
      })
    let judge = false;
    for (let i = 0; i < _this.data.searchHistory.length; i++) {
      if (_this.data.searchHistory[i] == _this.data.searchContent) {
        judge = true;
        break;
      }
    }
    if (_this.data.searchContent.length != 0 && judge==false) {
      let sNext = "searchHistory[" + _this.data.searchHistory.length + "]"
      _this.setData({
        [sNext]: _this.data.searchContent
      })
      let sHistory = JSON.stringify(_this.data.searchHistory)
      wx.setStorageSync(md5.hex_md5("searchHistory"), sHistory);
    }
    _this.searchRequest();
  },
  bindInput:function(e){
    this.setData({
      searchContent: e.detail.value
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  searchChoose:function(){
    if (this.data.type=="组织")
      this.setData({
        swiper: !this.data.swiper,
        searchType:1
      })
    else
      this.setData({
        swiper:!this.data.swiper
      })
  },
  chooseType:function(e){
    // console.log(e._relatedInfo.anchorTargetText)
    this.setData({
      type: e._relatedInfo.anchorTargetText
    })
  },
  chooseTime:function(e){
    this.setData({
      time: e._relatedInfo.anchorTargetText
    })
  },
  chooseInterest:function(e){
    this.setData({
      interest: e._relatedInfo.anchorTargetText
    })
  },
  chooseHobby:function(e){
    this.setData({
      hobby: e._relatedInfo.anchorTargetText
    })
  },
  chooseSort:function(e){
    this.setData({
      sort: e._relatedInfo.anchorTargetText
    })
  },
  clearChoose:function(){
    this.setData({
      type: "活动",
      time: "全部",
      interest: "全部",
      hobby: "全部",
      sort: "综合排序",
    })
  },
  scrollBottom: function () {
    let _this = this;
    if(_this.data.type=="活动"){
      if (_this.data.actmax == _this.data.presentacts || _this.data.scroll == true)
        return;
      //更多活动
      _this.setData({
        loading: true,
        scroll: true
      })
      var pm = new Promise(function (resolve, reject) {
        wx.request({
          url: _this.data.moreacts,
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              wx.showToast({
                title: '网络传输故障！',
                image: '/images/about.png'
              })
              resolve("pm");
            }
            else {
              for (let k = 0; k < res.data.results.length; k++) {
                // 设置数组
                var computeddate = res.data.results[k].start_at.split('T');
                let sacts="activities["+parseInt(_this.data.presentacts+k)+"]";
                _this.setData({
                  [sacts]:{
                    head_img: global_.BASE_URL + res.data.results[k].head_img + '.thumbnail.0.jpg',
                    heading: res.data.results[k].heading,
                    date: computeddate[0],
                    location: res.data.results[k].location,
                    orgavatar: global_.BASE_URL + res.data.results[k].owner.avatar + '.thumbnail.2.jpg',
                    isover: false,
                    acturl: res.data.results[k].id,
                    is_ended: res.data.results[k].is_ended,
                  }
                })
              }
              _this.setData({
                moreacts: res.data.next,
                presentacts: (res.data.results.length + _this.data.presentacts)
              })
              resolve("pm");
            }
          }
        })
      })
      pm.then(function (results) {
        _this.setData({
          loading: false,
          scroll: false
        })
      })
    }
  },
})