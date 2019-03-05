// pages/detail/detail.js
const AV = require('../../utils/av-live-query-weapp-min');
var Order = AV.Object.extend('order');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{},
    quantity:1,
    address:{
      objectId:'',
      name:'',
      phone:'',
      ssq:'',
      detailAddress:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var _this=this;
    if (this.data.address.objectId =='') {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 1000
      })
      return
    }
    else{
      var neworder = new Order();
      // 设置名称

      neworder.set('userAuth',wx.getStorageSync('username'));
      neworder.set('orderStatus', '01');
      // 设置优先级
      neworder.save().then(function (res) {
        var orderres=res;
        console.log(res);
        //存order_address
        var neworderaddress=new AV.Object('order_address');
        neworderaddress.set('name',_this.data.address.name);
        neworderaddress.set('phone', _this.data.address.phone);
        neworderaddress.set('ssq', _this.data.address.ssq);
        neworderaddress.set('detailAddress', _this.data.address.detailAddress);
        neworderaddress.set('orderObjectId', orderres.id);
        neworderaddress.save().then(function (res) {
            var neworderitem = new AV.Object('order_item');
              neworderitem.set('name', _this.data.content.name);
          neworderitem.set('title', _this.data.content.title);
          neworderitem.set('itemObjectId', _this.data.content.objectId);
          neworderitem.set('price', _this.data.content.price);
          neworderitem.set('url', _this.data.content.url.url);
              neworderitem.set('orderObjectId', orderres.id);
              neworderitem.save().then(function (itemres) {
                console.log('item')
                console.log(itemres)
              });
        });
        //存order_item
   
        // wx.navigateTo({
        //   url: "../ordertotal/ordertotal?status=00"
        // })
      }, function (error) {
        console.error(error);
      });
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