// pages/relevantTerms/terms.js
const app = getApp()
Page({
  data: {
    navH:0,
    txt:`组织推荐板块将通过每周推荐一个组织的形式帮助大家推广。此栏目每周更新一次，我们会在每个月初确定此月的4个推荐组织，依次是合作伙伴*1、新加入1个月内的组织*1、评星最高的组织*1、评星增量最大的组织*1。


Q&A： 
Q：请问是否需要主动申请资格？
A：不需要，Ulife平台会根据各个组织的情况进行排序而做决定。 

Q：合作伙伴是什么？
A：合作伙伴是在Ulife内测阶段参与进来的学生组织，拥有一定福利。 

Q：请问如果4个备选组织有所重复，怎么办呢？
A：每个月每个组织只能推荐一次，我们会顺延考虑其他组织。

Q：请问被推荐的组织需要提供什么材料呢？
A：Ulife官方会与被推荐的组织进行联系，而组织只需要提供组织简介即可。

Q：新加入组织评比的限制条件是什么？ 
A：必须是在组织用户注册后的1个月之内哦。
    `
  },
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navbarHeight
    })
  },
})