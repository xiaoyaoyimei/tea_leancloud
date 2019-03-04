const AV = require('../../utils/av-live-query-weapp-min');
var Address = AV.Object.extend('address');
var show = false;
var item = {};
Page({
  data: {
    item: {
      show: show
    },
    name: '',
    phoneNum: '',
    ssq:'',
    detailAddress: '',
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    },


  //收货人赋值
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindSsqInput:function (e) {
      this.setData({
        ssq: e.detail.value
      })
    },
  //手机号赋值
  bindPhoneInput: function (e) {
    var phone = e.detail.value;
    if (!(/^1\d{10}$/.test(phone))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return;
    } else {
      this.setData({
        phoneNum: e.detail.value
      })
    }
  },

  //详细地址赋值
  bindAddressInput: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  //保存
  addAddress: function () {
    var that = this;
    if (that.data.name.length == 0) {
      wx.showToast({
        title: '收货人不能为空',
        icon: 'none',
        mask: true
      })
    } else if (that.data.phoneNum.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        mask: true
      })
    } else if (that.data.ssq.name == 0) {
      wx.showToast({
        title: '省市区不能为空',
        icon: 'loading',
        mask: true
      })
    } else if (that.data.detailAddress.length == 0) {
      wx.showToast({
        title: '详细地址不为空',
        icon: 'loading',
        mask: true
      })
    } else {
      // 新建对象
      var newaddress = new Address();
      // 设置名称
      newaddress.set('name', this.data.name);
      newaddress.set('phone', this.data.phoneNum);
      newaddress.set('ssq', this.data.ssq);
      newaddress.set('detailAddress', this.data.detailAddress);
      // 设置优先级
      newaddress.save().then(function (data) {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function (res) {
            // success
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      }, function (error) {
        console.error(error);
        wx.showToast({
          title: '新增失败',
          icon: 'loading',
          duration: 1500
        })
      });
    }
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    var that = this;

  },
  
})