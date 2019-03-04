//index.js
//获取应用实例
const AV = require('../../utils/av-live-query-weapp-min');
var Tea = AV.Object.extend('tea');  
const app = getApp()

Page({
  data: {
    tea:[]
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
      console.log(res)
      _this.setData({
        tea: res,
      })
      // 查询到商品后，在前端展示到相应的位置中。

    }).catch(function (error) {
      alert(JSON.stringify(error));
    });
  },
  
})
