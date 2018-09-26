// pages/course/list/list.js
import { bindVideoItemTap } from '../../templates/video/video'
import { bindCourseTap } from '../../templates/course/course'
import { getListContent, getListVedio, searchContent, searchVedio } from '../../../utils/api'
import { obj2uri } from '../../../utils/common'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchClearFlag: false,
    searchValue: '',
    inputFocusFlag: false,
    searchResult: {
      rankState: false,
      direction: 'row',
      data: []
    },
    videoList: {
      flag: true,
      hiddenBtn: true,
      data: []
    },
    tabName: 'article', // article || video
    options: null
  },
  // 课程跳转
  bindCourseTap(e) {
    bindCourseTap(this, e)
  },
  // 视频点击进入
  bindVideoItemTap(e) {
    bindVideoItemTap(this, e)
  },
  // 搜索输入
  bindSearchInput: function (e) {
    let val = e.detail.value
    this.setData({
      searchClearFlag: val ? true : false,// 清除icon flag
      searchValue: val
    })
  },
  // 清空搜索内容
  searchClearTag: function () {
    this.setData({
      searchValue: '',
      searchClearFlag: false,
      inputFocusFlag: true
    })
  },
  // 搜索按钮绑定
  bindSerachTap(e) {
    let that = this,
        searchVal = e.detail.value || this.data.searchValue
    that.searchContentFn(that, searchVal)
  },
  // 搜索课程
  searchContentFn(context, searchValue) {
    searchContent({
      data: {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
        columnContentTitle: searchValue
      },
      success: res => {
        if (res.code == '1000') {
          context.setData({
            ['searchResult.data']: res.data
          })
          // 进入视频搜索FN
          context.searchVedioFn(context, searchValue)
        }
      }
    })
  },
  // 搜索视频
  searchVedioFn(context, searchValue) {
    searchVedio({
      data: {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
        vedioName: searchValue
      },
      success: res => {
        if (res.code == '1000') {
          context.setData({
            ['videoList.data']: res.data
          })
        }
      }
    })
  },
  bindTabsTap(e) {
    this.setData({
      tabName: e.currentTarget.dataset.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options
    })
    // 获得课程
    getListContent({
      data: {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
        subjectId: options.subjectid
      },
      success: res => {
        if (res.code == '1000') {
          this.setData({
            ['searchResult.data']: res.data
          })
        }
      }
    })

    getListVedio({
      data: {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
        subjectIds: options.subjectname
      },
      success: res => {
        if (res.code == '1000') {
          this.setData({
            ['videoList.data']: res.data
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
      title: '搜索',
      path: `/pages/course/list/list?${obj2uri(this.data.options)}`
    }
  }
})