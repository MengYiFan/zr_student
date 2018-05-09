// pages/videoPlay/videoPlay.js
import { bindVideoItemTap } from '../../templates/video/video'
import { payData, bindPayClose, bindDiscountsSwitch, bindDiscountsChange, bindPaySubmitTap } from '../../templates/pay/pay'
import { getVedioLive, getVideoList, recordVedio, payVedioInit } from '../../../utils/api'
import { formatTimestamp } from '../../../utils/util'

var app = getApp()

Page({
  timer: null,
  /**
   * 页面的初始数据
   */
  data: {
    pay: {},
    options: {},
    videoList: {
      flag: true,
      data: [],
      target: 'self'
    },
    video: {
      src: '',
      controls: true,
      centerPlayBtn: false,
      initialTime: 0
    },
    startTime: '',
    endTime: '',
    payTime: '',
    payStatus: false,
    playState: false,// 播放按钮 显示/隐藏
    videoContext: '',
    canPlayVideo: true
  },
  options: null,
  // 视频试看完了
  bindVideoEnded(e) {
    // 已经支付就不在提示了
    if (this.data.payStatus) {
      return
    }
    setTimeout(() => {
      this.setData({
        playState: false,
        ['pay.switch']: true,
        ['pay.money']: this.data.options.money,
        ['pay.orderName']: this.data.options.vedioname,
        canPlayVideo: false,
        ['pay.data']: {
          startTime: this.data.startTime,
          endTime: new Date()
        }
      })
    }, 0)
  },
  bindVideoError(e) {
    console.log(e)
  },
  // 播放按钮事件
  bindPlayVideoTap(e, pause) {
    if (!this.data.canPlayVideo && !this.data.payStatus) {
      this.setData({
        playState: false,
        ['pay.switch']: true,
        ['pay.money']: this.data.options.money,
        ['pay.orderName']: this.data.options.vedioname
      }) 
      return
    }

    let videoContext = wx.createVideoContext('video')
    this.setData({
      ['video.src']: this.data.options.vedioMediaUrl || ''
    })
    if (pause) {
      this.setData({
        playState: false
      })
      return
    }

    recordVedio({
      data: {
        'userId': app.globalData.userId || wx.getStorageInfoSync('userId'),
        'vedioId': this.options.vedioid,
        'startTime': formatTimestamp(+new Date(), '-')
      },
      success() {

      }
    })
    // videoContext.requestFullScreen()
    videoContext.play()
    this.setData({
      startTime: new Date()
    })

    let self = this
    this.setData({
      playState: true
    })
    // setTimeout(() => {
    //   this.setData({
    //     playState: true
    //   })
    // }, 0)
    // setTimeout(() => {
    //   videoContext.pause()
    //   this.setData({
    //     playState: false,
    //     ['pay.switch']: true,
    //     ['pay.money']: this.data.options.money,
    //     canPlayVideo: false
    //   })
    // }, 10000)
  },
  // 播放视频时间更新
  bindVideoTimeUpdate(e) {
    if (!this.data.playState) {
      this.setData({
        playState: true
      })
    }
    this.setData({
      ['video.initialTime']: e.detail.currentTime
    })
  },
  // 视频播放监听
  bindVideoPlay: function () {
    this.setData({
      playState: true
    })
  },
  // 视频暂停监听
  bindVideoPause: function () {
    if (this.data.pay.switch) {// 非主动暂停，而是因为点了其他视频调用了支付窗口造成的暂停
      return
    }
    this.setData({
      playState: false
    })
  },
  // 视频点击函数
  bindVideoItemTap(e) {
    bindVideoItemTap(this, e, '../../video/play/play')
  },
  // 关闭支付窗口
  bindPayClose() {
    if (this.data.playState) {
      this.bindPlayVideoTap(null, false)
    } else {
      this.bindPlayVideoTap(null, true)
    }

    bindPayClose(this)
    // this.setData({
    //   ['video.src']: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
    // })
  },
  // 优惠券下拉选择 开关
  bindDiscountsSwitch(e) {
    bindDiscountsSwitch(this)
  },
  // 监听优惠选择的姿态
  bindDiscountsChange(e) {
    bindDiscountsChange(this, e)
  },
  // 支付
  bindPaySubmitTap(e) {
    bindPaySubmitTap(this, e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.vediomediaurl = decodeURIComponent(options.vediomediaurl)
    let vediomediaurlquery = wx.getStorageSync('vediomediaurlquery')
    wx.removeStorageSync('vediomediaurlquery')
    if (-1 != vediomediaurlquery.search('exper=0')) {
      this.setData({
        payStatus: true
      })
    }

    options.vediomediaurl = options.vediomediaurl + '?' + vediomediaurlquery
    this.setData({
      pay: payData,
      options
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '[' + this.options.teachernickname + '] ' + this.options.vedioname
    })
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
    this.timer = null
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
    let options = this.data.options
    return {
      title: '【原创】我是视频的title · 润教育城',
      path: `pages/video/play/play?vedioid=${options.vedioId}&money=${options.money}`
    }
  }
})