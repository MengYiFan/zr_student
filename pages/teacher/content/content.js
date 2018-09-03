// pages/teacher/content/content.js
import { obj2uri } from '../../../utils/common'
import { getTeacherContentList } from '../../../utils/api'
import { bindCourseTap, catchCourseSubscribeTap } from '../../templates/course/course'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList: {
      rankState: false,
      subscribeState: true,
      direction: 'row',
      data: [],
      hideTeacher: true
    }
  },
  options: null,

  // 课程item点击处理
  bindCourseTap(e) {
    bindCourseTap(this, e)
  },
  
  // 订阅课程
  catchCourseSubscribeTap(e) {
    catchCourseSubscribeTap(this, e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this

    self.options = options
    if (options.teachername) {
      wx.setNavigationBarTitle({
        title: `${options.teachername} 的专栏文章`,
      })
    }

    if (!options.teacherId || !options.columnId) {
      wx.showToast({
        title: '参数不全',
        icon: 'none',
        duration: 2000
      })
    } else {
      getTeacherContentList({
        data: {
          'userId': app.globalData.userId || wx.getStorageSync('userId'),
          'teacherId': +options.teacherId,
          'columnId': +options.columnId
        },
        success(res) {
          if (res.code == '1000') {
            self.setData({
              ['contentList.data']: res.data
            })
          } else {
            wx.showToast({
              title: res.msg || '服务器错误...',
              icon: 'none',
              duration: 2000
            })
          }
        }
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
      title: '润育商平台，您身边的教育好伴侣',
      path: `pages/teacher/content/content?${obj2uri(this.options)}`
    }
  }
})