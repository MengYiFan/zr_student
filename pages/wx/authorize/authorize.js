// pages/wx/userinfo/userinfo.js
import { userLogin } from '../../../utils/api'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  timeout: null,
  interval: null,
  redirectUrl: '',
  tryAgain: true,
  getUserInfo(cb) {
    // 调用登录接口
    wx.login({
      success: function (res) {
        console.log(res)
        app.globalData.code = res.code || null
        
        wx.getUserInfo({
          success: function (res) {
            app.globalData.userInfo = res.userInfo
            wx.setStorageSync('userInfo', res.userInfo)
            typeof cb == "function" && cb()
          },
          // 如果用户拒绝授权
          fail: function (res) {
            this.getUserInfoHandle()
          }
        })
      }
    })
  },
  // 获得当前的位置信息
  getUserLocation(cb) {
    let that = this
    // if (app.globalData.userId) {
    //   return
    // }
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude,
          longitude = res.longitude,
          userInfo = app.globalData.userInfo

        app.globalData.location = {
          latitude, longitude
        }

        let data = {
          thirdPartyKey: app.globalData.code,
          longitude, latitude,
          userType: 1,
          userNickname: userInfo.nickName,
          userPortraitUrl: userInfo.avatarUrl,
          userMobile: ''
        }

        // 推荐人手机号码
        if (wx.getStorageSync('recommended_mobile_phone')) {
          data = Object.assign({}, data, {
            mobile: wx.getStorageSync('recommended_mobile_phone')
          })
          wx.removeStorageSync('recommended_mobile_phone')
        }

        userLogin({
          authorization: true,
          data,
          success: res => {
            if (res.code == '1000') {
              app.globalData.userId = res.data.userId
              app.globalData.userData = res.data
              wx.setStorageSync('userId', res.data.userId)
              wx.setStorageSync('userData', res.data)
              wx.setStorageSync('userMobile', res.data.userMobile
                || res.data.userAttribute && res.data.userAttribute.userMobile)
              app.globalData.userAttribute = res.data.userAttribute
              wx.setStorageSync('userAttribute', res.data.userAttribute)

              // this.timeout && clearTimeout(this.timeout)
              wx.reLaunch({
                url: '../../../' + that.redirectUrl
              })
            }
          }
        })
      },
      fail(e) {
        if (that.tryAgain) {
          that.tryAgain = false
          setTimeout(() => that.getUserLocation(cb), 3000)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.redirectUrl = options.redirect
    if (!this.redirectUrl || this.redirectUrl == 'pages/wx/authorize/authorize') {
      this.redirectUrl = 'pages/index/index/index'
    }

    wx.removeStorageSync('userInfo')
  },
  getUserInfoHandle() {
    var that = this
    // this.getUserInfo(this.getUserLocation)
    this.timeout =  setTimeout(() => {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            that.getUserInfo(that.getUserLocation)
          } else {
            that.getUserInfoHandle()
          }
        }
      })
    }, 1500)
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
  
  }
})