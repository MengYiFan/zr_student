// pages/self/integral/integral.js
import { loyaltyConf } from '../../../conf/index'
import { getWalletLoyaltyInfo } from '../../../utils/api'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loyaltyRecordList: null,
    pointTotal: 0,
    conf: null,
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      conf: loyaltyConf
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 积分
    getWalletLoyaltyInfo({
      data: {
        "userId": app.globalData.userId
      },
      success: (res) => {
        if (res.code == '1000') {
          console.log(res.data)
          let loyaltyRecordList = res.data.loyaltyRecordList,
            pointTotal = 0
          // 积分时间格式转换
          for (var [index, item] of loyaltyRecordList.entries()) {
            let time = new Date(item.loyaltyTxnTime)
            loyaltyRecordList[index].date = time.toLocaleString()
            pointTotal += item.loyaltyPoint
          }
          this.setData({
            loyaltyRecordList,
            pointTotal,
            data: res.data
          })
        }
      }
    })
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