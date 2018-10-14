// pages/self/wallet/wallet.js
import { walletTxnConf, walletTraceConf } from '../../../conf/index'
import { getWalletLoyaltyInfo, walletPayInt } from '../../../utils/api'
import { payData, bindPayClose, bindDiscountsSwitch, bindDiscountsChange, bindPaySubmitTap } from '../../templates/pay/pay'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletRecordList: null,
    conf: null,
    data: {},
    pay: {},
    payNumberList: {
      values: [],
      options: []
    }
  },
  options: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      walletTxnConf,
      walletTraceConf
    })
  },
  getWalletLoyaltyInfoFn() {
    // 钱包数据
    getWalletLoyaltyInfo({
      data: {
        "userId": app.globalData.userId || wx.getStorageSync('userId')
      },
      success: (res) => {
        if (res.code == '1000') {

          let walletRecordList = res.data.walletRecordList,
            pointTotal = 0

          // 积分时间格式转换
          for (var [index, item] of walletRecordList.entries()) {
            let time = new Date(item.loyaltyTxnTime)
            walletRecordList[index].date = time.toLocaleString()
          }

          let payNumberList = { values: [], options: [] }
          Object.keys(res.data.chargeMoneyList).forEach(key => {
            payNumberList.values.push(key)
            payNumberList.options.push(res.data.chargeMoneyList[key])
          })

          this.setData({
            walletRecordList,
            pointTotal,
            data: res.data,
            payNumberList
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getWalletLoyaltyInfoFn()
  },
  bindPickerChange: function (e) {
    let v = e.detail.value, payNumberList = this.data.payNumberList
    this.topUpHandle(payNumberList.options[v], payNumberList.values[v])
  },
  // 关闭支付窗口
  bindPayClose() {
    bindPayClose(this)
  },
  topUpHandle(money, value) {
    let that = this
    walletPayInt({
      data: {
        // rechargeBalance: money,
        rechargeOption: value,
        userId: app.globalData.userId || wx.getStorageSync('userId')
      },
      success(res) {
        if (res.code == '1000') {
          that.setData({
            ['pay.switch']: true,
            ['pay.money']: money,
            ['pay.orderName']: '钱包充值',
            ['pay.orderTypeCode']: 'orderTypeCode',
            ['pay.orderNumber']: res.data.orderSerialNumber,
            ['pay.orderTypeCode']: res.data.orderTypeCode,
          })
        }
      }
    })
  },
  bindPaySubmitTap(e) {
    bindPaySubmitTap(this, e, 'walletPay')
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