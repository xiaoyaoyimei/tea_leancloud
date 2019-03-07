//ordertotal.js
var util = require('../../utils/util.js')
const AV = require('../../utils/av-live-query-weapp-min');
var Order = AV.Object.extend('order');
Page({
  data: {
    pageNo: 1,
    orderList: [],
    statusenums:[],
    loadingHidden: false,
    status:'00',
    hasShow:true,
    loginhidden:false,
  },
  getData: function () {
    var _this=this;
    var status = _this.data.status;
    var username = wx.getStorageSync('username')
    var sql = `select include dependent,* from order_item where dependent in (select * from order where userAuth="${username}")`;
    if (status!= '00') {
      sql = `select include dependent,* from order_item where dependent in (select * from order where userAuth="${username}" and orderStatus="${status}") `;
    } 
  
    AV.Query.doCloudQuery(sql).then(function (data) {
      // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
      var result = data.results;
      if (result.length > 0) {
        _this.setData({
          hasShow:true,
          orderList: result
        })
      } else {
        _this.setData({
          hasShow: false
        })
      }
    }, function (error) {
      //查询失败，查看 error
      console.error(error);
    });

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
  showDetail(e) {
      let dForm = JSON.stringify(e.currentTarget.dataset.item);
      wx.navigateTo({
        url: `../orderDetail/orderDetail?dForm=${dForm}`,
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

  showrefund(e){
    var self = this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
       url: `../refund/refund?rforder=${orderNo}`
    })
  }

})
