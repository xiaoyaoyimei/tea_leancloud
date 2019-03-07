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

  },
  globalData: {
    userInfo: null,
    user:null
  }
})