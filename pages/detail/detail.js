// pages/detail/detail.js
const AV = require('../../utils/av-live-query-weapp-min');
var order = AV.Object.extend('order');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{},
    quantity:1,
    address:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var content = JSON.parse(options.dForm);
    console.log(content)
    this.setData({
      content: content
    })
  },
  chooseAddr(){
    wx.navigateTo({
      url: '../addressManager/addressManager?mime=2',
    })
  },
  searchInput: function (e) {
    var obj = e.detail.value;
    this.setData({
      quantity: parseInt(obj)
    })
    let n = /^[1-9]\d*$/;
    if (!n.test(obj)) {
      util.showError('商品数量须大于0个，请输入正整数');
      obj = 1
      this.setData({
        quantity: 1
      })
      return false;
    }
    if (this.data.quantity >= this.data.max) {
      this.setData({
        quantity: this.data.max
      })
    }
  },
  //添加
  jia: function () {
      this.setData({
        quantity: parseInt(this.data.quantity) + 1
      })
  },
  //减
  jian: function () {
    if (this.data.quantity < 1) {
      this.setData({
        quantity: 0
      })
    } else {
      this.setData({
        quantity: parseInt(this.data.quantity) - 1
      })
    }
  },
  addcart:function(){
    if (this.data.address == {}) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 1000
      })
      return
    }

   

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

  }
})