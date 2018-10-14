// pages/self/bill/bill.js
import { walletConf } from '../../../conf/index'
import { getOrderList, getOrderDetail } from '../../../utils/api'
import { payData, bindPayClose, bindDiscountsSwitch, bindDiscountsChange, bindPaySubmitTap } from '../../templates/pay/pay'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay: {},
    billList: [],
    conf: null,
    orderNumber: null,
    orderName: '',
    orderTypeCode: null,
    orderDetail: {},
    showOrderDetail: {},
    orderTypeCodeDict: {
      'V': '视频',
      'C': '课程',
      'L': '打赏',
      'W': '充值',
      'O': '其他'
    }
  },
  bindBillTap(e) {
    let that = this,
        dataset = e.currentTarget.dataset,
        money = dataset.money || 0,
        orderNumber = dataset.ordernumber,
        orderName = dataset.ordername,
        orderId = dataset.orderid,
        orderTypeCode = dataset.ordertypecode,
        orderState = dataset.orderstate

    if (orderState == 1) {
      let showOrderDetail
      // 获得该账单详情
      if (typeof that.data.showOrderDetail[orderId] == 'undefined') {
        showOrderDetail = Object.assign({}, that.data.showOrderDetail, {
          [orderId]: true
        })
        getOrderDetail({
          data: {
            orderId
          },
          success: res => {
            console.log('getOrderDetail:', res)
            if (res.code == '1000') {
              let orderDetail = Object.assign({}, that.data.orderDetail, {
                [orderId]: res.data
              })

              that.setData({
                orderDetail
              })
            }
          }
        })
      } else {
        // 不用再去请求 detail 直接修改显示状态信息
        if (!!that.data.showOrderDetail[orderId]) {
          showOrderDetail = Object.assign({}, that.data.showOrderDetail, {
            [orderId]: false
          })
        } else {
          showOrderDetail = Object.assign({}, that.data.showOrderDetail, {
            [orderId]: true
          })
        }
      }
      that.setData({
        showOrderDetail
      })
      return
    }

    if (!money || money == 0 || !orderNumber) {
      return
    }

    this.setData({
      ['pay.switch']: true,
      ['pay.money']: money,
      ['pay.orderNumber']: orderNumber,
      ['pay.orderName']: orderName,
      ['pay.orderId']: orderId,
      ['pay.orderTypeCode']: orderTypeCode
    })
  },
  // 关闭支付窗口
  bindPayClose() {
    bindPayClose(this, this.getOrderListHandle())
  },
  bindPaySubmitTap(e) {
    bindPaySubmitTap(this, e, 'billPay')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      conf: walletConf,
      pay: payData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getOrderListHandle() {
    // 积分
    getOrderList({
      data: {
        "userId": app.globalData.userId || wx.getStorageSync('userId')
      },
      success: (res) => {
        console.log(res)
        if (res.code == '1000') {
          let data = res.data
          // // 钱包消费时间格式转换
          // for (var [index, item] of walletRecordList.entries()) {
          //   let time = new Date(item.walletTxnTime)
          //   walletRecordList[index].date = time.toLocaleString()
          // }
          this.setData({
            billList: data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderListHandle()
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