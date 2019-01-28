//获取应用实例
const app = getApp()
var md5 = require('../../utils/MD5.js')

Page({
  data: {
    navH: 0,
    loading:false,
    scroll: false,
    msg:[],
    moremsg:"",
    presentmsg:0,
    msgmax:0,
    setStar:[],
    comment:[]
  },
  onLoad: function (options) {
    let _this = this;
    let id = wx.getStorageSync(md5.hex_md5("user_url"));
    _this.setData({
      navH: app.globalData.navbarHeight
    })
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
          if(res.statusCode!=200){
            wx.showToast({
              title: '网络传输故障！',
              image: '/images/about.png'
            })
            resolve(1);
          }
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
                id=-1;
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
            wx.showToast({
              title: '网络传输故障！',
              image: '/images/about.png'
            })
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
                avatar = app.globalData.url + res.data.results[k].sender.org.avatar;
                nickname = res.data.results[k].sender.org.org_name;
                id = res.data.results[k].sender.org.id;
                type = 'org';
              }
              // 学生
              else if (res.data.results[k].sender.student != null) {
                avatar = app.globalData.url + res.data.results[k].sender.student.avatar;
                nickname = res.data.results[k].sender.student.nickname;
                id = res.data.results[k].sender.student.id;
                type = 'user';
              }
              if (res.data.results[k].sender.is_staff == true) {
                nickname = '系统消息';
                avatar = '/images/system_message.png';
                id=-1;
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
    if(e.target.id==-1)
      return;
    wx.navigateTo({
      url: '/pages/orgDisplay/orgDisplay?orgId=' + e.target.id,
    })
  },
  openAct:function(e){
    wx.navigateTo({
      url: '/pages/actShow/actShow?actId=' + e.target.id,
    })
  },
  chooseLongTap:function(e){
    let id = e.currentTarget.id;
    let _this=this;
    if(_this.data.msg[id].msg_type=='reminder'){
      wx.showActionSheet({
        itemList: ['删除'],
        success(e) {
          _this.deleteMsg(id);
        }
      })
    }
    else{
      let list = (_this.data.msg[id].is_read == true) ? ['删除'] : ['标记已读', '删除']
      wx.showActionSheet({
        itemList: list,
        success(e) {
          if (_this.data.msg[id].is_read==true){
            if (e.tapIndex == 0)
              _this.deleteMsg(id);
          }
          else{
            if (e.tapIndex == 0)
              _this.tagReadRequest(id);
            else
              _this.deleteMsg(id);
          }
        }
      })  
    }
  },
  sliderchange:function(e){
    let st ="setStar["+e.target.id+"]";
    this.setData({
      [st]: e.detail.value
    })
  },
  submit:function(e){
    let _this=this;
    let id=e.currentTarget.id;
    let star = (_this.data.setStar[e.target.id] == null) ? 2 : _this.data.setStar[e.target.id];
    let comment = (_this.data.comment[id] == undefined || _this.data.comment[id] == null) ? '' : _this.data.comment[id];//为空对应为''
    if (comment == "") {
      wx.showToast({
        title: '不能为空！',
      })
      return;
    }
    _this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.url + '/activity/activities/' + _this.data.msg[id].reminder_act_id + '/post_comment/',
      method: "POST",
      header: {
        "Authorization": app.globalData.token
      },
      data: {
        index: comment,
        score: _this.data.setStar[id]
      },
      complete: (res) => {
        if (res.statusCode != 201) {
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '网络传输故障！',
            image: '/images/about.png'
          })
        } else {
          let temp=_this.data.msg;
          temp.splice(id,1);
          app.globalData.inbox_count--;
          _this.setData({
            msg:temp,
            loading: false
          })
        }
      }
    })
  },
  inputTextarea:function(e){
    let st = "comment[" + e.target.id + "]";
    this.setData({
      [st]: e.detail.value
    })
  },
  deleteMsg:function(id){
    let _this=this;
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
  tagReadRequest:function(id){
    let _this=this;
    wx.request({
      url: app.globalData.url+'/message/messages/'+_this.data.msg[id].msg_id+'/set_read/',
      method:"POST",
      header: {
        "Authorization": app.globalData.token
      },
      complete:(res)=>{
        if(res.statusCode!=200){
          wx.showToast({
            title: '网络传输故障！',
            image: '/images/about.png'
          })
        }else{
          let m="msg["+id+"].is_read";
          _this.setData({
            [m]:true
          })
          app.globalData.inbox_count--;
        }
      }
    })
  },
  deleteMsgRequest:function(id){
    let _this = this;
    wx.request({
      url: app.globalData.url + '/message/messages/' + _this.data.msg[id].msg_id + '/set_deleted_by_receiver/',
      method: "POST",
      header: {
        "Authorization": app.globalData.token
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络传输故障！',
            image: '/images/about.png'
          })
        } else {
          let temp=_this.data.msg;
          temp.splice(id,1);
          _this.setData({
            msg:temp
          })
          if (!_this.data.msg[id].is_read){
            app.globalData.inbox_count--;
          }
        }
      }
    })
  }
})

