import { obj2uri } from '../../../utils/common'

export const bindVideoItemTap = (context, e, to) => {
  // let money = e.currentTarget.dataset.money

  // if (money) {
  //   context.setData({
  //     ['pay.switch']: true,
  //     ['pay.money']: money
  //   })
  // } else {
  //   wx.navigateTo({
  //     url: to || '../../../pages/video/play/play'
  //   })
  // }
  let dataset = e.currentTarget.dataset
  let vediomediaurlquery = dataset.vediomediaurl.split('?')[1]
  wx.setStorageSync('vediomediaurlquery', vediomediaurlquery)

  if (dataset.target == 'self') {
    wx.redirectTo({
      url: (to || '../../../pages/video/play/play') + '?' + obj2uri(dataset)
    })
  } else {
    wx.navigateTo({
      url: (to || '../../../pages/video/play/play') + '?' + obj2uri(dataset)
    })
  }
}