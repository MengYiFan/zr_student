// pages/course/course.js
import { bindVideoItemTap } from '../../templates/video/video'
import { bindStartScoreTap, bindEvaluateClose, bindSubmitScoreTap } from '../../templates/evaluate/evaluate'
import { catchCourseEvaluateTap, bindCourseTap } from '../../templates/course/course'
import { getMyContentList, getMyCourseList, getMyVedioList } from '../../../utils/api'

var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoList: {
      flag: false,
      data: []
    },
    evaluate: {
      score: 0,
      switch: false,
      dataset: null
    },
    contentList: {
      rankState: true,
      direction: 'row',
      data: []
    },
    courseList: {
      rankState: true,
      direction: 'column',
      data: []
    },
    subscribeList: {
      rankState: true,
      direction: 'column',
      data: []
    }
  },
  // 评分星星点击函数
  bindStartScoreTap(e) {
    bindStartScoreTap(this, e)
  },
  // 评分关闭
  bindEvaluateClose(e) {
    bindEvaluateClose(this)
  },
  // 唤起点评
  catchCourseEvaluateTap(e) {
    console.log(e)
    catchCourseEvaluateTap(this, e)
  },
  // 提交点评
  bindSubmitScoreTap(e) {
    console.log(e)
    bindSubmitScoreTap(this, {
      userId: app.globalData.userId || wx.getStorageSync('userId')
    })
  },
  // 课程跳转
  bindCourseTap(e) {
    bindCourseTap(this, e)
  },
  bindVideoItemTap(e) {
    bindVideoItemTap(this, e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的课程'
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
    // 我的课程
    getMyCourseList({
      data: {
        "userId": app.globalData.userId || wx.getStorageSync('userId'),
        "courseType": 2
      },
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data
          console.log('我的课程: ', data)
          for (var [index, item] of data.entries()) {
            if (!item.courseReportTime)
              item.learnState = 0
            else
              item.learnState = 1
          }
          this.setData({
            ['courseList.data']: data
          })
        }
      }
    })
    // 我的预约
    getMyCourseList({
      data: {
        "userId": app.globalData.userId || wx.getStorageSync('userId'),
        "courseType": 0
      },
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data
          console.log('我的预约: ', data)
          this.setData({
            ['subscribeList.data']: data
          })
        }
      }
    })
    // 我的订阅
    getMyContentList({
      data: {
        "userId": app.globalData.userId || wx.getStorageSync('userId')
      },
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data
          console.log('我的订阅: ', data)
          this.setData({
            ['contentList.data']: data
          })
        }
      }
    })
    // 我的视频列表
    getMyVedioList({
      data: {
        "userId": app.globalData.userId,
        "vedioPaymentIndicator": "1"
      },
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data
          console.log('我的视频列表: ', data)
          this.setData({
            ['videoList.data']: data
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