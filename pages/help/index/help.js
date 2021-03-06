// pages/help/help.js
import { getCategoryAge, getCategoryQus, getPayToHelpQus } from '../../../utils/api'
import { obj2uri } from '../../../utils/common' 

var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    qusArr: [],
    ageArr: [],
    qusKeys: [],
    ageKeys: [],
    qusIndex: 0,
    ageIndex: 0,
    sexList: [
      {
        iconSrc: '../../../images/other/man.png',
        iconCheckedSrc: '../../../images/other/man2.png',
        name: '男孩',
      }, {
        iconSrc: '../../../images/other/girl.png',
        iconCheckedSrc: '../../../images/other/girl2.png',
        name: '女孩',
      }
    ],
    sexIndex: 0,
    sexConfArr: ['M', 'F'],
    
    currentTabName: 'general',

    vipQusIndex: 0,
    vipQusArr: [],
    vipQusKeys: [],
    duration: 30,
    amount: 50,
  },
  // 连线
  bindHelpSubmitTap(e) {
    let data = this.data
    if (!data.qusArr.length || !data.ageArr.length)
      return
    
    let params = obj2uri({
      userId: app.globalData.userId || wx.getStorageSync('userId'),
      subjectIds: data.qusKeys[data.qusIndex],
      caseTargetAge: data.ageKeys[data.ageIndex],
      caseTargetGender: data.sexConfArr[data.sexIndex],
      callObject: 'all',
      isFree: 1,
    })

    wx.navigateTo({
      url: '../../../pages/help/call/call?' + params
    })
  },
  radioChange: function (e) {
    let val = e.detail.value
    this.setData({
      sexIndex: val
    })
  },
  bindQusPickerChange: function (e) {
    this.setData({
      qusIndex: e.detail.value
    })
  },
  bindAgePickerChange: function (e) {
    this.setData({
      ageIndex: e.detail.value
    })
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
  tabsHandl(e) {
    this.setData({
      currentTabName: e.currentTarget.dataset.type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 年龄分类
    getCategoryAge({
      method: 'get',
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data.map((item, idx) => {
            this.data.ageKeys.push(item.key)
            return item.val
          })

          this.setData({
            ageArr: data
          })
        }
      }
    })
    // 问题分类
    getCategoryQus({
      method: 'get',
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data.map((item, idx) => {
            this.data.qusKeys.push(item.key)
            return item.val
          })

          this.setData({
            qusArr: data
          })
        }
      }
    })
    
    // 付费求助
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
    if (!wx.getStorageSync('userMobile')) {
      wx.redirectTo({
        url: '../../../pages/binding/index/binding?type=tab&redirect=pages/help/index/help'
      })
    }
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
    return {
      title: '一键连线育商师',
      path: '/pages/help/index/help'
    }
  }
})