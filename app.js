var md5 = require('/utils/MD5.js')

App({
  globalData: {
    navbarHeight: 0,
    url: "https://ulife.org.cn/api",
    stuEditType: "", //学生编辑页面跳转到输入文字的界面（stuArea）数据传递问题，暂时只能用全局变量来解决，不然路由栈会有显示问题
    stuEditContent: "",
    signupType:"",
    signupContent:"",
    signupItem:"",
    actSignupSuccess:"",
    signupId:0,
    isLogin: false,
    token: "",
    name: "",
    uid: "",
    avatar: "",
    user_url: "",
    inbox_count: 0,
    type: "none"
  },
  onLaunch: function() {
    let _this = this;
    //获得导航栏高度
    wx.getSystemInfo({
      success: res => {
        this.globalData.navbarHeight = res.statusBarHeight + 46;
      },
      fail: function(err) {
        console.log(err)
      }
    })
    var url0, url1;
    url0 = wx.getStorageSync(md5.hex_md5("user_url"))
    url1 = wx.getStorageSync(md5.hex_md5("org_url"));
    _this.globalData.token = (wx.getStorageSync(md5.hex_md5("token")) == "" ? "" : "Token " + wx.getStorageSync(md5.hex_md5("token")));
    _this.globalData.avatar = wx.getStorageSync(md5.hex_md5("avatar"));
    if(url0!=""){
      var admin=wx.getStorageSync(md5.hex_md5("admin"));
      if(admin!="")
        _this.globalData.type="student";  
      else if(admin=="true")
        _this.globalData.type="admin";
      // 普通用户
      wx.request({
        url: _this.globalData.url + '/account/students/get_toolbar/',
        header: {
          "Authorization": _this.globalData.token
        },
        complete: (res) => {
          if (res.data.detail == "Token has expired" || res.data.detail == "Invalid token") {
            _this.globalData.type = "none";
            wx.clearStorageSync();
          } else if (res.statusCode != 200) {
            console.log(res)
          } else {
            _this.globalData.isLogin=true;
            _this.globalData.uid=res.data.user;
            wx.setStorageSync(md5.hex_md5("uid"), res.data.user);
            _this.globalData.inbox_count=res.data.inbox_count;
            _this.globalData.avatar = _this.globalData.url + res.data.avatar + '.thumbnail.3.jpg';
            wx.setStorageSync(md5.hex_md5("avatar"), _this.globalData.avatar);
            _this.globalData.name = res.data.nickname;
            wx.setStorageSync(md5.hex_md5("name"), res.data.nickname);
          }
        }
      })
    }
    else if(url1 != ""){
      // 组织用户
      _this.globalData.type="org";
      wx.request({
        url: _this.globalData.url + '/account/orgs/get_toolbar/',
        headers: {
          "Authorization":_this.globalData.token
        },
        complete:function(res){
          if (res.data.detail == "Token has expired" || res.data.detail == "Invalid token") {
            _this.globalData.type = "none";
            wx.clearStorageSync();
          } else if (res.statusCode != 200) {
            console.log(res)
          } else {
            _this.globalData.isLogin=true;
            wx.setStorageSync(md5.hex_md5("uid"), res.data.user);
            _this.globalData.uid=res.data.user;
            _this.globalData.inbox_count=res.data.inbox_count;
            _this.globalData.avatar = _this.globalData.url + res.data.avatar + '.thumbnail.3.jpg';
            wx.setStorageSync(md5.hex_md5("avatar"), _this.globalData.avatar);
            _this.globalData.name = res.data.org_name;
            wx.setStorageSync(md5.hex_md5("name"), _this.globalData.org_name);
          }
        }
      })
    }
  },
})