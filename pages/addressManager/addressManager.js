const AV = require('../../utils/av-live-query-weapp-min');
var Address = AV.Object.extend('address');
var mime=0;
Page({
  data:{
    addressData:[],
    userName:''
  },

  // switch1Change: function (e) {
  //   var that = this;
  //   var objectId = e.currentTarget.dataset.itemObjectid;
  //   var username=this.data.userName;
  //   // 第一个参数是 className，第二个参数是 objectId
  //   AV.Query.doCloudQuery('update address set isDefault="N" where isDefault="Y" and userAuth="'+username+'"').then(function (data) {
  //     // data 中的 results 是本次查询返回的结果，AV.Object 实例列表
  //    // AV.Query.doCloudQuery(`update address set isDefault="Y" where objectId=${objectId}`)
  //   }, function (error) {
  //     // 异常处理
  //     console.error(error);
  //   });
    
  // },
  addressClick:function(e){
    console.log(mime)
    //mime=2来自详情页页面detail
    let addrForm = JSON.stringify(e.currentTarget.dataset.item);
    let addrDingdang=e.currentTarget.dataset.item;
  
    if(mime==1){
      wx.navigateTo({
        url: `../addressEdit/addressEdit?addrForm=${addrForm}`,
      })
    }
    else if(mime==2){
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]  //上一个页面
      var that = this
      prevPage.setData({
        address: addrDingdang,
      })
      wx.navigateBack({//返回
        delta: 1
      })
    }else{
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]  //上一个页面
      var that = this
      prevPage.setData({
        addressInfo: addrDingdang,
        hasAddress: true
      })
      wx.navigateBack({//返回
        delta: 1
      })
    }

  },
  addrDelete:function(e){
    var _this = this;
    var objectid = e.currentTarget.dataset.itemObjectid;
    var index = e.currentTarget.dataset.index;
    var sql = AV.Object.createWithoutData('address', objectid);
    wx.showModal({
      title: '确认删除该地址吗？',
      success: function(res) {
        if (res.confirm) {
          sql.destroy().then(function (success) {
            _this.data.addressData.splice(index, 1)
            _this.setData({
              addressData: _this.data.addressData,
            })
        })
        }
      }
    })
  },
  addrEdit:function(e){
   
    let addrForm = JSON.stringify(e.currentTarget.dataset.item);

    wx.navigateTo({
      url: `../addressEdit/addressEdit?addrForm=${addrForm}`,
    })
  },
  addressAdd:function(){
    wx.navigateTo({
      url: '../addressAdd/addressAdd',
    })
  },
  onLoad:function(options){
      mime = options.mime
   
  },

  onReady: function() {
  },
  getAddressList(){
    var _this = this;
    var query = new AV.Query(Address);
    query.descending('createdAt');
    query.equalTo('userAuth', this.data.userName)
    query.find().then(function (res) {
      _this.setData({
        addressData: res,
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
  onShow: function() {
    // 生命周期函数--监听页面加载
    this.setData({
      userName: wx.getStorageSync('username')
    })
    this.getAddressList();
  },
})