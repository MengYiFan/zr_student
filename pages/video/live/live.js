// pages/video/live/live.js
import { getVedioLive, rewardMe } from '../../../utils/api'
import { getRandomColor } from '../../../utils/common'
import { init, setListener, sendRoomTextMsg } from '../../../utils/wx/rtcroom'

var webimhandler = require('../../../utils/wx/webim_handler.js')

var app = getApp()
var USER_DATA = wx.getStorageSync('userData')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rewardList: [{
      orderItemDesc: '打赏',
      orderItemPrice: 6.66,
      iconUrl: '../../../images/reward/6.66.png',
    }, {
      orderItemDesc: '金币',
      orderItemPrice: 8.88,
      iconUrl: '../../../images/reward/8.88.png',
      }, {
      orderItemDesc: '元宝',
      orderItemPrice: 18.88,
      iconUrl: '../../../images/reward/18.88.png',
    }],
    showRewardListFlag: false,
    sourceId: null,
    liveData: null,
    commentshow: true,
    tapTime: 0,
    comments: [],
    muted: false,
    inputValue: '',
    vedioSrc: '',
    config: {         //cameraview对应的配置项
      aspect: '3:4',  //设置画面比例，取值为'3:4'或者'9:16'
      minBitrate: 200,//设置码率范围为[minBitrate,maxBitrate]，双人建议设置为200~600
      maxBitrate: 600,
      beauty: 5,      //美颜程度，取值为0~9
      muted: true,   //设置推流是否静音
      camera: true,   //设置前后置摄像头，true表示前置
      operate: '',    //设置操作类型，目前只有一种'stop'，表示停止
      debug: false    //是否显示log
    },   
    content: '',
  },
  options: null,
  tapTime: 0,
  bindCommentInput(e) {
    this.setData({
      inputValue: e.detail.value
    }) 
  },
  // 点击打赏事件
  bindRewardTapHandle(e) {
    let dataset = e.target.dataset,
        desc = dataset.desc,
        price = dataset.price,
        id = dataset.id,
        options = this.options,
        currentTime = +new Date()
      
    if (currentTime - this.tapTime > 1000) {
      this.tapTime = +new Date()
      console.log(this.tapTime)
      rewardMe({
        data: {
          userId: app.globalData.userId || wx.getStorageSync('userId'),
          teacherId: options.teacherUserId,
          teacherName: options.teacherName,
          orderItemObjectId: id,
          orderItemDesc: desc,
          orderItemPrice: price
        },
        success: res => {
          if (res.code == '1000') {
            wx.showToast({
              mask: true,
              title: res.msg,
              icon: 'none',
              duration: 5000
            })
          } else {
            wx.showToast({
              title: '打赏失败',
              icon: 'none',
              duration: 5000
            })
          }
        }
      })
    }
  },
  // 展示打赏列表
  showRewardListSwitchHandle(e) {
    console.log(this.data.showRewardListFlag, '@@')
    this.setData({
      showRewardListFlag: !this.data.showRewardListFlag
    })
    console.log(this.data.showRewardListFlag, '@@')
  },
  // 状态码
  playerStatechange(e) {
    console.info('live-player code:', e.detail.code)
    // if (e.detail.code == -2301) {
    //   console.info('尝试连接live')
    //   let teachPusher = this.data.teachPusher
    //   this.setData({
    //     teachPusher: ''
    //   })
    //   setTimeout(() => {
    //     this.setData({
    //       teachPusher: teachPusher
    //     })
    //   }, 0)
    // }
  },
  // 提交评论
  bindCommentConfirm(e) {
    var self = this
    var nowTime = new Date()
    if (nowTime - self.data.tapTime < 1000) {
      return
    }
    self.setData({ 'tapTime': nowTime })
    var content = e.detail.value
    // 评论为空则不发布，trim评论信息
    if (!content.replace(/^\s*|\s*$/g, '')) return
    sendRoomTextMsg({
      data: { msg: content },
      success: function (ret) {
        console.log('发送评论成功');
        wx.showToast({
          title: '发送评论成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (ret) {
        console.error('sendRoomTextMsg fail@', ret)
      }
    });
    
    // this.data.comments.unshift({
    //   name: wx.getStorageSync('userInfo').nickName,
    //   content: content
    // })
    // if (this.data.comments.length > 4) {
    //   this.data.comments.pop()
    // } 

    this.setData({
      // comments: this.data.comments,
      inputValue: ''
    })
  },
  bindMutedTap() {
    this.setData({
      muted: !this.data.muted
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    this.setData({
      sourceId: options.courseofferid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('videoLive')
    getVedioLive({
      data: {
        ownerId: app.globalData.userId || wx.getStorageSync('userId'),
        sourceId: this.data.sourceId,
        type: 1
      },
      success: res => {
        let data = res.data
        if (res.code == '1000') {
          try {
            this.setData({
              vedioSrc: data.match(/rtmp:\/\/[^,]*/ig)[0].replace('"', '')
            })
          } catch (e) { console.log(e) }
          this.setData({
            liveData: data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    init({
      success: res => {
        console.log(USER_DATA, 'init() res:', res)
      },
      data: Object.assign({}, 
        USER_DATA.imInfo, {
        userName: USER_DATA.userNickname,
        userAvatar: USER_DATA.userPortraitUrl,
        courseId: this.data.sourceId || ''
      }),
      onMsgNotify: newMsgList => {
        var newMsg, elems, msgInfo
        // console.warn('newMsgList', newMsgList)
        for (var j in newMsgList) {//遍历新消息
          newMsg = newMsgList[j]
          elems = newMsg.getElems()

          msgInfo = JSON.parse(elems[0].content.data)
          this.data.comments.unshift({
            name: msgInfo.data.nickName,
            content: elems[1].content.text
          })

          this.setData({
            comments: this.data.comments,
            inputValue: ''
          })
          webimhandler.handlderMsg(newMsg);//处理新消息
        }
      },
      cb255: msg => {
        console.warn('我收到信息啦啦啦:', msg)
        let msgArr = msg.split('||')
        if (msgArr[0] == '01') {
          this.roomId = msgArr[1]
          this.teacherUserId = msgArr[2]
          that.setData({
            teachLive: msgArr[4],
            callTeacherName: msgArr[5],
            callTeacherCover: msgArr[6]
          })
        } else {
          this.roomId = msgArr[1]
          this.caseId = msgArr[2]
          this.bindCallHangupTap(null, this.caseId, 'passivity')
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
      title: '直播',
      path: `pages/video/live/live?${obj2uri(this.options)}`
    }
  }
})