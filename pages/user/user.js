const AV = require('../../libs/av-weapp-min.js');
var id;
// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var follow = false;
    var userObject = new AV.Query('_User');
    id = options.id;
    userObject.get(options.id).then(function (user) {
      that.setData({ user, current: AV.User.current() });
      var query = AV.User.current().followeeQuery();
      query.equalTo('followee', user);
      query.count().then(function (count) {
        if (count > 0) follow = true;
        that.setData({ follow });
      }).catch(console.error);
      wx.request({
        url: 'https://finding-1251553053.cossh.myqcloud.com/guangchang.json',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            quqian: res.data.quqian,
          });
          that.data.quqian.map((quqian) => {
            if (user.get("quqian").indexOf(parseInt(quqian.id)) != -1) {
              quqian.checked = true;
            }
          })
          that.setData({
            quqian: that.data.quqian
          });
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../chat/chat?id=' + id
    })
  },
  follow: function () {
    var page=this;
    AV.User.current().follow(id).then(function () {
      //关注成功
      wx.showToast({
        title: '关注成功！',
        icon: 'success',
      })
      var follow = true;
      page.setData({ follow });
    }, function (err) {
      //关注失败
      console.dir(err);
    });
  },
  cancel: function () {
    var page = this;
    AV.User.current().unfollow(id).then(function () {
      //取消关注成功
      wx.showToast({
        title: '取消关注成功！',
        icon: 'success',
      })
      var follow = false;
      page.setData({ follow });
    }, function (err) {
      //取消关注失败
      console.dir(err);
    });
  }
})