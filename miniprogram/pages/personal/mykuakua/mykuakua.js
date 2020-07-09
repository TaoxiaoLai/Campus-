//var kuakuaData = require('../../../data/data2.js')
// pages/homepage/kuakuaList/kuakuaList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userid = options.id;
    this.data.openid = userid;
    this.getKuaRenData();
  },

  //从云数据库kuaRenHistory获取数据
  getKuaRenData: function(event) {
    var that = this;
    const db = wx.cloud.database();
    db.collection('kuaRenHistory')
      .where({
        _openid: that.data.openid
      })
      .get({
        success: function(res) {
          that.setData({
            detailData: res.data,
          })
        }
      })
  },

  //点击显示求夸的内容函数
  showQiuKua: function(event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    const db = wx.cloud.database();
    db.collection('kuaRenHistory')
      .doc(id)
      .update({
        data: {
          showBtn: false,
          showContent: true,
        },
        success: function(res) {
          console.log(res);
          that.getKuaRenData();
        },
        fail: console.error
      })
  },

  //点击隐藏求夸的内容函数
  hideQiuKua: function(event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    const db = wx.cloud.database();
    db.collection('kuaRenHistory')
      .doc(id)
      .update({
        data: {
          showBtn: true,
          showContent: false,
        },
        success: function(res) {
          console.log(res);
          that.getKuaRenData();
        },
        fail: console.error
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})