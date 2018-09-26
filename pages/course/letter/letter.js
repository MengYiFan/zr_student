// pages/course/letter/letter.js
import { getCourseDetail } from '../../../utils/api'
import { obj2uri } from '../../../utils/common'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: null,
    info: null,
    courseofferid: null,
    letter: {
      content: '',
      cover: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    }
  },
  options: null,
  bindEnterLiveTap(e) {
    let info = this.data.info,
        params = obj2uri({
          courseofferid: this.data.courseofferid,
          courseExpectedFunction: info.courseExpectedFunction,
          courseName: info.courseName,
          coursePurpose: info.coursePurpose,
          subjectIds: info.subjectIds,
          teacherName: info.teacherName,
          teacherUserId: info.teacherUserId
        })

    wx.navigateTo({
      url: `../../../pages/video/live/live?${params}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    let courseId = options.courseid,
        courseofferid = options.courseofferid
    this.setData({
      courseId, courseofferid
    })

    getCourseDetail({
      data: {
        courseId
      },
      success: res => {
        if (res.code == '1000') {
          this.setData({
            info: res.data
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
    return {
      title: '给家长的一封信',
      path: `/pages/course/letter/letter?${obj2uri(this.options)}`
    }
  }
})