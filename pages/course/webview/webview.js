// pages/course/webview/webview.js
import { obj2uri } from '../../../utils/common'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewUrl: ''
  },
  options: null,
  navBarTitle: '文章详情',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    let webViewUrl = options.url
    this.setData({
      webViewUrl
    })

    if (options.title) {
      this.navBarTitle = options.title.trim()
      wx.setNavigationBarTitle({
        title: options.title.trim(),
      })
    }
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
    return {
      title: this.navBarTitle,
      path: `pages/course/webview/webview?${obj2uri(this.options)}`
    }
  }
})