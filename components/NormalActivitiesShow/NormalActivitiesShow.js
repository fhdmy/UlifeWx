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
        url: '/pages/actShow/actShow?actId=' + e.currentTarget.id,
      })
    },
    openOrg:function(e){  //打开组织界面
      wx.navigateTo({
        url: '/pages/orgDisplay/orgDisplay?orgId=' + e.target.id,
      })
    },
    excuse:function(e){
      if(this.properties.pageType=="myActs"){
        this.triggerEvent('myActs',e.currentTarget.id, {})
      }
      else if (this.properties.pageType == "draft"){
        this.triggerEvent('draft', e.currentTarget.id, {})
      }
    }
  }
})