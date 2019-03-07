//index.js
//获取应用实例
const AV = require('../../utils/av-live-query-weapp-min');
var Tea = AV.Object.extend('tea');  
const app = getApp()

Page({
  data: {
    tea:[],
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
 
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              AV.User.loginWithWeapp().then(user => {

                app.globalData.user = user.toJSON();

              }).catch(console.error);
              // 假设已经通过 AV.User.loginWithWeapp() 登录

              const user = AV.User.current();

              // 调用小程序 API，得到用户信息
              wx.getUserInfo({
                success: ({ userInfo }) => {
                  // 更新当前用户的信息
                  user.set(userInfo).save().then(user => {
                    // 成功，此时可在控制台中看到更新后的用户信息
                    app.globalData.user = user.toJSON();
                    wx.setStorageSync('username', app.globalData.username)
                  }).catch(console.error);
                }
              });
         
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  //事件处理函数
  onShow: function () {
    this.fetchTea();
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '黄山毛峰', // 分享标题
      desc: 'O(∩_∩)O哈哈~沙塔下', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  },
  godetail: function (e) {
    let dForm = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: `../detail/detail?dForm=${dForm}`,
    })
  },
  fetchTea: function (user) {
    var _this = this;
    var query = new AV.Query(Tea);
    query.descending('createdAt');
    query.find().then(function (res) {
      _this.setData({
        tea: res,
      })
      // 查询到商品后，在前端展示到相应的位置中。

    }).catch(function (error) {
      alert(JSON.stringify(error));
    });
  },
  login: function () {
    AV.User.loginWithWeapp().then(user => {
      console.log(user)
   //   this.globalData.user = user.toJSON();
    }).catch(console.error);
    // var authData = {
    //   access_token: 'ACCESS_TOKEN',
    //   expires_in: 7200,
    //   refresh_token: 'REFRESH_TOKEN',
    //   openid: 'OPENID',
    //   scope: 'SCOPE',
    // };

    // return  AV.User.loginWithAuthData(authData, 'weixin').then(function (s) {
    //   console.log(s)
    //   //登录成功
    // }, function (error) {
    //   // 登录失败
    // });
    // return AV.Promise.resolve(AV.User.current()).then(user =>
    //   user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    // ).then(user => user ? user : AV.User.loginWithWeapp()).catch(error => console.error(error.message));
  },
})
