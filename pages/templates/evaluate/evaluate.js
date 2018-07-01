import { setVedioRank, setContentBank, setCourseBank } from '../../../utils/api'

// 获得星星分数
export const bindStartScoreTap = (context, e) => {
  context.setData({
    ['evaluate.score']: parseInt(e.currentTarget.dataset.index) + 1
  })
}

// 评分关闭
export const bindEvaluateClose = (context) => {
  context.setData({
    ['evaluate.switch']: false
  })
}

// 提交评分
export const bindSubmitScoreTap = (context, data) => {
  let evaluate = context.data.evaluate,
      dataset = evaluate.dataset || null,
      params = {}
  if (!dataset)
    return

  if (context.data.evaluate.score == 0) return
  
  console.log(dataset)
  switch (dataset.type) {
    case 'vedio': {
      if(!dataset.grade) {
        return// true代表需要评论
      }
      params = {
        userId: data.userId,
        vedioId: dataset.vedioid,
        userGrade: context.data.evaluate.score
      }
      console.log('params: ', params)
      setVedioRank({
        data: params,
        success: res => {
          if (res.code == '1000') {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            context.setData({
              ['evaluate.switch']: false
            })
          }
        }
      })
      break
    }
    case 'content': {
      params = {
        userId: data.userId,
        columnContentId: dataset.columncontentid,
        userGrade: context.data.evaluate.score
      }
      console.log('params: ', params)
      setContentBank({
        data: params,
        success: res => {
          if (res.code == '1000') {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            context.setData({
              ['evaluate.switch']: false
            })
          }
        }
      })
      break
    }
    case 'course': {
      params = {
        userId: data.userId,
        courseRegistryId: dataset.courseid,
        courseOfferCustomerGrade: context.data.evaluate.score
      }
      setCourseBank({
        data: params,
        success: res => {
          if (res.code == '1000') {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            context.setData({
              ['evaluate.switch']: false
            })
          }
        }
      })
      break
    }
    default:
      break
  }
}