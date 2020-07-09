//var kuakuaData = require('../../../data/data.js')
// pages/homepage/kuakuaList/kuakuaList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    pageSize: 20,
    totalCount: 0,
    //dataList: []

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload');
    this.getKuaData();
    
    /*this.setData({
      dataList: kuakuaData.dataList
    });*/
  },

  //获取夸夸榜云数据库的数据

  getKuaData: function() {
    var that = this;
    const db = wx.cloud.database();
    const kuaTopic = db.collection('kuaTopic')
    db.collection('kuaTopic').count({
      success: function(res) {
        that.data.totalCount = res.total;
        console.log('total-->' + totalCount)
      }
    })
    //获取数据的前20条
    try {
      db.collection('kuaTopic')
        .limit(that.data.pageSize)
        .orderBy('date', 'desc')
        .get({
          success: function(res) {
            //that.data.dataList = res.data;
            that.setData({
              dataLists: res.data,
            })
            console.log(dataLists);
            wx.hideNavigationBarLoading(); //隐藏加载
            wx.stopPullDownRefresh();
          },
          fail: function(event) {
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

  //页面跳转到详情页

  toKuaKuaDetail: function(event) { 
    var kuakuaId = event.currentTarget.dataset.id; 
    console.log(event.currentTarget.dataset.id);
    console.log(kuakuaId);
    console.log('==');
    wx.navigateTo({
      url: 'kuakuaDetail/kuakuaDetail?id=' + kuakuaId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getKusData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var next = [];

    //获取之后的20条数据
    if (that.data.dataLists.length < that.data.totalCount) {
      try {
        const db = wx.cloud.database();
        db.collection('kuaTopic')
          .skip(20)
          .limit(pageSize)
          .get({
            success: function(res) {
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var nextLists = res.data[i];
                  next.push(nextLists);
                }

                var totalLists = [];
                totalLists = that.data.dataLists.concata(next);
                that.setData({
                  dataLists: totalLists,
                })
              } else {
                wx.showToast({
                  title: '没有更多夸夸内容了哦~',
                })
              }
            },
            fail: function (){
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
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})