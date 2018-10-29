//index.js
import { chunkArr, getImageUrl } from '../../../utils/common'
import { bindVideoItemTap } from '../../templates/video/video'
import { bindCourseTap } from '../../templates/course/course'
import { payData, bindPayClose, bindDiscountsSwitch, bindDiscountsChange } from '../../templates/pay/pay'
import { getBanner, getCubjectList, getRecommendTeacherList, getPublicCourseList, getVideoList } from '../../../utils/api'

var app = getApp()

Page({
  data: {
    isScroll: true,
    pay: {},
    swiper: {
      autoplay: false,
      indicatorDots: false,
      interval: 3000,
      duration: 500,
      current: 1,
      circular: true
    },
    videoList: {
      flag: true,
      data: []
    },
    imgUrls: [],
    funcList: [],
    funcList2: [
      [{ subjectName: '学习方法', iconUrl: '../../../images/func-icons/learning.png' },
        { subjectName: '亲子活动', iconUrl: '../../../images/func-icons/children.png' },
        { subjectName: '习惯养成', iconUrl: '../../../images/func-icons/habit.png' },
        { subjectName: '性格培养', iconUrl: '../../../images/func-icons/character.png' }],
      [{ subjectName: '大咖订阅', iconUrl: '../../../images/func-icons/subscription.png' },
        { subjectName: '升学辅导', iconUrl: '../../../images/func-icons/tutoring.png' },
        { subjectName: '叛逆安抚', iconUrl: '../../../images/func-icons/rebellious.png' },
        { subjectName: '婚姻家庭', iconUrl: '../../../images/func-icons/family.png' }]
    ],
    teacherList: [],
    publicCourseList: {
      rankState: false,
      direction: 'row',
      data: []
    }
  },
  bindBannerTap(e) {
    let url = e.currentTarget.dataset.url
    
    url && wx.navigateTo({
      url: `../../../pages/course/webview/webview?url=${e.currentTarget.dataset.url}`,
    })
  },
  bindFuncItemTap(e) {
    let dataset = e.currentTarget.dataset

    wx.navigateTo({
      url: `../../../pages/course/list/list?subjectid=${dataset.subjectid}&subjectname=${dataset.subjectname}`
    })
  },
  // 视频点击函数
  bindVideoItemTap(e) {
    bindVideoItemTap(this, e)
  },
  // 显示支付
  bindPayClose() {
    bindPayClose(this)
  },
  // 优惠券下拉选择 开关
  bindDiscountsSwitch(e) {
    bindDiscountsSwitch(this)
  },
  // 监听优惠选择的姿态
  bindDiscountsChange(e) {
    bindDiscountsChange(this, e)
  },
  // 课程item点击处理
  bindCourseTap(e) {
    bindCourseTap(this, e)
  },
  // 跳转老师详情
  bindTeacherDetailTap(e) {
    let teacherId = e.currentTarget.dataset.teacherid || false
    wx.navigateTo({
      url: '../../../pages/teacher/detail/detail?teacherId=' + teacherId
    })
  },
  onLoad: function(options) {
    if (options.mobile) {
      wx.setStorageSync('recommended_mobile_phone', options.mobile)
    }
  },
  onShow: function() {
    getBanner({
      method: 'GET',
      success: res => {
        if (res.code == '1000') {
          let imgUrls = res.data.map(item => {
            item.key = getImageUrl(item.key)
            
            return item
          })

          this.setData({
            imgUrls: imgUrls
          })
        }
      }
    })
    // 获得首页的功能列表
    getCubjectList({
      success: (res) => {
        let data = chunkArr(res.data, 4)
        console.log('功能区列表: ', data)
        this.setData({
          funcList: data
        })
      }
    })
    // 推荐老师列表
    getRecommendTeacherList({
      data: {
        "userId": app.globalData.userId
      },
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data
          console.log('推荐老师列表: ', data)
          this.setData({
            teacherList: data
          })
        }
      }
    })
    // 公益课堂
    getPublicCourseList({
      data: {
        "userId": app.globalData.userId
      },
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data
          console.log('公益课堂列表: ', data)
          this.setData({
            ['publicCourseList.data']: data
          })
        }
      }
    })
    // 获得推荐视频列表
    getVideoList({
      data: {
        "userId": app.globalData.userId
      },
      success: (res) => {
        if (res.code == '1000') {
          let data = res.data
          console.log('推荐视频列表: ', data)
          this.setData({
            ['videoList.data']: data
          })
        }
      }
    })
    // 支付数据初始化
    this.setData({
      pay: payData
    })
  },
  onShareAppMessage: function () {
    return {
      title: '润育商平台，您身边的教育好伴侣',
      path: '/pages/index/index/index'
    }
  }
})
