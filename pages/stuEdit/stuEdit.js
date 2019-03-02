//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    loading:false,
    btnLoading:false,
    hiddenmodalput:true,
    clock:0,
    clo:null,
    cfmNumber:"",
    cfmOnlyPhone:"",
    userurl:"",
    avatar:"",
    nickname:"",
    realname:"",
    originPhone:"",
    phone:"",
    sex:"男",
    college:"社区学院",
    grade:"大一",
    gradeArray:["大一","大二","大三","大四","其他"],
    collegeArray: [
      '理学院', '生命科学学院', '文学院', '法学院', '外国语学院', '社会学院', '计算机工程与科学学院','机电工程与自动化学院', '通信与信息工程学院', '环境与化学工程学院', '材料科学与工程学院', '中欧工程技术学院', '土木工程系', '材料基因组工程研究院','经济学院', '管理学院', '图书情报档案系', '悉尼工商学院', '管理教育研究院','上海电影学院', '上海美术学院', '音乐学院', '数码艺术学院', '上海温哥华电影学院','社区学院', '钱伟长学院', '体育学院','其他',
    ],
    sexArray:["男","女","保密"]
  },
  onShow: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
    })
    var stuEditType = app.globalData.stuEditType;
    if(stuEditType=="nickname"){
      this.setData({
        nickname:app.globalData.stuEditContent
      })
    }
    else if(stuEditType=='realname'){
      this.setData({
        realname:app.globalData.stuEditContent
      })
    }
    else if(stuEditType=='phone'){
      this.setData({
        phone:app.globalData.stuEditContent
      })
    }
    app.globalData.stuEditContent="";
    app.globalData.stuEditType="";
  },
  onLoad:function(){
    let _this=this;
    // _this.setData({
    //   loading:true
    // })
    //发请求
    _this.data.userurl = wx.getStorageSync(md5.hex_md5("user_url"));
    wx.request({
      url: app.globalData.url + '/account/students/' + _this.data.userurl + '/',
      header: {
        "Authorization": app.globalData.token
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          // _this.setData({
          //   loading: false
          // })
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }
        else {
          let gender;
          if (res.data.gender == "male")
            gender = "男";
          else if (res.data.gender == "female")
            gender = "女";
          else gender = "保密";
          _this.data.originPhone = res.data.phone_number
          _this.setData({
            phone: res.data.phone_number,
            nickname: res.data.nickname,
            realname: res.data.realname,
            college: res.data.college,
            grade: res.data.grade,
            sex: gender,
            avatar: wx.getStorageSync(md5.hex_md5("avatar")),
            // loading: false
          })
        }
      }
    })
  },
  onUnload:function(){
    clearInterval(this.data.clo);
  },
  watch:{
    clock:function(newVal){
      if(newVal==0){
        clearInterval(this.data.clo);
      }
    }
  },
  bindGradeChange(e) {
    this.setData({
      grade: this.data.gradeArray[e.detail.value]
    })
  },
  bindCollegeChange:function(e){
    this.setData({
      college: this.data.collegeArray[e.detail.value]
    })
  },
  bindSexChange: function (e) {
    this.setData({
      sex: this.data.sexArray[e.detail.value]
    })
  },
  toFurtherInform:function(){
    wx.navigateTo({
      url: '/pages/stuFurtherEdit/stuFurtherEdit',
    })
  },
  inputConfirm:function(e){
    this.setData({
      cfmNumber: e.detail.value
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  getConfirm:function(){
    let _this=this;
    wx.request({
      url: app.globalData.url +'/account/students/phone_number_verification/',
      method: 'POST',
      data: {
        phone_number: _this.data.phone
      },
      complete:(res)=>{
        if (res.data =="Phone number already exists"){
          wx.showToast({
            title: '手机号已存在',
            image: '/images/about.png'
          })
        }
        else if(res.statusCode!=200){
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        } 
        else{
          _this.setData({
            clock: 60,
            cfmOnlyPhone:_this.data.phone
          })
          _this.data.clo = setInterval(function () {
            _this.setData({
              clock: _this.data.clock - 1
            })
          }, 1000)
        }
      }
    })
  },
  //确认  
  confirm: function () {
    let _this=this;
    if (_this.data.cfmOnlyPhone!=_this.data.phone){
      wx.showToast({
        title: '没有获得验证码',
        image: '/images/about.png'
      })
      return;
    }
    _this.setData({
      loading:true
    })
    wx.request({
      url: app.globalData.url +'/account/students/phone_number_verification/',
      method:"POST",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        phone_number: _this.data.phone,
        vericode: _this.data.cfmNumber
      },
      complete:(res)=>{
        if (res.data =="Incorrect vericode"){
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '验证码错误',
            image: '/images/about.png'
          })
        }
        else if(res.statusCode!=200){
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }else{
          _this.setData({
            hiddenmodalput: true
          })
          _this.save(true);
        }
      }
    })
  },
  confirmSave(){
    let _this = this;
    if(_this.data.nickname=="" || _this.data.realname=="" || _this.data.phone=="" || _this.data.gender=="" || _this.data.college=="" || _this.data.grade==""){
      wx.showToast({
        title: '信息填写不完整',
        image: '/images/about.png'
      })
      return;
    }
    if (_this.data.phone.length > 0 && _this.data.phone != _this.data.originPhone) {
      const pattern = /^1(3|4|5|7|8)\d{9}$/;
      if (pattern.test(_this.data.phone) == false) {
        wx.showToast({
          title: '手机号格式错误',
          image: '/images/about.png'
        })
        return;
      }
      else {
        _this.setData({
          hiddenmodalput: false
        })
      }
    }else{
      _this.save(false);
    }
  },
  save:function(cfmPhone){
    let _this=this;
    if (cfmPhone==false)
      _this.setData({
        btnLoading:true
      })
    let p1=new Promise(function(resolve,reject){
      let gender;
      switch(_this.data.sex){
        case "男":
          gender="male";
          break;
        case "女":
          gender="female";
          break;
        case "保密":
          gender="secret";
          break;
      }
      wx.request({
        method: 'PUT',
        url: app.globalData.url+'/account/students/' + _this.data.userurl + '/',
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          nickname: _this.data.nickname,
          realname: _this.data.realname,
          gender: gender,
          college: _this.data.college,
          grade: _this.data.grade,
          phone_number: _this.data.phone
        },
        complete:(res)=>{
          if(res.statusCode!=200){
            _this.setData({
              loading:false,
              btnLoading:false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            reject(1)
          }
          else{
            app.globalData.name=_this.data.nickname;
            wx.setStorageSync(md5.hex_md5("name"), _this.data.nickname);
            resolve(1)
          }
        }
      })
    })
    let p2=new Promise(function(resolve,reject){
      if (_this.data.avatar.substr(0, app.globalData.url.length) ==app.globalData.url){
        resolve(2)
      }else{
        wx.uploadFile({
          url: app.globalData.url + '/account/user-avatar-upload/',
          filePath: _this.data.avatar,
          name: 'file',
          header: {
            'Content-Type': 'multipart/form-data',
            "Authorization": app.globalData.token
          },
          complete: (r) => {
            if (r.statusCode != 201) {
              _this.setData({
                loading: false,
                btnLoading: false
              })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              reject(2)
            }
            else {
              let data = JSON.parse(r.data)
              wx.setStorageSync(md5.hex_md5("avatar"), app.globalData.url + data.avatar)
              app.globalData.avatar = app.globalData.url + data.avatar
              resolve(2)
            }
          }
        })
      }
    })
    Promise.all([p1,p2]).then(function(results){
      _this.setData({
        loading: false,
        btnLoading: false
      })
      wx.navigateBack({
        delta: 1
      })
    })
  },
  changeAvatar:function(){
    let _this=this;
    wx.chooseImage({
      count:1,
      success: function(res) {
        let size=res.tempFiles[0].size;
        if (size > 10485760){
          wx.showToast({
            title: '图片太大了',
            image: '/images/about.png'
          })
          return;
        }
        _this.setData({
          avatar: res.tempFilePaths[0]
        })
      },
    })
  },
  toEditAreaNickname:function(){
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=stuEdit&type=nickname',
    })
  },
  toEditAreaRealname: function () {
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=stuEdit&type=realname',
    })
  },
  toEditAreaPhone: function () {
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=stuEdit&type=phone',
    })
  }
})

