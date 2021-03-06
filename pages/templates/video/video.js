import { obj2uri } from '../../../utils/common'

export const bindVideoItemTap = (context, e, to) => {
  let dataset = e.currentTarget.dataset
  let vediomediaurlquery = dataset.vediomediaurl.split('?')[1].replace(/=/gi, '$').replace(/&/gi, '.')
  wx.setStorageSync('vediomediaurlquery', vediomediaurlquery)
  dataset = Object.assign({}, dataset, {
    vediomediaurlquery: vediomediaurlquery
  })

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