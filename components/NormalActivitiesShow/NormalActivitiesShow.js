const app = getApp();

Component({
  options: {
    
  },
  properties: {
    activities:Array,
    pageType:String
  },
  data: {

  },
  lifetimes: {
    
  },
  methods: {
    openAct:function(){  //打开活动界面
      wx.navigateTo({
        url: '/pages/actShow/actShow',
      })
    },
    openOrg:function(){  //打开组织界面
      wx.navigateTo({
        url: '/pages/orgDisplay/orgDisplay',
      })
    }
  }
})