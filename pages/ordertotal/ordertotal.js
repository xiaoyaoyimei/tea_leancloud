//ordertotal.js
var util = require('../../utils/util.js')
const AV = require('../../utils/av-live-query-weapp-min');
var Order = AV.Object.extend('order');
Page({
  data: {
    pageNo: 1,
    list: [],
    newlist: [],
    statusenums:[],
    loadingHidden: false,
    status:'00',
    hasShow:true,
    loginhidden:false
  },
  goindex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onLoad(options){
    this.setData({
      status: options.status,
    });
    this.getData();
  },
  onShow: function () {
    //刷新数据

   
  },
  getStatus:function(){
    var that = this;
    request.req('index','order/enums', 'GET', {
    }, (err, res) => {
      if (res.code == 200) {
          that.setData({
            statusenums: res.object
          }) 
      }
    })
  },
  seedetail(e){
    var orderNo = e.currentTarget.dataset.orderno;
    var orderstatus = e.currentTarget.dataset.orderstatus;
    wx.redirectTo({
      url: `../orderDetail/orderDetail?orderNo=${orderNo}&orderStatus=${orderstatus}`,
    })
  },
  quzhifu(e){
    var that=this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.login({
      success: function (res) {
        request.req2(`order/weixin/browser/${orderNo}`, 'GET', res.code, (err, res) => {
          var weval=res.object;
            wx.requestPayment({
              timeStamp: weval.timeStamp,
              nonceStr: weval.nonceStr,
              package: weval.package,
              signType: weval.signType,
              paySign: weval.paySign,
              success: function (res) { //跳转
                wx.redirectTo({
                  url: '../paycomplete/paycomplete',
                })
              },
              fail: function () {
                util.showError('支付失败')
              },
              complete: function () {
                that.getData();
              }
            })
        }); 
      } 
      }) 
  },
  statusfilter(value) {
    for (var i = 0; i < this.data.statusenums.length; i++) {
      if (this.data.statusenums[i].key == value) {
        return this.data.statusenums[i].value;
      }
    }
  }, 

  setStatus:function(e){
    let num = e.target.dataset.num;
    this.setData({
      status: num
    });
    this.getData();
  },
   getData: function () {
  
     var _this = this;
     var query = new AV.Query(Order);
     query.descending('createdAt');
     query.find().then(function (res) {

       _this.setData({
         list: res,
         loadingHidden:true
       })
       // 查询到商品后，在前端展示到相应的位置中。

     }).catch(function (error) {
       alert(JSON.stringify(error));
       wx.showToast({
         title: '查询失败',
         icon: 'loading',
         duration: 1500
       })
     });
  },
  maopao(item) {
    for (let j = 0; j < item.commentList.length; j++) {
      for (let n = 0; n < item.orderItems.length; n++) {
        if (item.commentList[j].orderItemsId == item.orderItems[n].orderItemsId) {
          item.orderItems[n].pinglun = item.commentList[j].canComment;
          item.orderItems[n].productModelId = item.commentList[j].productModel.id;
        }
      }
    }
  },
  cancel(e) {
    var self=this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '温馨提示',
      content: '确定取消该订单?',
      success: function (res) {
        if (res.confirm) {
          request.req2(`order/cancel/${orderNo}`, 'POST', null, (err, res) => {
            if (res.code == 200 || res.code==503) {
              util.showSuccess(res.msg)
              self.getData();
            } else {
              util.showError(res.msg)
            }
          });
        }
      },
      fail(e) {
        callback(e)
      }
    })
  },
  qianshou(e) {
    var self = this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '温馨提示',
      content: '确定签收该订单?',
      success: function (res) {
        if (res.confirm) {
          request.req2(`order/receive/${orderNo}`, 'POST', null, (err, res) => {
            if (res.code == 200) {
              util.showSuccess(res.msg)
              self.getData();
            } else {
              util.showError(res.msg)
            }
          });
        }
      },
      fail(e) {
        callback(e)
      }
    })
  },
  showrefund(e){
    var self = this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
       url: `../refund/refund?rforder=${orderNo}`
    })
  }

})
