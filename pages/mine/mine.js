// pages/mine/mine.js
const app = getApp();

const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据 ac86d6a446d48ab57df337ad4101f317
   */
  data: {
    userId: app.globalData.userId,
    staffUserInfo: app.globalData.staffUserInfo,
    wxUserInfo: app.globalData.wxUserInfo,
    userType:app.globalData.userType
    //  myUserInfo:app.globalData.myUserInfo
  },
  /*从云端数据库获取用户资料，如果没有获取到则尝试新建用户资料*/
  onGotUserInfo: function(e){
    console.log("onGotUserInfo事件：");
    console.log(e);
    var _this = this;
    //需要用户同意授权获取自身相关信息
    if(e.detail.errMsg == "getUserInfo:ok"){ 
      //将授权结果写入app.js全局变量
      app.globalData.auth['scope.userInfo'] = true;
      //尝试获取云端数据库中用户信息，看该用户是否在云端数据库存在
      wx.cloud.callFunction({
        name:'get_setUserInfo',
        data:{getSelf: true},
        success: res=>{
          if(res.errMsg == "cloud.callFunction:ok" && res.result){
            //如果成功获取到，则将用户资料写入到app.js中
            console.log(res)
            app.globalData.wxUserInfo = res.result.data.wxUserInfo
            app.globalData.userId = res.result.data._id
            app.globalData.staffUserInfo = res.result.data.staffUserInfo
            app.globalData.userType = res.result.data.userType
            //同时将获取的资料写到本页面的data中
            _this.setData({
              userId: app.globalData.userId,
              wxUserInfo: app.globalData.wxUserInfo,
              userType: app.globalData.userType,
              staffUserInfo : app.globalData.staffUserInfo
              })
          }
          else{
            console.log("未注册");
            // _this.register(e.detail.)
            console.log(e.detail.userInfo);
            _this.register(e.detail.userInfo);
          }
        },
        fail: err=>{
          wx.showToast({
            title:'请检查您的网络状态',
            duration:800,
            icon:'none'
          })
          console.error("get_setUserInfo调用失败",err.errMsg)
        }
      })
    }
    else
    console.log("未授权")
  },

  register: function (e) {
    let _this = this;
    wx.cloud.callFunction({
      name: 'get_setUserInfo',
      data:{
        setSelf: true,
        wxUserInfo: e,
        userType: "common" //默认是普通用户
      },
      success: res=>{
        console.log(res);
        if(res.errMsg == "cloud.callFunction:ok" && res.result){
          console.log("注册成功",res);
          app.globalData.wxUserInfo = e;
          app.globalData.userId = res.result._id;
          //重新加载页面
          _this.onLoad();
          // app.getLoginState();
        }
        else{
          console.log("注册失败",res)
          wx.showToast({
            title:'请检查您的网络状态',
            duration:800,
            icon:'none'
          })
        }
      },
      fail: err => {
        wx.showToast({
          title:'请检查您的网络状态',
          duration:800,
          icon:'none'
        })
        console.error("get_setUserInfo调用失败",err.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getSetting({
      success (res) {
        console.log("onload开始..",res);
        if(res.authSetting['scope.userInfo']){
          //授权成功，将结果写入app.js全局变量
          app.globalData.auth['scope.userInfo'] = true
          //从云端获取用户资料
          wx.cloud.callFunction({
            name: 'get_setUserInfo',
            data:{
              getSelf: true
            },
            success: res=>{
              console.log('调用查询云函数',res);
              if(res.errMsg == "cloud.callFunction:ok" && res.result){
                //如果成功获取到，将获取到的资料写入app.js全局变量中
                app.globalData.userId = res.result.data._id;
                app.globalData.wxUserInfo = res.result.data.wxUserInfo;
                app.globalData.userType = res.result.data.userType;
                app.globalData.staffUserInfo = res.result.data.staffUserInfo;
                //同时将获取的资料写到本页面的data中
                _this.setData({
                  userId: app.globalData.userId,
                  wxUserInfo: app.globalData.wxUserInfo,
                  userType: app.globalData.userType,
                  staffUserInfo : app.globalData.staffUserInfo
                })
              }
            }
          })
        }
      }
    })
    // wx.cloud.callFunction(
    //   {
    //     name:'get_setUserInfo',
    //     success:res => {
    //       console.log(res);
    //     },
    //     fail:err=>{
    //       console.log(err);
    //     }
    //   }
    // )

// db.collection('staff').get().then(res => {
//       console.log(res);
//     });
    // this.adddemo();
  },
  onPerapplyClick(event){
    //console.log(event);
    wx.navigateTo({
      url: '/pages/mine/perapply/perapply',
    })
  },

  adddemo:function(){
    db.collection('staff').add({
      data:{
        name:"高楠",
        age:25
      }
    }).then(res=>{
      console.log(res);
    })
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