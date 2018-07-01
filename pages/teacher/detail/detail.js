// pages/teacher/detail/detail.js
import { bindVideoItemTap } from '../../templates/video/video'
import { bindCourseTap, catchCourseSubscribeTap } from '../../templates/course/course'
import { getTeacherDetail, getTeacherOnline, assignTeacher } from '../../../utils/api'

var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    teacherData: null,
    videoList: {
      flag: true,
      data: []
    },
    columnList: {
      rankState: false,
      subscribeState: true,
      direction: 'row',
      data: []
    },
    teacherId: null,
    online: false,
    assignBtnFlag: true
  },
  teacherTypeCode: null,
  isFree: 1,
  // 视频点击函数
  bindVideoItemTap(e) {
    bindVideoItemTap(this, e)
  },
  // 跳转到老师的历史接单记录
  bindTeacherHistoryTap() {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  // 课程item点击处理
  bindCourseTap(e) {
    bindCourseTap(this, e)
  },
  // 订阅课程
  catchCourseSubscribeTap(e) {
    catchCourseSubscribeTap(this, e)
  },
  // 连线老师
  bindAssignTeacherTap(e) {
    if (this.data.assignBtnFlag) {
      this.setData({
        assignBtnFlag: false
      })
      if (!wx.getStorageSync('userMobile')) {
        let temp = {
          teacherUserId: this.data.teacherId
        }
        temp = JSON.stringify(temp)
        wx.redirectTo({
          url: `../../../pages/binding/index/binding?type=page&redirect=pages/help/call/call&params=${temp}`
        })
        return
      }
      wx.navigateTo({
        url: `../../../pages/help/call/call?teacherUserId=${this.data.teacherId}&isFree=${this.isFree}`,
      })
      // assignTeacher({
      //   data: {
      //     userId: app.globalData.userId,
      //     teacherUserId: this.data.teacherId
      //   },
      //   success: res => {
      //     if (res.code == '1000') {
      //       wx.navigateTo({
      //         url: `../../../pages/help/call/call?subjectIds=${res.data.caseId}`,
      //       })
      //     } else {
      //       wx.showToast({
      //         icon: '抱歉，老师下线了。',
      //         duration: 2000
      //       })
      //       this.setData({
      //         online: false
      //       })
      //     }
          // this.setData({
          //   assignBtnFlag: true
          // })
      //   }
      // })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let teacherId = options.teacherId
    this.setData({
      teacherId
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
    let teacherId = this.data.teacherId
    console.log({
      'userId': app.globalData.userId,
      'teacherId': teacherId
    })
    // 获得老师详情
    getTeacherDetail({
      data: {
        'userId': app.globalData.userId,
        'teacherId': teacherId
      },
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data
          data.age = parseInt(((new Date().getTime()) - (new Date(data.userBirthDate).getTime())) / 1000 / 60 / 60 / 24 / 365)

          this.setData({
            teacherData: data,
            ['columnList.data']: data.columnList,
            ['videoList.data']: data.vedioInfoList
          })
          this.teacherTypeCode = data.teacherTypeCode || 'N'
          this.isFree = this.teacherTypeCode == 'N' ? 1 : 2
          wx.setNavigationBarTitle({
            title: `${data.userRealname} 详情`
          })
        }
      }
    })
    // 获得老师是否在线
    getTeacherOnline({
      data: {
        userId: teacherId
      },
      success: res => {
        console.log(res, {
          userId: teacherId
        })
        if (res.code == '1000') {
          this.setData({
            online: !!res.data.isOnline
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '给家长的一封信',
      path: '/pages/teacher/detail/detail?teacherid=' + this.data.teacherId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})