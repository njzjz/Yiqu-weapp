const AV = require('../../libs/av-weapp-min.js');
// pages/list/list.js
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
    if (options.list == "join") {
      this.fetchJoin("userActivity");
      this.setData({ pointer: true });
    } else if (options.list == "will") {
      this.fetchJoin("willActivity");
      this.setData({ pointer: true });
    } else if (options.list == "my") {
      this.fetchMy();
    } else if (options.list == "type") {
      this.fetchType(options.type);
    } else if (options.list == "search") {
      this.fetchSearch(options.input);
    } else if (options.list == "user") {
      this.fetchUser(options.id);
      this.setData({ isUser: true });
    } else if (options.list == "followee") {
      this.fetchFollowee();
      this.setData({ isUser: true });
      this.setData({ followee: true });
    } else if (options.list = "fabu") {
      this.fetchTodos(1);
    } else {
      this.fetchTodos(2);
    }
    wx.request({
      url: 'https://finding-1251553053.cossh.myqcloud.com/guangchang.json',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          quqian: res.data.quqian,
        })
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
  fetchTodos: function (kind) {
    const query = new AV.Query("Activity")
      .descending('createdAt')
      .include("user")
      .equalTo("kind", kind)
      .find()
      .then(todos => this.setData({ todos }))
      .catch(console.error);
  },
  fetchJoin: function (query) {
    const queryme = new AV.Query(query)
      .descending('createdAt')
      .include("activity")
      .include("activity.user")
      .equalTo('user', AV.User.current())
      .find()
      .then(todos => this.setData({ todos }))
      .catch(console.error);
  },
  fetchMy: function () {
    const query = new AV.Query("Activity")
      .descending('createdAt')
      .include("user")
      .equalTo('user', AV.User.current())
      .find()
      .then(todos => this.setData({ todos }))
      .catch(console.error);
  },
  fetchType: function (type) {
    const query = new AV.Query("Activity")
      .descending('createdAt')
      .equalTo("kind", 3)
      .equalTo("type", parseInt(type))
      .find()
      .then(todos => this.setData({ todos }))
      .catch(console.error);
  },
  fetchSearch: function (input) {
    var that = this;
    const query = new AV.SearchQuery('Activity');
    query.queryString(input);
    query.include("user");
    query.find().then(function (todos) {
      console.log("Find " + query.hits() + " docs.");
      that.setData({ todos });
    }).catch(function (err) {
      //处理 err
    });
  },
  fetchUser: function (id) {
    if (!AV.User.current().get("emailVerified")) {
      wx.showToast({
        title: '请先验证邮箱',
        icon: 'loading',
      });
      setTimeout(function () {
        wx.redirectTo({
          url: '../sign/sign',
          success: function (e) {
          }
        });
      }, 2000);
    } else if (AV.User.current().get("quqian") == false) {
      wx.showToast({
        title: '请先设置趣签',
        icon: 'loading',
      });
      setTimeout(function () {
        wx.redirectTo({
          url: '../quqian/quqian',
          success: function (e) {
          }
        });
      }, 2000);
    } else {
      var activity = AV.Object.createWithoutData('Activity', id);
      const queryme = new AV.Query("userActivity")
        .descending('createdAt')
        .include("user")
        .equalTo('activity', activity)
        .find()
        .then(todos => this.setData({ todos }))
        .catch(console.error);
    }
  },
  fetchFollowee: function () {
    const query = AV.User.current().followeeQuery()
      .include('followee')
      .find()
      .then(todos => this.setData({ todos }))
      .catch(console.error);
  },
})