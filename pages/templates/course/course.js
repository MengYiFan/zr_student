import { getTeacherColumnSubscribe } from '../../../utils/api'

var app = getApp()

export const bindCourseTap = (context, e) => {
  let dataset = e.currentTarget.dataset,
      courseid = dataset.courseid,
      columnid = dataset.columnid,
      courseofferid = dataset.courseofferid,
      columncontenturl = dataset.columncontenturl

  if (columncontenturl) {
    wx.navigateTo({
      url: '../../../pages/course/webview/webview?url=' + columncontenturl,
    })
    return
  }
    
  if (!courseid) {
    wx.showToast({
      title: '服务器繁忙',
      icon: 'none',
      duration: 2000
    })
    return
  }
  wx.navigateTo({
    url: `../../../pages/course/letter/letter?courseid=${courseid}&courseofferid=${courseofferid}` 
  })
}

// 点击待评价 弹出评价
export const catchCourseEvaluateTap = (context, e) => {
  context.setData({
    ['evaluate.switch']: true,
    ['evaluate.score']: null,
    ['evaluate.dataset']: e.currentTarget.dataset
  })
}

// 课程订阅
export const catchCourseSubscribeTap = (context, e) => {
  let dataset = e.currentTarget.dataset,
      columnId = dataset.columnid,
      index = dataset.index,
      columnList = context.data.columnList

  getTeacherColumnSubscribe({
    data: {
      userId: app.globalData.userId,
      columnId
    },
    success: res => {
      console.log(`订阅columnId: ${columnId}：`, res)
      if (res.code == '1000') {
        context.setData({
          [`columnList.data[${index}].columnSubscribeTime`]: new Date()
        })
        setTimeout(() => {
          wx.showToast({
            title: '订阅成功！',
            icon: 'success',
            duration: 2000
          })
        }, 0)
      } else {
        setTimeout(() => {
          wx.showToast({
            title: '服务器繁忙',
            icon: 'none',
            duration: 2000
          })
        }, 0)
      }
    }
  })
}