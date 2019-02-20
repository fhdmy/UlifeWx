//获取应用实例
const app = getApp()
var x, y, x1, y1, x2, y2, index, currindex, n, yy,arr1;
Page({
  data: {
    navH: 0,
    loading: false,
    computeddata:[],
    mainx: 0,
    start: { x: 0, y: 0 }
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      navH: app.globalData.navbarHeight,
      computeddata: app.globalData.computeddata,
    })
    arr1 = app.globalData.computeddata
    for(let i=0;i<this.data.computeddata.length;i++){
      let m ="computeddata["+i+"].number"
      _this.setData({
        [m]:i+1
      })
      arr1[i].number=i+1
    }
  },
  movestart: function (e) {
    currindex = e.currentTarget.dataset.index;
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    x1 = e.currentTarget.offsetLeft;
    y1 = e.currentTarget.offsetTop;
  },
  move: function (e) {
    yy = e.currentTarget.offsetTop;
    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;
    let c = currindex
    this.setData({
      mainx: c,
      opacity: 0.7,
      start: { x: x2, y: y2 }
    })
  },
  moveend: function () {
    if (y2 != 0) {
      var arr = [];
      for (var i = 0; i < this.data.computeddata.length; i++) {
        arr.push(this.data.computeddata[i]);
      }
      var nx = this.data.computeddata.length;
      n = 1;
      for (var k = 2; k < nx; k++) {
        if (y2 > (52 * (k - 1) + k * 2 - 26)) {
          n = k;
        }
      }
      if (y2 > (52 * (nx - 1) + nx * 2 - 26)) {
        n = nx;
      }
      arr.splice((currindex - 1), 1);
      arr.splice((n - 1), 0, arr1[currindex - 1]);
      arr1 = [];
      for (var m = 0; m < this.data.computeddata.length; m++) {
        arr[m].number = m + 1;
        arr1.push(arr[m]);
      }
      this.setData({
        mainx: "",
        computeddata: arr,
        opacity: 1
      })
    }
  },
  save:function(){
    let temp=this.data.computeddata
    for (let i = 0; i < this.data.computeddata.length; i++) {
      temp[i].number=i;
    }
    app.globalData.orgCJEditContent = temp;
    app.globalData.orgCJEditType = "sort";
    wx.navigateBack({
      delta: 1
    })
  }
})

