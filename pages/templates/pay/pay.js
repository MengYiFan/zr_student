import {
  payVedio, payInit, payQuery, payResult, payClose, payVedioInit, getVedioLive
} from '../../../utils/api'
import { obj2uri } from '../../../utils/common'


var app = getApp()
/*
 * 支持窗口初始数据（包括打开，金额，优惠信息）
 */
export const payData = {
  switch: false,// 显示支付窗口
  money: 0,// 支付金额
  orderNumber: null,
  orderName: '',
  orderInfo: '',
  orderId: null,
  moneyList:  [],
  payIndex: 0,
  orderTypeCode: null,
  discounts: {// 优惠券信息
    switch: false,// 展开优惠券
    list: [// 各种优惠券 checked表示没有选用
      { checked: false, name: '优惠5元', reduced: 5 },
      { checked: false, name: '优惠10元', reduced: 10 },
      { checked: false, name: '优惠12元', reduced: 12 },
      { checked: false, name: '优惠20', reduced: 20 },
      { checked: false, name: '优惠30', reduced: 30 },
      { checked: false, name: '优惠3', reduced: 3 }
    ],
    total: 0,// 总共选了几张
    sum: 0// 总共减少的金额
  },
  data: {}
}

/*
 * 关闭支付窗口
 */
export const bindPayClose = (context) => {
  context.setData({
    ['pay.switch']: false
  })
}

/*
 * 优惠券列表展示开关
 */
export const bindDiscountsSwitch = (context) => {
  context.setData({
    ['pay.discounts.switch']: !context.data.pay.discounts.switch
  })
}

/*
 * 监听优惠券选择
 */
export const bindDiscountsChange = (context, e) => {
  let checkedIndexArr = e.detail.value,
    discountsList = context.data.pay.discounts.list
  // 更新选中对勾状态
  for (let [index, val] of discountsList.entries()) {
    discountsList[index].checked = checkedIndexArr.indexOf('' + index) != -1 ? true : false
  }

  // 总共减少数额
  let sum = 0
  for (let val of checkedIndexArr) {
    sum += discountsList[val].reduced
    // 不可能倒贴钱的把~
    if (sum > context.data.pay.money) {
      sum = context.data.pay.money
    }
  }
  context.setData({
    ['pay.discounts.list']: discountsList,
    ['pay.discounts.total']: checkedIndexArr.length,
    ['pay.discounts.sum']: sum
  })
}

const payCloseHandle = (orderNumber, times) => {
  payClose({
    data: {
      out_trade_no: orderNumber
    },
    success: res => {
      if (res.code == '1000') {
        wx.redirectTo({
          url: '../../../pages/self/bill/bill'
        })
      } else {
        if (times > 0) {
          --times
          setTimeout(function () {
            payCloseHandle(orderNumber, times)
          }, 1000)
        } else {
          wx.showToast({
            icon: 'none',
            title: '取消支付失败, 请联系客服..'
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }
      }
    }
  })
}

const getTrueVedioUri = (context, e) => {
  getVedioLive({
    data: {
      ownerId: app.globalData.userId || wx.getStorageSync('userId'),
      sourceId: context.options.vedioid,
      type: 3
    },
    success: res => {
      let data = res.data
      if (res.code == '1000') {
        try {
          // context.setData({
          //   payStatus: true,
          //   ['options.vediomediaurl']: data.match(/rtmp:\/\/[^,]*/ig)[0].replace('"', ''),
          //   ['video.src']: data.match(/rtmp:\/\/[^,]*/ig)[0].replace('"', ''),
          //   ['pay.switch']: false,
          // })
          context.setData({
            payStatus: true,
            ['options.vediomediaurl']: data,
            ['video.src']: data,
            ['pay.switch']: false,
          })
          that.timer = null
        } catch (e) { console.log(e) }
        context.setData({
          liveData: data
        })
      } else {
        console.log('轮训更新url')
        context.timer = setTimeout(() => {
          getTrueVedioUri(context, e)
        }, 10000)
      }
    }
  })
}

export const bindPaySubmitTap = (context, e, type) => {
  let payData = context.data.pay

  if (type == 'billPay') {
    let reqData = {
      body: payData.orderName,
      out_trade_no: payData.orderNumber,
      total_fee: payData.money,
      sub_openid: wx.getStorageSync('userId'),
      attach: payData.orderTypeCode
    }
    payInit({
      data: reqData,
      success: res => {
        if (res.code == '1000') {
          let response = res.data
          wx.requestPayment({
              'timeStamp': response.timeStamp,
              'nonceStr': response.nonceStr,
              'package': response.package,
              'signType': 'MD5',
              'paySign': response.paySign,
              'success': function (res) {
                if (res.errMsg == 'requestPayment:ok') {
                  context.setData({
                    ['pay.switch']: false,
                  })
                  wx.showToast({
                    icon: 'none',
                    title: '支付成功..'
                  })
                  setTimeout(function () {
                    wx.hideLoading()
                    wx.redirectTo({
                      url: '../../../pages/self/bill/bill'
                    })
                  }, 2000)
                }
              },
              'fail': function (res) {
                context.setData({
                  ['pay.switch']: false,
                })
                // 取消订单号
                payCloseHandle(payData.orderNumber, 3)
                wx.showToast({
                  icon: 'none',
                  title: '支付失败, 请稍后再试..'
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 2000)
              },
              'complete': function (res) {
               }
            })
        }
      }
    })
  } else if (type == 'walletPay') {
    let reqData = {
      body: payData.orderName,
      out_trade_no: payData.orderNumber,
      total_fee: payData.money,
      sub_openid: wx.getStorageSync('userId'),
      attach: payData.orderTypeCode
    }
    // 发起正式的支付
    payInit({
      data: reqData,
      success: res => {
        if (res.code == '1000') {
          let response = res.data
          wx.requestPayment({
              'timeStamp': response.timeStamp,
              'nonceStr': response.nonceStr,
              'package': response.package,
              'signType': 'MD5',
              'paySign': response.paySign,
              'success': function (res) {
                if (res.errMsg == 'requestPayment:ok') {
                  context.setData({
                    ['pay.switch']: false,
                  })
                  wx.showToast({
                    icon: 'none',
                    title: '支付成功...',
                    duration: 2000
                  })
                  //
                  context.setData({
                    ['pay.switch']: false,
                  })

                  setTimeout(function () {
                    wx.hideLoading()
                    if (context.options.type == 'paycall') {
                      wx.redirectTo({
                        url: '../../../pages/help/call/call?' + obj2uri(context.options)
                      })
                    }
                  }, 2000)
                }
              },
              'fail': function (res) {
                context.setData({
                  ['pay.switch']: false,
                })
                // 取消订单号
                payCloseHandle(payData.orderNumber, 3)
                wx.showToast({
                  icon: 'none',
                  title: '支付失败, 请稍后再试..'
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 2000)
              },
              'complete': function (res) {
              }
            })
        }
      }
    })
  } else {
    // TO DO 
    // /createVedioOrder
    payVedioInit({
      data: {
        ownerId: app.globalData.userId || wx.getStorageSync('userId'),
        sourceId: context.options.vedioid,
        type: 3
      },
      success: res => {
        console.log('payVedioInit: ', res)
        if (res.code == '1000') {
          let payData = res.data,
              reqData = {
                body: payData.orderName,
                out_trade_no: payData.orderSerialNumber,
                total_fee: payData.orderAmount,
                sub_openid: wx.getStorageSync('userId'),
                attach: payData.orderTypeCode
              }
          // 发起正式的支付
          payInit({
            data: reqData,
            success: res => {
              if (res.code == '1000') {
                let response = res.data
                wx.requestPayment(
                  {
                    'timeStamp': response.timeStamp,
                    'nonceStr': response.nonceStr,
                    'package': response.package,
                    'signType': 'MD5',
                    'paySign': response.paySign,
                    'success': function (res) {
                      if (res.errMsg == 'requestPayment:ok') {
                        context.setData({
                          ['pay.switch']: false,
                        })
                        wx.showToast({
                          icon: 'none',
                          title: '支付成功..'
                        })
                        //
                        context.setData({
                          ['pay.switch']: false,
                        })

                        getTrueVedioUri(context, e)

                        setTimeout(function () {
                          wx.hideLoading()
                        }, 2000)
                      }
                    },
                    'fail': function (res) {
                      context.setData({
                        ['pay.switch']: false,
                      })
                      // 取消订单号
                      payCloseHandle(payData.orderNumber, 3)
                      wx.showToast({
                        icon: 'none',
                        title: '支付失败, 请稍后再试..'
                      })
                      setTimeout(function () {
                        wx.hideLoading()
                      }, 2000)
                    },
                    'complete': function (res) {
                    }
                  })
              }
            }
          })
        }
      }
    })
    // let data = Object.assign(payData.data, {
    //   vedioPaymentTime: new Date(),
    //   vedioPaymentIndicator: "1",
    //   vedioPaymentAmount: payData.money,
    //   userId: wx.getStorageSync('userId'),
    //   vedioId: context.options.vedioid
    // })

    // payVedio({
    //   data,
    //   success: res => {
    //     if (res.code == '1000') {
          // context.setData({
          //   payStatus: true,
          //   ['options.vediomediaurl']: res.data.vedioMediaUrl,
          //   ['video.src']: res.data.vedioMediaUrl,
          //   ['pay.switch']: false,
          // })
    //     }
    //   }
    // })
  }
}