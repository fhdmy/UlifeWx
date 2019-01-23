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
    openAct:function(e){  //打开活动界面
      wx.navigateTo({
        url: '/pages/actShow/actShow?actId='+e.target.id,
      })
    },
    openOrg:function(e){  //打开组织界面
      wx.navigateTo({
        url: '/pages/orgDisplay/orgDisplay?orgId=' + e.target.id,
      })
    },
  }
})