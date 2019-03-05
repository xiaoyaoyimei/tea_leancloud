const AV = require('./utils/av-live-query-weapp-min');
var APP_ID = 'bgj0MSXSaHlbjD5KrKIzY5Gc-gzGzoHsz';
var APP_KEY = 'NrKytOp9BEGS7Q7ruELesuzi';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
//app.js
//登录设置user
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    AV.User.loginWithWeapp().then(user => {
  
        this.globalData.user = user.toJSON();

    }).catch(console.error);
    // 假设已经通过 AV.User.loginWithWeapp() 登录

    const user = AV.User.current();

    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
                // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          this.globalData.user = user.toJSON();
          wx.setStorageSync('username', this.globalData.user.username)
        }).catch(console.error);
      }
    });
  },
  globalData: {
    userInfo: null,
    user:null
  }
})