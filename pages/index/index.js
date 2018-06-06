//index.js
const { User } = require('../../libs/av-weapp-min.js');
import { $wuxDialog } from '../../components/wux'
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../user/user?id='+User.current().id
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({
      user: User.current(),
    });
    var that = this//不要漏了这句，很重要
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  prompt() {
    const that = this
    const alert = (content) => {
      $wuxDialog.alert({
        title: '提示',
        content: content,
      })
    }

    $wuxDialog.prompt({
      title: '修改个性签名',
      content: '请输入您的个性签名',
      fieldtype: '',
      password: 0,
      defaultText: User.current().get("motto"),
      placeholder: 'Hello World',
      maxlength: 140,
      onConfirm(e) {
        const value = that.data.$wux.dialog.prompt.response
        var user = User.current();
        user.set("motto", value);
        user.save().then(() => {
          var content="修改成功！";
          alert(content);
          that.setData({
            user: User.current(),
          });
        }).catch(error => {
          this.setData({
            error: error.message,
          });
          alert(error.message);
        });
      },
    })
  },
})
