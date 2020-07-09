// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //openid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOpenId();
    this.jugdeUserLogin();
    
  },

  jugdeUserLogin: function(event) {
        var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              //that.data.user = res.userInfo;
              console.log('sus')
            }
          })
        }
      }
    })
  },

  /*getOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.data.openid = res.result.openid
      },
    })
  },*/

  getOpenId: function (event) {
    var that = this;
    const db = wx.cloud.database();
    db.collection('user').add({
      data: {
        nomean : 1
      },
      success: function (res) { 
        that.getIdData();
      },
    })
  },

  getIdData : function(event){
    var that = this;
    const db = wx.cloud.database();
    db.collection('user')
    .limit(1)
    .get({
      success:function(res){
        that.setData({
          openid : res.data[0]._openid
        })
      }
    })
  },

  tomywonderkua: function(event) {
    var userid = event.currentTarget.dataset.openid; 
    console.log(userid);
    wx.navigateTo({
      url: 'mywonderkua/mywonderkua?id='+userid,
    })
  },
  tomykuakua: function(event) {
    var userid = event.currentTarget.dataset.openid;
    wx.navigateTo({
      url: 'mykuakua/mykuakua?id='+userid,
    })
  },

  //点击显示求夸内容的函数
  showQiuKua:function(){
    
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