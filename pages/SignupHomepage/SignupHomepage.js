//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading:false,
    sexArray: ["男", "女", "保密"],
    gradeArray: ["大一", "大二", "大三", "大四", "其他"],
    collegeArray: [
      '理学院', '生命科学学院', '文学院', '法学院', '外国语学院', '社会学院', '计算机工程与科学学院', '机电工程与自动化学院', '通信与信息工程学院', '环境与化学工程学院', '材料科学与工程学院', '中欧工程技术学院', '土木工程系', '材料基因组工程研究院', '经济学院', '管理学院', '图书情报档案系', '悉尼工商学院', '管理教育研究院', '上海电影学院', '上海美术学院', '音乐学院', '数码艺术学院', '上海温哥华电影学院', '社区学院', '钱伟长学院', '体育学院', '其他',
    ],
    ifo: ['', '', '', '', ''],//[realname, phone_number, gender, college, grade]
    select_name: true,
    select_gender: true,
    select_college: true,
    select_phone_number: true,
    select_grade: true,
    requirement:[],
    actId:0,
    answer:[]
  },
  onShow: function (options){
    let _this = this;
    let signupType = app.globalData.signupType;
    // 个人信息
    if (app.globalData.signupItem==""){
      if (signupType == "name") {
        let i = "ifo[0]"
        this.setData({
          [i]: app.globalData.signupContent
        })
      }
      else if (signupType == 'phone') {
        let i = "ifo[1]"
        this.setData({
          [i]: app.globalData.signupContent
        })
      }
    }
    else{
      let i = "answer["+app.globalData.signupId+"]"
      this.setData({
        [i]: app.globalData.signupContent
      })
    }
    app.globalData.signupItem="";
    app.globalData.signupType = "";
    app.globalData.signupContent = "";
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading:true
    })
    _this.setData({
      select_name: options.select_name,
      select_gender: options.select_gender,
      select_college: options.select_college,
      select_phone_number: options.select_phone_number,
      select_grade: options.select_grade,
      requirement: JSON.parse(options.requirement),
      actId: options.actId
    })
    for(let i=0;i<_this.data.requirement.length;i++){
      let ans="answer["+i+"]";
      _this.setData({
        [ans]:""
      })
    }
    let p1=new Promise(function(resolve,reject){
      wx.request({
        url: app.globalData.url+'/account/students/get_current_personal_info/',
        header: {
          "Authorization": app.globalData.token
        },
        complete:(res)=>{
          if(res.statusCode!=200){
            _this.setData({
              loading:false
            })
            wx.showToast({
              title: '网络传输故障！',
              image: '/images/about.png'
            })
            reject(1)
          }
          else{
            // [realname, phone_number, gender, college, grade]
            let ifo = ['', '', '', '', '']
            ifo[0] = res.data.realname;
            ifo[1] = res.data.phone_number;
            let gender = res.data.gender;
            switch (gender) {
              case 'female':
                ifo[2] = "女";
                break;
              case 'male':
                ifo[2] = "男";
                break;
              case 'secret':
                ifo[2] = "保密";
                break;
            }
            ifo[3] = res.data.college;
            ifo[4] = res.data.grade;
            _this.setData({
              ifo:ifo
            })
            resolve(1)
          }
        }
      })
    })
    p1.then(function(results){
      _this.setData({
        loading:false
      })
    })
  },
  bindSexChange:function(e){
    let i="ifo[2]"
    this.setData({
      [i]: this.data.sexArray[e.detail.value]
    })
  },
  bindGradeChange(e) {
    let i = "ifo[4]"
    this.setData({
      [i]: this.data.gradeArray[e.detail.value]
    })
  },
  bindCollegeChange: function (e) {
    let i="ifo[3]"
    this.setData({
      [i]: this.data.collegeArray[e.detail.value]
    })
  },
  toEditName:function(){
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=SignupHomepage&type=name',
    })
  },
  toEditPhone:function(){
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=SignupHomepage&type=phone',
    })
  },
  toEditAnswer:function(e){
    let _this=this;
    let id=e.currentTarget.id;
    if(_this.data.requirement[id].type=='text'){
      wx.navigateTo({
        url: '/pages/editArea/editArea?from=SignupHomepage&type=answer&id=' + id + '&item=text'+"&answer="+_this.data.answer[id]
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/editArea/editArea?from=SignupHomepage&type=answer&id=' + id + '&item=select&array=' + JSON.stringify(_this.data.requirement[id].inner) + "&answer=" + _this.data.answer[id]
      })
    }
  },
  signup:function(){
    let _this=this;
    _this.setData({
      loading:true
    })
    let temp=_this.data.ifo;
    switch (_this.data.ifo[2]) {
      case '女':
        temp[2] = "female";
        break;
      case '男':
        temp[2] = "male";
        break;
      case '保密':
        temp[2] = "secret";
        break;
    if(!_this.data.select_name)
      temp[0]="";
    if(!_this.data.select_gender)
      temp[1]=""
    if(!_this.data.select_college)
      temp[2]=""
    if(!_this.data.select_phone_number)
      temp[3]=""
    if(!_this.data.select_grade)
      temp[4]=""
    }
    wx.request({
      url: app.globalData.url + '/activity/activities/' + _this.data.actId + '/toggle_participation/',
      method:"POST",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        p_info: JSON.stringify(temp),
        forms: JSON.stringify(_this.data.answer)
      },
      complete:(res)=>{
        if(res.statusCode!=201){
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '网络传输故障！',
            image:'/images/about.png'
          })
        }
        else{
          _this.setData({
            loading: false
          })
          app.globalData.actSignupSuccess="ok";
          wx.navigateBack({
            delta: 1
          })
        }
        }
    })
  }
})

