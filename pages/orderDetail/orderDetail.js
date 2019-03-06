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
    console.log('onload')
    var content = JSON.parse(options.dForm);

    this.setData({
      content: content
    })
    this.getStatusEnum();
      
  },
  onReady(){
    console.log('onReady')
    var _this=this;
     this.data.content.dependent.znStatus = this.statusfilter(this.data.content.dependent.orderStatus);
    this.setData({
      content: _this.data.content
    })
  },
  onshow(){
  },
  onHide(){

  },

    getStatusEnum() {
      AV.Query.doCloudQuery('select key, value from orderStatus').then(function (data) {
        this.setData=({
            statusEnum: data.results
        })
      }, function (error) {
        //查询失败，查看 error
        console.error(error);
      });
    },

  statusfilter(value) {
    for (var i = 0; i < this.data.statusEnum.length; i++) {
      if (this.data.statusEnum[i].key == value) {
        return this.data.statusEnum[i].value;
      }
    }
  }, 



})