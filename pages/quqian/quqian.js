const { User } = require('../../libs/av-weapp-min.js');
// pages/quqian/quqian.js
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
    var that = this//不要漏了这句，很重要
    wx.request({
      url: 'https://finding-1251553053.cossh.myqcloud.com/guangchang.json',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          type: res.data.type,
          quqian: res.data.quqian,
        });
        that.data.quqian.map((quqian) => {
          if (User.current().get("quqian").indexOf(parseInt(quqian.id)) != -1) {
            quqian.checked = true;
          }
        })
        that.setData({
          quqian: that.data.quqian
        });
      }
    })
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
  checkboxChange: function (e) {
    var numArray = e.detail.value.map((value) => {
      return parseInt(value);
    })
    this.setData({ value: numArray })
  },
  save: function () {
    this.setData({
      error: null,
    });
    const { value } = this.data;
    const user = User.current();
    user.set("quqian", value);
    user.save().then(() => {
      wx.showToast({
        title: '成功',
        icon: 'success',
      });
      //wx.navigateBack({
      //  delta: 1
      //})
    }).catch(error => {
      this.setData({
        error: error.message,
      });
    });
  }
})