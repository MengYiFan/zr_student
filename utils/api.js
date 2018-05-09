'use strict';

import * as C from 'constants'

// 请求数据
// @params { method, data, success, fail, complete }
const wxRequest = (params, url) => {
  if (params.showToast) {
    wx.showToast({
      mask: true,
      title: '加载中...',
      icon: 'loading'
    })
  }

  if (!wx.getStorageSync('userId') && !params.authorization) {
    return
  } else {
    // params.data.userId = params.data.userId || wx.getStorageSync('userId')
  }

 
  wx.showNavigationBarLoading()

  if (!params.showLoading) {
    wx.showLoading({
      title: '加载中...',
    })
  }
  
  wx.request({
    url: url,
    method: params.method || 'POST',
    data: params.data || {},
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      params.success && params.success(res.data)
      if (params.showToast) {
        wx.hideToast()
      }
      wx.hideNavigationBarLoading()
      console.log('URL: ', url)
      console.log('参数:', params.data)
      console.log('结果:', res.data)
    },
    fail: (res) => {
      console.log(res)
      params.fail && params.fail(res)
    },
    complete: (res) => {
      if (!params.showLoading) {
        wx.hideLoading()
      }
      params.complete && params.complete(res.data)
    }
  })
}

exports.wxRequest = wxRequest

// 转url query传值
export let _obj2uri = (obj) => {
  return Object.keys(obj).map((i) => {
    return encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
  }).join('&');
}

// 登录/打开小程序
export const userLogin = (params) => {
  wxRequest(params, C.USER_LOGON)
  console.log(params, '@@@@@@')
}

// 问题分类列表
export const getCubjectList = (params) => wxRequest(params, C.CUBJECT_LIST)
// 我的推荐老师recommend
export const getRecommendTeacherList = (params) => wxRequest(params, C.RECOMMEND_TEACHER_LIST)
// 公益课程列表
export const getPublicCourseList = (params) => wxRequest(params, C.PUBLIC_COURSE_LIST)
// 推荐视频列表
export const getVideoList = (params) => wxRequest(params, C.VIDEO_LIST)

// 获得课程推荐列表
export const getMyContentList = (params) => wxRequest(params, C.MY_CONTENT_LIST)
// 我的老师列表
export const getMyCourseList = (params) => wxRequest(params, C.MY_COURSE_LIST)
// 我的视频列表
export const getMyVedioList = (params) => wxRequest(params, C.MY_VEDIO_LIST)

// 老师详细信息
export const getTeacherDetail = (params) => wxRequest(params, C.TEACHER_DETAIL)
// 老师专栏订阅
export const getTeacherColumnSubscribe = (params) => wxRequest(params, C.TEACHER_COLUMN_SUBSCRIBE)
// 老师是否在线
export const getTeacherOnline = (params) => wxRequest(params, C.IS_ONLINE)
// 连线这个老师
export const assignTeacher = (params) => wxRequest(params, C.HELP_ASSIGN)
export const assignLink = (params) => wxRequest(params, C.ASSIGN_LINK)

//  v2
export const callAll = (params) => wxRequest(params, C.CALL_ALL)
export const getImInfo = (params, id) => wxRequest(params, C.GET_IM + '/' + id)
export const polling = (params, caseId, userId) => wxRequest(params, C.POLLING_URI + '/' + caseId + '/' + userId)
export const enterRoom = (params, rootId, userId) => wxRequest(params, C.ENTER_ROOM + '/' + rootId + '/' + userId)
export const enterRtcroom = (params, rootId) => wxRequest(params, C.ENTER_RTCROOM + '/' + rootId + '/pushers')
export const exitRtcroom = (params, rootId, userId) => wxRequest(params, C.ENTER_RTCROOM + '/' + rootId + '/' + userId)
export const heartbeat = (params, rootId, userId) => wxRequest(params, C.HEARTBEAT + '/' + rootId + '/' + userId)
//
export const getPusher = (params, userId) => wxRequest(params, C.GET_PUSHER + '/' + userId)

export const hangupApply = (params, userId) => wxRequest(params, C.HANGUP_APPLY)

// 年龄分类
export const getCategoryAge = (params) => wxRequest(params, C.CATEGORY_AGE)
// 问题分类
export const getCategoryQus = (params) => wxRequest(params, C.CATEGORY_QUS)
// 求助call
export const getHelpCall = (params) => wxRequest(params, C.HELP_CALL)
// 挂断call
export const hangupHelpCall = (params) => wxRequest(params, C.HELP_CALL_HANGUP)

// 用户关注问题领域（包括家长和育商师）
export const getSubjectList = (params) => wxRequest(params, C.SUBJECT_LIST)
// 更新用户关注问题领域（包括家长和育商师）-增加关注
export const updateSubject = (params) => wxRequest(params, C.UPDATE_SUBJECT)
// 钱包积分信息
export const getWalletLoyaltyInfo = (params) => wxRequest(params, C.WALLET_LOYALTY_INFO)

// 课程详细信息
export const getCourseDetail = (params) => wxRequest(params, C.COURSE_DETAIL)

// 获得直播地址
export const getVedioLive = (params) => wxRequest(params, C.VEDIO_LIVE)

export const setVedioRank = (params) => wxRequest(params, C.VEDIO_RANK)
export const setContentBank = (params) => wxRequest(params, C.CONTENT_BANK)
export const setCourseBank = (params) => wxRequest(params, C.COURSE_BANK)

export const recordVedio = (params) => wxRequest(params, C.PAY_VEDIO)

// SEARCH&LIST
export const getListContent = (params) => wxRequest(params, C.LIST_CONTENT)
export const getListVedio = (params) => wxRequest(params, C.LIST_VEDIO)
export const searchContent = (params) => wxRequest(params, C.SEARCH_CONTENT)
export const searchVedio = (params) => wxRequest(params, C.SEARCH_VEDIO)

// PAY
export const payInit = (params) => wxRequest(params, C.PAY_INIT)
export const payQuery = (params) => wxRequest(params, C.PAY_QUERY)
export const payResult = (params) => wxRequest(params, C.PAY_RESULT)
export const payClose = (params) => wxRequest(params, C.PAY_CLOSE)

export const payVedioInit = (params) => wxRequest(params, C.PAY_VEDIO_INIT)

export const rewardMe = (params) => wxRequest(params, C.REWARD)

// 验证码
export const phoneValidationCode = (params, phone_number) => wxRequest(params, C.PHONE_VALIDATION_CODE + '/' + phone_number)
// 绑定用户信息
export const bindUser = (params) => wxRequest(params, C.BIND_USER)

////////////////
// 家长我的课程列表
export const getCourseList = (params) => wxRequest(params, C.COURSE_LIST)


// 老师专栏文章列表
export const getTeacherContentList = (params) => wxRequest(params, C.TEACHER_CONTENT_LIST)
// 用户订单列表
export const getOrderList = (params) => wxRequest(params, C.ORDER_LIST)

//
export const getOrderDetail = (params) => wxRequest(params, C.ORDER_DETAIL)
