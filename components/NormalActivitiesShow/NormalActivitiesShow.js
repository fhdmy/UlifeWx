const app = getApp();

Component({
  options: {
    
  },
  /**
   * 组件的属性列表
   */
  properties: {
    activities:Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    openAct:function(){
      wx.navigateTo({
        url: '/pages/actShow/actShow',
      })
    },
    openOrg:function(){
      wx.navigateTo({
        url: '/pages/orgDisplay/orgDisplay',
      })
    }
  }
})