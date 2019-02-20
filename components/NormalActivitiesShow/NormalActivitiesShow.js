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
      if (this.properties.pageType =='orgSignup')
        wx.navigateTo({
          url: '/pages/orgSignupShow/orgSignupShow?actId=' + this.properties.activities[e.currentTarget.id].acturl,
        })
      else if (this.properties.pageType == 'draft'){
        app.globalData.createActId = this.properties.activities[e.currentTarget.id].acturl
        // 链接活动
        if (this.properties.activities[e.currentTarget.id].link){
          wx.navigateTo({
            url: '/pages/orgCJ1/orgCJ1?type=link&reedit=true',
          })
        }
        // 编辑活动
        else{
          wx.navigateTo({
            url: '/pages/orgCJ1/orgCJ1?type=edit&reedit=true',
          })
        }
      }
      else
        wx.navigateTo({
          url: '/pages/actShow/actShow?actId=' + this.properties.activities[e.currentTarget.id].acturl,
        })
    },
    openOrg:function(e){  //打开组织界面
      if (this.properties.pageType == 'orgSignup' || this.properties.pageType == 'myActs' || this.properties.pageType == 'draft')
        return;
      else
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