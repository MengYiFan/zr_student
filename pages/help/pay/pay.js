// pages/help/pay/pay.js
import { obj2uri } from '../../../utils/common' 
import { getPayToHelpQus } from '../../../utils/api'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipQusIndex: 0,
    vipQusArr: [],
    vipQusKeys: [],
    duration: 30,
    amount: 50,
  },
  binVipQusPickerChange(e) {
    this.setData({
      vipQusIndex: e.detail.value
    })
  },
  bindVipHelpSubmitTap() {
    let data = this.data
    if (!data.vipQusArr.length)
      return

    let params = obj2uri({
      userId: app.globalData.userId || wx.getStorageSync('userId'),
      subjectIds: data.vipQusKeys[data.vipQusIndex],
      isFree: 2,
      callObject: 'all',
    })

    wx.navigateTo({
      url: '../../../pages/help/call/call?' + params
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getPayToHelpQus({
      method: 'get',
      success: (res) => {
        if (res.code == '1000') {
          let category = res.data.category
          let data = category.map((item, idx) => {
            this.data.vipQusKeys.push(item.key)
            return item.val
          })

          this.setData({
            vipQusArr: data,
            duration: res.data.duration,
            amount: res.data.amount,
          })
        }
      }
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