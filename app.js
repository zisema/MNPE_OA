//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "mnpe-dev-c54cm",
      traceUser: true
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    // myUserInfo:{
    //   id: 1,
    //   job_num: "1867",
    //   name: "李文文",
    //   branch: "智能技术部",
    //   device:{[ID:'123',type:"显示器"]}
    //   avatar: "http://img1.imgtn.bdimg.com/it/u=3170379310,1742401393&fm=11&gp=0.jpg"
    // },
    //用户ID
    userId:'',
    //员工相关信息
    staffUserInfo:{},
    //用户信息
    wxUserInfo: null,
    //授权状态
    auth:{
      'scope.userInfo': false
    },
    //登录状态
    // logged: false,
    //用户类型，用于区别不同的权限,guest:游客,common:普通用户,staff:普通员工,admin-staff:管理员工
    //默认为guest
    userType: 'guest'
  }
})