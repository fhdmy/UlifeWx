//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading: false,
    hiddenmodalput: true,
    clock: 0,
    clo: null,
    cfmOnlyPhone: "",
    cfmNumber: "",
    sexArray: ["男", "女", "保密"],
    gradeArray: ["大一", "大二", "大三", "大四", "其他"],
    collegeArray: [
      '理学院', '生命科学学院', '文学院', '法学院', '外国语学院', '社会学院', '计算机工程与科学学院', '机电工程与自动化学院', '通信与信息工程学院', '环境与化学工程学院', '材料科学与工程学院', '中欧工程技术学院', '土木工程系', '材料基因组工程研究院', '经济学院', '管理学院', '图书情报档案系', '悉尼工商学院', '管理教育研究院', '上海电影学院', '上海美术学院', '音乐学院', '数码艺术学院', '上海温哥华电影学院', '社区学院', '钱伟长学院', '体育学院', '其他',
    ],
    ifo: ['', '', '', '', ''],//[realname, phone_number, gender, college, grade]
    originPhone: "",
    select_name: true,
    select_gender: true,
    select_college: true,
    select_phone_number: true,
    select_grade: true,
    requirement: [],
    actId: 0,
    answer: [],
    btnLoading:false
  },
  onShow: function (options) {
    let _this = this;
    let signupType = app.globalData.signupType;
    // 个人信息
    if (app.globalData.signupItem == "") {
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
    else {
      let i = "answer[" + app.globalData.signupId + "]"
      this.setData({
        [i]: app.globalData.signupContent
      })
    }
    app.globalData.signupItem = "";
    app.globalData.signupType = "";
    app.globalData.signupContent = "";
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    _this.setData({
      loading: true
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
    for (let i = 0; i < _this.data.requirement.length; i++) {
      let ans = "answer[" + i + "]";
      _this.setData({
        [ans]: ""
      })
    }
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/account/students/get_current_personal_info/',
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            _this.setData({
              loading: false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
            reject(1)
          }
          else {
            // [realname, phone_number, gender, college, grade]
            let ifo = ['', '', '', '', '']
            ifo[0] = res.data.realname;
            ifo[1] = res.data.phone_number;
            _this.data.originPhone = res.data.phone_number;
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
              ifo: ifo
            })
            resolve(1)
          }
        }
      })
    })
    p1.then(function (results) {
      _this.setData({
        loading: false
      })
    })
  },
  onUnload: function () {
    clearInterval(this.data.clo);
  },
  watch: {
    clock: function (newVal) {
      if (newVal == 0) {
        clearInterval(this.data.clo);
      }
    }
  },
  bindSexChange: function (e) {
    let i = "ifo[2]"
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
    let i = "ifo[3]"
    this.setData({
      [i]: this.data.collegeArray[e.detail.value]
    })
  },
  toEditName: function () {
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=SignupHomepage&type=name',
    })
  },
  toEditPhone: function () {
    wx.navigateTo({
      url: '/pages/editArea/editArea?from=SignupHomepage&type=phone',
    })
  },
  toEditAnswer: function (e) {
    let _this = this;
    let id = e.currentTarget.id;
    if (_this.data.requirement[id].type == 'text') {
      wx.navigateTo({
        url: '/pages/editArea/editArea?from=SignupHomepage&type=answer&id=' + id + '&item=text' + "&answer=" + _this.data.answer[id]
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/editArea/editArea?from=SignupHomepage&type=answer&id=' + id + '&item=select&array=' + JSON.stringify(_this.data.requirement[id].inner) + "&answer=" + _this.data.answer[id]
      })
    }
  },
  signup: function (cfmPhone) {
    let _this = this;
    let temp = _this.data.ifo;
    if(cfmPhone==false)
      _this.setData({
        btnLoading:true
      })
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
        if (!_this.data.select_name)
          temp[0] = "";
        if (!_this.data.select_gender)
          temp[1] = ""
        if (!_this.data.select_college)
          temp[2] = ""
        if (!_this.data.select_phone_number)
          temp[3] = ""
        if (!_this.data.select_grade)
          temp[4] = ""
    }
    wx.request({
      url: app.globalData.url + '/activity/activities/' + _this.data.actId + '/toggle_participation/',
      method: "POST",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        p_info: JSON.stringify(temp),
        forms: JSON.stringify(_this.data.answer)
      },
      complete: (res) => {
        if (res.statusCode != 201) {
          _this.setData({
            loading: false,
            btnLoading: false
          })
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }
        else {
          _this.setData({
            loading: false,
            btnLoading: false
          })
          app.globalData.actSignupSuccess = "ok";
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  // 验证手机号
  inputConfirm: function (e) {
    this.setData({
      cfmNumber: e.detail.value
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  getConfirm: function () {
    let _this = this;
    wx.request({
      url: app.globalData.url + '/account/students/phone_number_verification/',
      method: 'POST',
      data: {
        phone_number: _this.data.ifo[1]
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }
        else {
          _this.setData({
            cfmOnlyPhone: _this.data.ifo[1],
            clock: 60
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
    let _this = this;
    if (_this.data.cfmOnlyPhone != _this.data.ifo[1]) {
      wx.showToast({
        title: '未获得验证码',
        image: '/images/about.png'
      })
      return;
    }
    if (_this.data.cfmNumber==""){
      wx.showToast({
        title: '验证码为空',
        image: '/images/about.png'
      })
      return;
    }
    _this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.url + '/account/students/phone_number_verification/',
      method: "POST",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        phone_number: _this.data.ifo[1],
        vericode: _this.data.cfmNumber
      },
      complete: (res) => {
        if (res.data == "Incorrect vericode") {
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '验证码错误',
            image: '/images/about.png'
          })
        }
        else if (res.statusCode != 200) {
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        } else {
          _this.setData({
            hiddenmodalput: true
          })
          _this.signup(true);
        }
      }
    })
  },
  confirmSave() {
    let _this = this;
    if (_this.data.answer.length != _this.data.requirement.length) {
      wx.showToast({
        title: '信息未填写完整',
        image: '/images/about.png'
      })
      return;
    }
    for (let k = 0; k < _this.data.requirement.length; k++) {
      if (_this.data.answer[k] == null || _this.data.answer[k] == "" || _this.data.answer[k] == undefined) {
        wx.showToast({
          title: '信息未填写完整',
          image: '/images/about.png'
        })
        return;
      }
    }
    if (_this.data.select_name==true && _this.data.ifo[0]==""){
      wx.showToast({
        title: '信息未填写完整',
        image: '/images/about.png'
      })
      return;
    }
    if (_this.data.select_phone_number == true && _this.data.ifo[1] == "") {
      wx.showToast({
        title: '信息未填写完整',
        image: '/images/about.png'
      })
      return;
    }
    if (_this.data.select_gender == true && _this.data.ifo[2] == "") {
      wx.showToast({
        title: '信息未填写完整',
        image: '/images/about.png'
      })
      return;
    }
    if (_this.data.select_college == true && _this.data.ifo[3] == "") {
      wx.showToast({
        title: '信息未填写完整',
        image: '/images/about.png'
      })
      return;
    }
    if (_this.data.select_grade == true && _this.data.ifo[4] == "") {
      wx.showToast({
        title: '信息未填写完整',
        image: '/images/about.png'
      })
      return;
    }
    if (_this.data.ifo[1].length > 0 && _this.data.ifo[1] != _this.data.originPhone) {
      const pattern = /^1(3|4|5|7|8)\d{9}$/;
      if (pattern.test(_this.data.ifo[1]) == false) {
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
    } else {
      _this.signup(false);
    }
  },
})

