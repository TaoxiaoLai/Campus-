//index.js

Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //content: '',
    //user: {},
    //commentList: [],
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.jugdeUserLogin();
  },

  //表单提交触发此函数,保存数据要云数据库
  formSubmit(e) {
    this.data.content = e.detail.value["input-content"];
    console.log("内容--->" + this.data.content);
    console.log('==');
    if (this.data.canIUse) {
      if (this.data.content != '') {
        this.saveDataToSever();
      } else {
        wx.showToast({
          title: '请输入求夸内容哦~',
        })
      }
    } else {
      this.judgeUserLogin();
    }
  },

  //数据保存到夸夸榜云数据库的函数
  saveDataToSever: function(event) {
    var that = this;
    const db = wx.cloud.database();
    const kuaTopic = db.collection('kuaTopic');
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var len = 0;
    db.collection('kuaTopic').add({
      data: {
        content: that.data.content,
        date : date,
        month :  month+1,
        day : day,
        hours : hours,
        minutes : minutes,
        user: that.data.user,
        //commentListLength: 0
      },
      success: function(res) { //回调函数
        //res是一个对象，其中有_id字段和刚创建的求夸内容的id
        console.log('res--->' + res)

        //保存到我的求夸中
        //that.saveToQiuKuaHistory();

        //清空本js文件data里面的数据
        that.data.content = '';

        //数据上传成功后显示成功并跳转到夸夸榜页面
        that.showSucAndSwitchTab();
      },
    })
  },

  //保存数据到我的求夸数据库的函数
  /*saveToQiuKuaHistory: function(event) {
    var that = this;
    const db = wx.cloud.database();
    const qiuKuaHistory = db.collection('qiuKuaHistory')
    db.collection('qiuKuaHistory').add({
      data: {
        content: that.data.content,
        date: new Date(),
        user: that.data.user,
        commentList : [],
      },
      success: function(res) {
        console.log(res)
      },
      fail: console.error
    })
  },*/

  //显示保存成功及跳转到夸夸榜的函数
  showSucAndSwitchTab: function(event) {
    wx.showToast({
      title: '耶！发布求夸内容成功~',
    })
    wx.redirectTo({
      url: '../kuakuaList/kuakuaList',
    })
  },

  //判断用户是否登录
  jugdeUserLogin: function(event) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {

              that.data.user = res.userInfo;
              console.log(that.data.user)
            }
          })
        }
      }
    })
  },
})