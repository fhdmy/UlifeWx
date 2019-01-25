var md5 = require('/utils/MD5.js')

App({
  globalData: {
    navbarHeight: 0,
    url: "https://ulife.org.cn/api",
    // url: "http://27.50.136.70/api",
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
  // watch
  // https://blog.csdn.net/xuyangxinlei/article/details/81408200
  setWatcher(page) {
    let data = page.data;
    let watch = page.watch;
    Object.keys(watch).forEach(v => {
      let key = v.split('.'); // 将watch中的属性以'.'切分成数组
      let nowData = data; // 将data赋值给nowData
      for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
        nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
      }
      let lastKey = key[key.length - 1];
      // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
      let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
      let deep = watch[v].deep; // 若未设置deep,则为undefine
      this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
    })
  },
  /**
   * 监听属性 并执行监听函数
   */
  observe(obj, key, watchFun, deep, page) {
    var val = obj[key];
    // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
    if (deep && val != null && typeof val === 'object') {
      Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
        this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
      })
    }
    var that = this;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
        watchFun.call(page, value, val); // value是新值，val是旧值
        val = value;
        if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
          that.observe(obj, key, watchFun, deep, page);
        }
      },
      get: function () {
        return val;
      }
    })
  }
})