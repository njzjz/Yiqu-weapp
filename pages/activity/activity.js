const AV = require('../../libs/av-weapp-min.js');
import Calendar from '../../components/calendar/calendar';
// pages/activity/activity.js
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
    var page = this;
    var join = false, will = false;
    const currentUser = AV.User.current();
    var activityObject = new AV.Query('Activity');
    activityObject.include("user").get(options.id).then(function (activity) {
      page.setData({ activity, currentUser, done: true });
      wx.setNavigationBarTitle({
        title: activity.get("name"),
      })
      setTimeout(function () {
        page.setData({ timeoutCalendar:true });
      }, activity.get("timeout")) 
      const query = new AV.Query("userActivity")
        .equalTo('activity', activity)
        .count()
        .then(function (count) {
          page.setData({ count });
        }).catch(console.error);
      const queryme = new AV.Query("userActivity")
        .equalTo('activity', activity)
        .equalTo('user', currentUser)
        .count()
        .then(function (countme) {
          if (countme > 0) join = true;
          page.setData({ join });
        }).catch(console.error);
      const querymewill = new AV.Query("willActivity")
        .equalTo('activity', activity)
        .equalTo('user', currentUser)
        .count()
        .then(function (countme) {
          if (countme > 0) will = true;
          page.setData({ will });
        }).catch(console.error);
    }).catch(console.error);
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
  join: function () {
    var page = this;
    if (!AV.User.current().get("emailVerified")) {
      wx.showToast({
        title: '请先验证邮箱',
        icon: 'loading',
      });
      setTimeout(function () {
        wx.navigateTo({
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
        wx.navigateTo({
          url: '../quqian/quqian',
          success: function (e) {
          }
        });
      }, 2000);
    } else {
      const { activity } = this.data;
      const user = AV.User.current();
      var UserActivity = AV.Object.extend('userActivity');
      var userActivity = new UserActivity();
      userActivity.set("activity", activity);
      userActivity.set("user", user);
      userActivity.save().then(function (todo) {
        wx.showToast({
          title: '报名成功！',
          icon: 'success',
        });
        var { count } = page.data;
        count = count + 1;
        var join = true;
        page.setData({ join, count });
      }).catch(error => console.log(error));
    }
  },
  cancel: function () {
    var page = this;
    const currentUser = AV.User.current();
    const { activity } = this.data;
    const queryme = new AV.Query("userActivity")
      .equalTo('activity', activity)
      .equalTo('user', currentUser)
      .first().then(function (data) {
        data.destroy().then(function (success) {
          wx.showToast({
            title: '取消报名成功！',
            icon: 'success',
          });
          var { count } = page.data;
          count = count - 1;
          var join = false;
          page.setData({ join, count });
        });
      }).catch(console.error);
  },
  will: function () {
    var page = this;
    if (!AV.User.current().get("emailVerified")) {
      wx.showToast({
        title: '请先验证邮箱',
        icon: 'loading',
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '../sign/sign',
          success: function (e) {
          }
        });
      }, 2000);
    } else if (AV.User.current().get("quqian") == false){
      wx.showToast({
        title: '请先设置趣签',
        icon: 'loading',
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '../quqian/quqian',
          success: function (e) {
          }
        });
      }, 2000);
    } else {
      const { activity } = this.data;
      const user = AV.User.current();
      var UserActivity = AV.Object.extend('willActivity');
      var userActivity = new UserActivity();
      userActivity.set("activity", activity);
      userActivity.set("user", user);
      userActivity.save().then(function (todo) {
        wx.showToast({
          title: '收藏成功！',
          icon: 'success',
        });
        var { count } = page.data;
        var will = true;
        page.setData({ will });
      }).catch(error => console.log(error));
    }
  },
  cancelwill: function () {
    var page = this;
    const currentUser = AV.User.current();
    const { activity } = this.data;
    const queryme = new AV.Query("willActivity")
      .equalTo('activity', activity)
      .equalTo('user', currentUser)
      .first().then(function (data) {
        data.destroy().then(function (success) {
          wx.showToast({
            title: '取消成功！',
            icon: 'success',
          });
          var { count } = page.data;
          var will = false;
          page.setData({ will });
        });
      }).catch(console.error);
  },
  deleteActivity: function () {
    const { activity } = this.data;
    wx.showModal({
      title: '提示',
      content: '确认删除活动？',
      success: function (res) {
        if (res.confirm) {
          activity.destroy().then(function (success) {
            wx.switchTab({
              url: '../list/list',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            });
          });
        }
      }
    });
  },
  openCalendar() {
    var page = this;
    const { activity } = this.data;
    const user = AV.User.current();
    var UserCalendar = AV.Object.extend('Calendar');
    var userCalendar = new UserCalendar();
    userCalendar.set("activity", activity);
    userCalendar.set("user", user);
    userCalendar.save().then(function (todo) {
      const query = new AV.Query("Calendar")
        .descending('createdAt')
        .equalTo("user", user)
        .equalTo("activity", activity)
        .find()
        .then(function (todos) {
          var value = [];
          todos.forEach(function (todo) {
            value.push((todo.get("createdAt")).Format("yyyy-MM-dd"));
          });
          wx.request({
            url: 'https://finding-1251553053.cossh.myqcloud.com/calendar.json',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              var textArray = res.data.text
              page.setData({ hidevideo:true });
              console.log(res)
              var text = textArray[Math.floor(Math.random() * textArray.length)]
              Calendar.init('birthday', {
                value: value,
                closeOnSelect: false,
                qrcode: res.data.qrcode,
                text: res.data.text[Math.floor(Math.random() * res.data.text.length)],
              })
            }
          })
        })
        .catch(console.error);
    }).catch(error => console.log(error));
  },
  videoEnd: function () {
    this.setData({ videoEnd: true })
  }
})
Date.prototype.Format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}