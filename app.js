//app.js
import { userLogin, wxRequest } from './utils/api'
import { obj2uri } from './utils/common'

App({
  onLaunch: function (e) {
    // 当前访问链接保存
    this.globalData.currentUri = e.path + '?' + obj2uri(e.query)
    if (wx.getStorageSync('userId')) {
      this.globalData.userId = wx.getStorageSync('userId')
    }
    this.getUserInfo(this.getUserLocation)

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // 获得用户信息
  getUserInfo(cb) {
    var that = this,
        globalData = this.globalData

    if (globalData.userInfo && globalData.userId) {
      typeof cb == "function" && cb(globalData.userInfo)
    } else if (wx.getStorageSync('userId')) {
      // 返回缓存内容
      that.globalData.userInfo = wx.getStorageSync('userInfo')
      if (wx.getStorageSync('userInfo')) {
        that.globalData.userInfo = wx.getStorageSync('userInfo')
      }
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {
      console.log('wx.login')
      // 调用登录接口
      wx.login({
        success: function (res) {
          console.log(res)
          that.globalData.code = res.code || null
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              typeof cb == "function" && cb()
            },
            // 如果用户拒绝授权
            fail: function (res) {
              console.log(res)
              that.checkUserInfo()
            }
          })
        }
      })
    }
  },
  // 获得当前的位置信息
  getUserLocation(cb) {
    let that = this
    if (that.globalData.userId) {
      return
    }
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude, 
            longitude = res.longitude,
            userInfo = that.globalData.userInfo

        that.globalData.location = {
          latitude, longitude
        }

        userLogin({
          authorization: true,
          data: {
            thirdPartyKey: that.globalData.code,
            longitude, latitude,
            userType: 1,
            userNickname: userInfo.nickName,
            userPortraitUrl: userInfo.avatarUrl,
            userMobile: ''
          },
          success: res => {
            if (res.code == '1000') {
              that.globalData.userId = res.data.userId
              that.globalData.userData = res.data
              wx.setStorageSync('userId', res.data.userId)
              wx.setStorageSync('userData', res.data)
              wx.setStorageSync('userMobile', res.data.userMobile 
                || res.data.userAttribute && res.data.userAttribute.userMobile)
              wx.reLaunch({
                url: '/' + that.globalData.currentUri
              })
            }
          }
        })
      }
    })
  },
  // 小程序授权确定
  checkUserInfo() {
    let that = this
    wx.showModal({
      showCancel: false,
      title: '您好',
      content: '该小程序需要授权方能继续...',
      success: function (res) {
        // 打开授权设置页面
        // wx.openSetting({
        //   success: (res) => {
        //     let setting = res.authSetting
        //       // && setting['scope.userLocation']
        //     if (setting['scope.userInfo']) {
        //       that.getUserInfo()
        //     } else {
        //       that.checkUserInfo()
        //     }
        //   }
        // })
        let redirectUrl = that.globalData.currentUri.split('?')[0]
        wx.redirectTo({
          url: `../../../pages/wx/authorize/authorize?redirect=${redirectUrl}`,
        })
      }
    })
  },
  globalData:{
    userInfo: null,
    location: {
      latitude: null,
      longitude: null
    },
    userId: null,
    userData: {},
    code: null,
    userMobile: '',
    callbackFnArr: [],
    currentUri: ''
  }
})

