//var kuakuaData = require("../../../../data/data.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //commentList: [],
    userId: 0,
    commentListLength: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.jugdeUserLogin();
    var that = this;
    var kuakuaId = options.id;
    console.log(kuakuaId);
    that.data.currentId = kuakuaId;   //这里是_id
    that.getDetaliData();
    that.getCommentData();
    //console.log(that.data.currentId);
  },

  //从云数据库获取数据函数
  getDetaliData: function() {
    var that = this;
    const db = wx.cloud.database();
    const kuaTopic = db.collection('kuaTopic');
    db.collection('kuaTopic')
      .where({
        _id: that.data.currentId
      })
      .get({
        success: function(res) {
          that.setData({
            detailData: res.data,
            month: res.data[0].month,
            day: res.data[0].day,
            hours: res.data[0].hours,
            minutes: res.data[0].minutes,
            //commentList: res.data[0].commentList,
            //len: res.data[0].commentList.length,
          });
        }
      })
  },

  getCommentData:function(){
    var that = this;
    const db = wx.cloud.database();
    try {
      db.collection('kuaRenHistory')
        .where({
          id: that.data.currentId
        })
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            //that.data.dataList = res.data;
            that.setData({
              commentLists: res.data,
              commentListLength: res.data[0].commentListLength,
            })
            console.log(commentLists);
            wx.hideNavigationBarLoading(); //隐藏加载
            wx.stopPullDownRefresh();
          },
          fail: function (event) {
            wx.hideNavigationBarLoading(); //隐藏加载
            wx.stopPullDownRefresh();
          }
        })
    } catch (e) {
      wx.hideNavigationBarLoading(); //隐藏加载
      wx.stopPullDownRefresh();
      console.error(e);
    }
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var that = this;
    var next = [];
    if (that.data.commentLists.length < 40) {
      try {
        const db = wx.cloud.database();
        db.collection('kuaRenHistory')
          .where({
            id: that.data.currentId
          })
          .skip(20)
          .get({
            success: function (res) {
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var nextLists = res.data[i];
                  next.push(nextLists);
                }

                var totalLists = [];
                totalLists = that.data.dataLists.concata(next);
                that.setData({
                  commentLists: totalLists,
                })
              } else {
                wx.showToast({
                  title: '没有更多夸夸内容了哦~',
                })
              }
            },
            fail: function () {
              console.log('error' + event);
            }
          })
      } catch (e) {
        console.error(e);
      }
    } else {
      wx.showToast({
        title: '没有更多夸夸内容了哦~',
      })
    }
  },

  //表单提交函数
  formSubmit(e) {
    this.data.content = e.detail.value["input-content"];
    console.log(e.detail.value["input-content"]);
    console.log("内容--->" + this.data.content);
   
    //console.log('==');
    if (this.data.canIUse) {
      if (this.data.content != '') {
        this.saveToKuaRenHistory();
        
      } else {
        wx.showToast({
          title: '请输入夸夸内容哦~',
        })
      }
    } else {
      this.judgeUserLogin();
    }
  },

  //数据保存到云数据库kuaTopic的函数
  /*saveDataToSever: function(event) {
    var that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    var date = new Date();
    db.collection('kuaTopic')
      .doc(that.data.currentId)
      .update({
        data: {
          commentList: _.unshift({
            _openid: that.data._openid,
            comment: that.data.content,
            month: date.getMonth() + 1,
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            user: that.data.user,
            commentor: that.data.commentor,
          })
        },
        success: function(res) { //回调函数
          //res是一个对象，其中有_id字段和刚创建的求夸内容的id
          console.log(res)

          //清空输入框里面的内容
          that.setData({
            input: '',
          });
          
          //保存到我的夸夸中
          that.saveToKuaRenHistory();
          
          //下拉提示
          that.showSuc();
        },
      })
  },*/

  //保存数据到我的夸夸数据库kuaRenHistory的函数
  saveToKuaRenHistory: function(event) {
    var that = this;
    const db = wx.cloud.database();
    var date = new Date();
    db.collection('kuaRenHistory').add({
      data: {
        date: date,
        commentListLength: that.data.commentListLength + 1,
        content: that.data.content,
        id: that.data.currentId,
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        user: that.data.commentor,
        /*qiukuaData: that.data.detailData,*/
        qiukuaDay: that.data.detailData[0].day,
        qiukuaHours: that.data.detailData[0].hours,
        qiukuaMinutes: that.data.detailData[0].minutes,
        qiukuaMonth: that.data.detailData[0].month,
        qiukuaUser: that.data.detailData[0].user,
        qiukuaContent: that.data.detailData[0].content,
        showBtn: true,
        showContentt: false,
      },
      success: function(res) {
        console.log(res);

        //清空输入框里面的内容
        that.setData({
          input: '',
        });

        //that.saveComLengthToServer();

        //下拉提示
        that.showSuc();
      },
      fail: console.error
    })
  },
 
  //保存夸夸的条数到云数据库
  saveComLengthToServer: function() {
    var that = this;
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('kuaTopic')
      .doc(that.data.currentId)
      .update({
        data: {
          commentListLength: that.data.commentListLength,
        },
      success: function(res) {
        console.log(res)
      }
    })
  },

  //显示保存成功及跳转到夸夸榜的函数
  showSuc: function(event) {
    wx.showToast({
      title: '下拉查看夸夸哟~',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log('pulldown');
    this.getDetaliData();
    this.getCommentData();
    //this.saveComLengthToServer();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
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
              that.data.commentor = res.userInfo;
              console.log(that.data.commentor)
            }
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})