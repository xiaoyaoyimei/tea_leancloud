const AV = require('../../utils/av-live-query-weapp-min');
var util = require('../../utils/util.js')
Page({
  data: {
      content:{},
      statusEnum:[],
      statusList: [],
      orderdetail:{
        shippingOrder: {},
        shippingInvoice: {},
        shippingAddress: {},
        shippingOrderItems: []
      },
      orderNo: '',
      //状态由orderlist页面带来。以免二次处理
      orderStatus:'',
      wentips:false,
      wentipsDay:false,
      loginhidden: true,
      day:0,
      hr: 0,
      min: 0,
      sec: 0,
      jsqtime: 0,
      t: '',
  },
  onLoad(options) {
    var _this=this;
    var p1 = new Promise(_this.getStatusEnum);
    p1.then(function(res){
      var content = JSON.parse(options.dForm);
      content.dependent.znStatus = _this.statusfilter(content.dependent.orderStatus);
      _this.setData({
        content: content
      })
    })
  },

  getStatusEnum(resolve, reject) {
      var _this=this;
       AV.Query.doCloudQuery('select key, value from orderStatus').then(function (data) {
         _this.setData({
           statusEnum: data.results
         })
         resolve('ok');
       }, function (error) {
         //查询失败，查看 error
         console.error(error);
         reject();
       });
  

    },

  statusfilter(value) {
    for (var i = 0; i < this.data.statusEnum.length; i++) {
      if (this.data.statusEnum[i].attributes.key == value) {
        return this.data.statusEnum[i].attributes.value;
      }
    }
  }, 

  cancel(e) {
    var self = this;
    var orderNo = e.currentTarget.dataset.orderobjectid;
    wx.showModal({
      title: '温馨提示',
      content: '确定取消该订单?',
      success: function (res) {
        if (res.confirm) {
          AV.Query.doCloudQuery(`update order set orderStatus="04" where objectId="${orderNo}"`).then(function (data) {
            var results = data.results;
            util.showSuccess('取消成功')
            wx.navigateBack({
              delta: 2, // 回退前 delta(默认为1) 页面
            })
          }, function (error) {
            //查询失败，查看 error
            console.error(error);
            util.showError('操作失败')
          });
        }
      },
      fail(e) {
        callback(e)
      }
    })
  },

})