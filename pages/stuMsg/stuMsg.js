//获取应用实例
const app = getApp()

Page({
  data: {
    navH: 0,
    loading:false,
    scroll: false,
    msg:[],
    moremsg:"",
    presentmsg:0,
    msgmax:0,
    setStar:[]
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight
    })
    var id = wx.getStorageSync(md5.hex_md5("user_url"))
    if (id == "") {
      wx.showModal({
        title: '未登录Ulife',
        content: '请登录后再进入此页面。',
        showCancel: false,
        confirmText: '确定',
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
    _this.setData({
      loading:true
    })
    let p1=new Promise(function(resolve,reject){
      wx.request({
        url: app.globalData.url+'/message/messages/my_inbox/',
        header: {
          "Authorization": app.globalData.token
        },
        complete:(res)=>{
          if(res.statusCode!=200)
            resolve(1);
          else{
            for (let k = 0; k < res.data.results.length; k++) {
              var nickname, avatar, id, type, url, msg_id, msg_type, reminder_act_name, reminder_act_id;
              msg_type = (res.data.results[k]._type == 'reminder') ? 'reminder' : 'formal';
              reminder_act_name = (res.data.results[k]._type == 'reminder') ? res.data.results[k].reminder_act_name : null;
              reminder_act_id = (res.data.results[k]._type == 'reminder') ? res.data.results[k].reminder_act_id : null;
              // 组织
              if (res.data.results[k].sender.org != null) {
                avatar = app.globalData.url + res.data.results[k].sender.org.avatar + '.thumbnail.2.jpg';
                nickname = res.data.results[k].sender.org.org_name;
                id = res.data.results[k].sender.org.id;
                type = 'org';
              }
              // 学生
              else if (res.data.results[k].sender.student != null) {
                avatar = app.globalData.url + res.data.results[k].sender.student.avatar + '.thumbnail.2.jpg';
                nickname = res.data.results[k].sender.student.nickname;
                id = res.data.results[k].sender.student.id;
                type = 'user';
              }
              if (res.data.results[k].sender.is_staff == true) {
                nickname = '系统消息';
                avatar = '/images/system_message.png';
              }
              let computeddate = res.data.results[k].sent_at.split('T');
              msg_id = res.data.results[k].id;
              let ms="msg["+k+"]";
              _this.setData({
                [ms]:{
                  index: res.data.results[k].index,
                  date: computeddate[0],
                  avatar: avatar,
                  id: id,
                  nickname: nickname,
                  type: type,
                  msg_id: msg_id,
                  is_read: res.data.results[k].is_read,
                  msg_type: msg_type,
                  reminder_act_name: reminder_act_name,
                  reminder_act_id: reminder_act_id,
                  stars: 0
                }
              })
            }
            _this.setData({
              moremsg:res.data.next,
              presentmsg:res.data.results.length,
              msgmax:res.data.count
            })
            resolve(1);
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
  scrollBottom: function () {
    let _this = this;
    if (_this.data.msgmax == _this.data.presentmsg || _this.data.scroll == true)
      return;
    //更多活动
    _this.setData({
      loading: true,
      scroll: true
    })
    var pm = new Promise(function (resolve, reject) {
      wx.request({
        url: _this.data.moremsg,
        header: {
          "Authorization": app.globalData.token
        },
        complete: (res) => {
          if (res.statusCode != 200) {
            resolve("pm");
          }
          else {
            for (let k = 0; k < res.data.results.length; k++) {
              var nickname, avatar, id, type, url, msg_id, msg_type, reminder_act_name, reminder_act_id;
              msg_type = (res.data.results[k]._type == 'reminder') ? 'reminder' : 'formal';
              reminder_act_name = (res.data.results[k]._type == 'reminder') ? res.data.results[k].reminder_act_name : null;
              reminder_act_id = (res.data.results[k]._type == 'reminder') ? res.data.results[k].reminder_act_id : null;
              // 组织
              if (res.data.results[k].sender.org != null) {
                avatar = app.globalData.url + res.data.results[k].sender.org.avatar + '.thumbnail.2.jpg';
                nickname = res.data.results[k].sender.org.org_name;
                id = res.data.results[k].sender.org.id;
                type = 'org';
              }
              // 学生
              else if (res.data.results[k].sender.student != null) {
                avatar = app.globalData.url + res.data.results[k].sender.student.avatar + '.thumbnail.2.jpg';
                nickname = res.data.results[k].sender.student.nickname;
                id = res.data.results[k].sender.student.id;
                type = 'user';
              }
              if (res.data.results[k].sender.is_staff == true) {
                nickname = '系统消息';
                avatar = '/images/system_message.png';
              }
              let computeddate = res.data.results[k].sent_at.split('T');
              msg_id = res.data.results[k].id;
              let ms = "msg[" + parseInt(presentmsg+k)+ "]";
              _this.setData({
                [ms]: {
                  index: res.data.results[k].index,
                  date: computeddate[0],
                  avatar: avatar,
                  id: id,
                  nickname: nickname,
                  type: type,
                  msg_id: msg_id,
                  is_read: res.data.results[k].is_read,
                  msg_type: msg_type,
                  reminder_act_name: reminder_act_name,
                  reminder_act_id: reminder_act_id,
                  stars: 0
                }
              })
            }
            _this.setData({
              moremsg: res.data.next,
              presentmsg: res.data.results.length+_this.data.presentmsg
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
  },
  openOrg: function (e) {
    wx.navigateTo({
      url: '/pages/orgDisplay/orgDisplay?orgId=' + e.target.id,
    })
  },
  openAct:function(e){
    wx.navigateTo({
      url: '/pages/actShow/actShow?actId=' + e.target.id,
    })
  },
  tagRead:function(e){
    wx.showModal({
      content: '标记为已读吗？',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          //取消关注api
          let id = e.target.id
        } else if (res.cancel) {
          console.log('取消按钮')
        }
      }
    })
  },
  sliderchange:function(e){
    let st ="setStar["+e.target.id+"]";
    this.setData({
      [st]: e.detail.value
    })
  },
  submit:function(e){
    let _this=this;
    let star = (_this.data.setStar[e.target.id] == null) ? 2 : _this.data.setStar[e.target.id];
  }
})

