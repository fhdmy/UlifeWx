//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading: false,
    scroll: false,
    actId: 0,
    signupOptions: ['报名统计', '个人数据', '发布消息', '消息历史', '群发短信', '短信历史', '二维码'],
    currentOption: 0,
    history_msg: [],
    morehistory_msg: "",
    presenthistory_msg: 0,
    history_msgmax: 0,
    personal_data: [],
    question: [],
    signup_npeople:[],
    collegetable:[],
    statistics_items:[],
    history_phone_msg:[],
    morehistory_phone_msg:"",
    presenthistory_phone:0,
    history_phone_max:0,
    college_judge:false,
    msgContent:"",
    msgTarget:"",
    phoneContent: "",
    phoneTarget: "",
    orgPhone:"",
    etc:`示例:

    输入:
    亲爱的$name(点击"姓名")同学，您成功报名我们的活动。若有疑问，可通过拨打电话或发送短信至13912345678(点击"组织手机号")联系我们。
    
    输出:
    亲爱的小张同学，您成功报名我们的活动。若有疑问，可通过拨打电话或发送短信至13912345678联系我们。`
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
      actId: options.actId,
      loading: true
    })
    // 历史消息
    let p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/message/messages/my_outbox/',
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
            for (let k = 0; k < res.data.results.length; k++) {
              let nickname, avatar, id, type, url, msg_id;
              // 组织
              if (res.data.results[k].receiver.org != null) {
                avatar = app.globalData.url + res.data.results[k].receiver.org.avatar + '.thumbnail.2.jpg';
                nickname = res.data.results[k].receiver.org.org_name;
                id = res.data.results[k].receiver.org.id;
                type = 'org';
              }
              // 学生
              else if (res.data.results[k].receiver.student != null) {
                avatar = app.globalData.url + res.data.results[k].receiver.student.avatar + '.thumbnail.2.jpg';
                nickname = res.data.results[k].receiver.student.nickname;
                id = res.data.results[k].receiver.student.id;
                type = 'user';
              }
              let computeddate = res.data.results[k].sent_at.split('T');
              msg_id = res.data.results[k].id;
              let hm = "history_msg[" + k + "]"
              _this.setData({
                [hm]: {
                  index: res.data.results[k].index,
                  date: computeddate[0],
                  avatar: avatar,
                  id: id,
                  nickname: nickname,
                  type: type,
                  msg_id: msg_id
                }
              })
            }
            _this.setData({
              morehistory_msg: res.data.next,
              presenthistory_msg: res.data.results.length,
              history_msgmax: res.data.count
            })
            resolve(1);
          }
        }
      })
    })
    let p2 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/' + _this.data.actId + '/get_participants_info/',
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
            reject(2)
          }
          else {
            // 个人数据
            for (let k = 0; k < res.data.participations.length; k++) {
              let gender;
              let p_info = JSON.parse(res.data.participations[k].p_info);
              if (p_info[2] == 'male') {
                gender = '男';
              } else if (p_info[2] == 'female') {
                gender = '女';
              } else if (p_info[2] == '') {
                gender = '/';
              }
              let pd = "personal_data[" + k + "]"
              _this.setData({
                [pd]: {
                  gender: gender,
                  college: p_info[3] == '' ? '/' : p_info[3],
                  credit: res.data.participations[k].student.credit,
                  grade: p_info[4] == '' ? '/' : p_info[4],
                  nickname: res.data.participations[k].student.nickname,
                  phone_number: p_info[1],
                  realname: p_info[0],
                  student_no: res.data.participations[k].student.student_no,
                  id: res.data.participations[k].student.id,
                  answer: JSON.parse(res.data.participations[k].forms)
                }
              })
            }
            _this.setData({
              question: JSON.parse(res.data.requirement)
            })
            // 获得p_info
            let gender__male_sum = 0;
            let gender__female_sum = 0;
            let gender__freshman_sum = 0;
            let gender__sophomore_sum = 0;
            let gender__junior_sum = 0;
            let gender__senior_sum = 0;
            for (let k = 0; k < res.data.participations.length; k++) {
              let gender;
              let p_info = JSON.parse(res.data.participations[k].p_info);
              if (p_info[2] == 'male') {
                gender = '男';
                gender__male_sum++;
              } else if (p_info[2] == 'female') {
                gender = '女';
                gender__female_sum++;
              }
              switch (p_info[4]) {
                case '大一':
                  gender__freshman_sum++;
                  break;
                case '大二':
                  gender__sophomore_sum++;
                  break;
                case '大三':
                  gender__junior_sum++;
                  break;
                case '大四':
                  gender__senior_sum++;
                  break;
              }
              if (p_info[2] == "") {
                gender__male_sum = '/';
                gender__female_sum = '/';
              }
              if (p_info[4] == "") {
                gender__freshman_sum = '/';
                gender__sophomore_sum = '/';
                gender__junior_sum = '/';
                gender__senior_sum = '/';
              }
              if (p_info[3] == "") 
                _this.setData({
                  college_judge : false
                })
              else
                _this.setData({
                  college_judge: true
                })
            }
            let sn ="signup_npeople[0]"
            _this.setData({
              [sn]:{
                male: gender__male_sum,
                female: gender__female_sum,
                freshman: gender__freshman_sum,
                sophomore: gender__junior_sum,
                junior: gender__junior_sum,
                senior: gender__senior_sum,
                count: res.data.participations.length
              }
            })
            resolve(2)
          }
        }
      })
    })
    // 获取院系表格
    let p3 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/' + _this.data.actId + '/participants_stat1/',
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
            reject(3)
          }
          else {
            for (let k = 0; k < res.data.length; k++) {
              let ct ="collegetable["+k+"]";
              _this.setData({
                [ct]:{
                  college: res.data[k].college,
                  count: res.data[k].participants.length,
                  participants: res.data[k].participants
                }
              })
            }
            resolve(3)
          }
        }
      })
    })
    // 获取统计数据
    let p4 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/activity/activities/' + _this.data.actId + '/participants_stat2/',
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
            reject(4)
          }
          else {
            for (let k = 0; k < res.data.length; k++) {
              let si ="statistics_items["+k+"]"
              let ch=[];
              for (let j = 0; j < res.data[k].choices.length; j++) {
                ch[j]={
                  item: res.data[k].choices[j].choice,
                  npeople: res.data[k].choices[j].participants.length,
                  participants: res.data[k].choices[j].participants
                }
              }
              _this.setData({
                [si]:{
                  headers: [{
                    text: '选项',
                    align: 'center',
                    sortable: false,
                    value: 'item'
                  },
                  {
                    text: res.data[k].title,
                    align: 'center',
                    value: 'npeople'
                  }
                  ],
                  choices:ch
                }
              })
            }
            resolve(4)
          }
        }
      })
    })
    // 获得历史短信
    let p5 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + '/sms/sms/',
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
            reject(5)
          }
          else {
            for (let k = 0; k < res.data.results.length; k++) {
              let hpm ="history_phone_msg["+k+"]"
              _this.setData({
                [hpm]:{
                  template_param: res.data.results[k].template_param,
                  phone_numbers: res.data.results[k].phone_numbers,
                }
              })
            }
            _this.setData({
              morehistory_phone_msg : res.data.next,
              presenthistory_phone : res.data.results.length,
              history_phone_max : res.data.count
            })
            resolve(5)
          }
        }
      })
    })
    Promise.all([p1,p2,p3,p4,p5]).then(function(){
      _this.setData({
        loading:false
      })
    })
  },
  swiperChange: function (e) {
    let curr = e.detail.current;
    this.setData({
      currentOption: curr
    })
  },
  swiperTap: function (e) {
    this.setData({
      currentOption: e.currentTarget.id
    })
  },
  scrollBottom: function () {
    let _this = this;
    // 历史消息
    if(_this.data.currentOption==3){
      if (_this.data.history_msgmax == _this.data.presenthistory_msg || _this.data.scroll == true)
        return;
      //更多活动
      _this.setData({
        loading: true,
        scroll: true
      })
      var pm = new Promise(function (resolve, reject) {
        wx.request({
          url: _this.data.morehistory_msg,
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              _this.setData({
                loading:false,
                scroll:false
              })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              reject("pm");
            }
            else {
              for (let k = 0; k < res.data.results.length; k++) {
                let nickname, avatar, id, type, url, msg_id;
                // 组织
                if (res.data.results[k].receiver.org != null) {
                  avatar = app.globalData.url + res.data.results[k].receiver.org.avatar + '.thumbnail.2.jpg';
                  nickname = res.data.results[k].receiver.org.org_name;
                  id = res.data.results[k].receiver.org.id;
                  type = 'org';
                }
                // 学生
                else if (res.data.results[k].receiver.student != null) {
                  avatar = app.globalData.url + res.data.results[k].receiver.student.avatar + '.thumbnail.2.jpg';
                  nickname = res.data.results[k].receiver.student.nickname;
                  id = res.data.results[k].receiver.student.id;
                  type = 'user';
                }
                let computeddate = res.data.results[k].sent_at.split('T');
                msg_id = res.data.results[k].id;
                let hm = "history_msg[" + parseInt(_this.data.presenthistory_msg+k)+"]"
                _this.setData({
                  [hm]:{
                    index: res.data.results[k].index,
                    date: computeddate[0],
                    avatar: avatar,
                    id: id,
                    nickname: nickname,
                    type: type,
                    msg_id: msg_id
                  }
                })
              }
              _this.setData({
                morehistory_msg: res.data.next,
                presenthistory_msg: _this.data.presenthistory_msg+res.data.results.length
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
    // 历史短信
    else{
      if (_this.data.history_phone_max == _this.data.presenthistory_phone || _this.data.scroll == true)
        return;
      //更多活动
      _this.setData({
        loading: true,
        scroll: true
      })
      var pm = new Promise(function (resolve, reject) {
        wx.request({
          url: _this.data.morehistory_msg,
          header: {
            "Authorization": app.globalData.token
          },
          complete: (res) => {
            if (res.statusCode != 200) {
              _this.setData({
                loading: false,
                scroll: false
              })
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
              reject("pm");
            }
            else {
              for (let k = 0; k < res.data.results.length; k++) {
                let hpm = "history_phone_msg[" + parseInt(_this.data.presenthistory_phone+k)+"]";
                _this.setData({
                  template_param: res.data.results[k].template_param,
                  phone_numbers: res.data.results[k].phone_numbers,
                })
              }
              _this.setData({
                morehistory_phone_msg : res.data.next,
                presenthistory_phone: _this.data.presenthistory_phone+res.data.results.length
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
  tapNickname:function(e){
    wx.navigateTo({
      url: '/pages/stuDisplay/stuDisplay?stuId=' + e.target.id,
    })
  },
  openCollegeDetail:function(e){
    let index=e.target.id;
    app.globalData.signupDetail = this.data.collegetable[index].participants
    app.globalData.formItem = this.data.collegetable[index].college
    wx.navigateTo({
      url: "/pages/signupShowDetail/signupShowDetail",
    })
  },
  openItemDetail:function(e){
    let index = e.target.id[0];
    let idx=e.target.id[1];
    app.globalData.signupDetail = this.data.statistics_items[index].choices[idx].participants
    app.globalData.formItem = this.data.statistics_items[index].choices[idx].item
    wx.navigateTo({
      url: "/pages/signupShowDetail/signupShowDetail",
    })
  },
  msgChangeToAll:function(){
    this.setData({
      msgTarget:"全体报名者"
    })
  },
  inputMsgContent:function(e){
    this.setData({
      msgContent: e.detail.value
    })
  },
  inputMsgTarget:function(e){
    this.setData({
      msgTarget: e.detail.value
    })
  },
  inputOrgPhone:function(e){
    this.setData({
      orgPhone: e.detail.value
    })
  },
  inputPhoneContent: function (e) {
    this.setData({
      phoneContent: e.detail.value,
    })
  },
  inputPhoneTarget: function (e) {
    this.setData({
      phoneTarget: e.detail.value
    })
  },
  phoneChangeToAll: function () {
    this.setData({
      phoneTarget: "全体报名者"
    })
  },
  phoneInsertName:function(){
    let s = this.data.phoneContent +"$name";
    this.setData({
      phoneContent:s
    })
  },
  phoneInsertOrgPhone:function(){
    let s = this.data.phoneContent + this.data.orgPhone;
    this.setData({
      phoneContent: s
    })
  },
  msgConfirm:function(){
    let _this=this;
    if (_this.data.msgTarget !="全体报名者"){
      wx.request({
        url: app.globalData.url +'/message/messages/',
        method:"POST",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          receiver:_this.data.msgTarget,
          index:_this.data.msgContent
        },
        complete:(res)=>{
          if (res.data =="Username not registered"){
            wx.showToast({
              title: '用户不存在',
              image: '/images/about.png'
            })
          }
          else if(res.statusCode!=201){
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
          else{
            wx.showToast({
              title: '发送成功',
            })
          }
        }
      })
    }
    else{
      wx.request({
        url: app.globalData.url + '/activity/activities/' + _this.data.actId +'/group_send/',
        method: "POST",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          index: _this.data.msgContent
        },
        complete: (res) => {
          if (res.statusCode != 201) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
          else {
            wx.showToast({
              title: '发送成功',
            })
          }
        }
      })
    }
  },
  phoneConfirm:function(){
    let _this = this;
    if (_this.data.phoneTarget != "全体报名者") {
      wx.request({
        url: app.globalData.url + '/activity/activities/' + _this.data.actId +'/send_sms/',
        method: "POST",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          template_param: _this.data.phoneContent,
          phone_numbers: _this.data.phoneTarget
        },
        complete: (res) => {
          if (res.data == "Username not registered") {
            wx.showToast({
              title: '手机号不存在',
              image: '/images/about.png'
            })
          }
          else if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
          else {
            wx.showToast({
              title: '发送成功',
            })
          }
        }
      })
    }
    else {
      wx.request({
        url: app.globalData.url + '/activity/activities/' + _this.data.actId + '/send_sms_batch/',
        method: "POST",
        header: {
          "Authorization": app.globalData.token
        },
        data: {
          template_param: _this.data.phoneContent
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          }
          else {
            wx.showToast({
              title: '发送成功',
            })
          }
        }
      })
    }
  },
  openTarget:function(e){
    wx.navigateTo({
      url: '/pages/stuDisplay/stuDisplay?stuId=' + e.target.id,
    })
  },
  chooseLongTap:function(e){
    let id = e.currentTarget.id;
    let _this = this;
    wx.showActionSheet({
      itemList: ['删除'],
      success(e) {
        _this.deleteMsg(id);
      }
    })
  },
  deleteMsg: function (id) {
    let _this = this;
    wx.showModal({
      content: '你真的要删除这条消息？',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          _this.deleteMsgRequest(id);
        } else if (res.cancel) {
          console.log('取消按钮')
        }
      }
    })
  },
  deleteMsgRequest: function (id) {
    let _this = this;
    wx.request({
      url: app.globalData.url + '/message/messages/' + _this.data.history_msg[id].msg_id + '/set_deleted_by_sender/',
      method: "POST",
      header: {
        "Authorization": app.globalData.token
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        } else {
          let temp = _this.data.history_msg;
          temp.splice(id, 1);
          _this.setData({
            history_msg: temp
          })
        }
      }
    })
  }
})

