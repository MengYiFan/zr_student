// pages/help/call/call.js
import { getHelpCall, hangupHelpCall, assignTeacher, callAll, polling, enterRoom, enterRtcroom, exitRtcroom, heartbeat, getPusher, hangupApply, payCallAll } from '../../../utils/api'
import { init, setListener, sendRoomTextMsg } from '../../../utils/wx/rtcroom'
import { obj2uri } from '../../../utils/common'

// TODO
// should modify
var app = getApp()
var MAX_TRY_LOGIN_IM = 3

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraContext: {},
    teachLive: null,
    userPusher: null,
    pusherContext: {},  // 推流context
    pushURL: '',        // 推流地址
    members: [],        // 成员信息
    isInRoom: false,    // 是否已经进入房间
    //
    controler: {
      muted: false,
      enableCamera: true,
      backgroundMute: true,
      orientation: "vertical",
      beauty: 6.3,
      whiteness: 3.0,
      debug: false,
      hide: false,
      minBitrate: 100,
      maxBitrate: 200,
      aspect: '3:4'
    },
    //
    playerConf: {
      orientation: 'vertical',
      objectFit: "fillCrop",
      muted: false,
      backgroundMuted: true,
      debug: false,
      fullScreen: false,
    },
    videoContext: null,
    subjectIds: null,
    connectionFlag: false,
    canHangupFlag: false,
    //
    role: 'create',    // 表示双人会话的角色，取值'enter'表示加入者，'create'表示创建者
    roomid: '',       // 房间id
    roomname: '',     // 房间名称
    username: '',     // 用户名称
    config: {         //cameraview对应的配置项
      aspect: '3:4',  //设置画面比例，取值为'3:4'或者'9:16'
      minBitrate: 200,//设置码率范围为[minBitrate,maxBitrate]，双人建议设置为200~600
      maxBitrate: 600,
      beauty: 5,      //美颜程度，取值为0~9
      muted: false,   //设置推流是否静音
      camera: true,   //设置前后置摄像头，true表示前置
      operate: '',    //设置操作类型，目前只有一种'stop'，表示停止
      debug: false    //是否显示log
    },
    styles: {         //设置cameraview的大小
      width: '49vw',
      height: '65.33vw'
    },
    event: 0,       // 推流事件透传
    member: {},     //双人对端成员信息

    inputMsg: '',     // input信息
    comment: [],      // 评论区信息

    toview: '',     // 滚动条位置
    isShow: false,  // 是否显示页面

    callTeacherCover: null,
    callTeacherName: null,
    nick: '',
    avatar: ''
  },
  USER_DATA: {},
  TIME: 20,
  CYCLE: 5,
  caseId: null,
  isSuccessCall: false,
  isIMLoginFailFlag: false,
  teacherUserId: null,
  roomId: null,
  startTime: 0,
  options: null,
  isHangupFlag: false,
  continueHeartBeat: true,
  teachLive: '',
  userPusher: '',
  liveStatus: false,
  pusherStatus: false,
  authHangupFlag: false,
  timeoutFlag: null,
  // 挂断
  bindCallHangupTap(e, caseId, type) {
    if (!this.data.canHangupFlag) {
      wx.redirectTo({
        url: '../../../pages/help/index/help'
      })
      return
    }
    if (type != 'passivity' || !type) {// 主动发起
      let data = this.data,
        seconds = this.startTime ? (+new Date() - this.startTime) / 1000 : 0,
        reqData = {
          userId: app.globalData.userId || wx.getStorageSync('userId'),
          caseId: this.caseId,
          hangupType: 1,
          teacherUserId: this.teacherUserId || this.options.teacherUserId,
          seconds: parseInt(seconds),
          roomId: this.roomId || this.data.roomId,
          isFree: this.options.isFree || 1
        }

      hangupApply({
        data: reqData,
        complete: () => {
          this.isHangupFlag = true
        },
        success: res => {
          if (res.code == '1000' && !this.authHangupFlag) {
            wx.switchTab({
              url: '../../../pages/help/index/help'
            })
          } else {
            if (!this.isSuccessCall && !this.authHangupFlag) {
              wx.switchTab({
                url: '../../../pages/help/index/help'
              })
              return
            }
            wx.showToast({
              icon: 'none',
              title: '退出房间ERR..'
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
          }
        }
      })
      return
    } else {
      let data = this.data,
        seconds = this.startTime ? (+new Date() - this.startTime) / 1000 : 0,
        reqData = {
          userId: app.globalData.userId || wx.getStorageSync('userId'),
          caseId: this.caseId,
          hangupType: 1,
          teacherUserId: this.teacherUserId,
          seconds: parseInt(seconds),
          isFree: this.options.isFree || 1
        }

      hangupHelpCall({
        data: reqData,
        complete: () => {
          this.isHangupFlag = true
        },
        success: (res) => {
          if (res.code == '1000') {
            if (!this.data.canHangupFlag) {
              if (!this.isIMLoginFailFlag && !this.authHangupFlag) {
                wx.switchTab({
                  url: '../../../pages/help/index/help'
                })
              }
            } else {// 接通成功的话需要退出房间
              exitRtcroom({
                method: 'get',
                success: res => {
                  if (res.code == '1000') {
                    wx.showToast({
                      icon: 'none',
                      title: '退出房间..'
                    })
                    setTimeout(function () {
                      wx.hideLoading()
                    }, 2000)
                  } else {
                    wx.showToast({
                      icon: 'none',
                      title: '退出房间ERR..'
                    })
                    setTimeout(function () {
                      wx.hideLoading()
                      if (!this.isIMLoginFailFlag && !this.authHangupFlag) {
                        wx.switchTab({
                          url: '../../../pages/help/index/help'
                        })
                      }
                    }, 2000)
                  }
                }
              }, this.roomId, this.options.userId)
            }
          }
        }
      })
    }
  },
  // 静音
  bindCellMutedTap(e) {
    this.setData({
      ['controler.muted']: !this.data.controler.muted
    })
  },
  // 状态码
  playerStatechange(e) {
    if (!this.teachLive) {
      this.teachLive = this.data.teachLive
    }
    try {
      console.info('live-player code:', e.detail.code)
      console.info('teachLive:', this.teachLive)

      let statusCode = e.detail.code
      if (statusCode == 2002) {
        this.liveStatus = true
        if (this.pusherStatus) {
          this.setData({
            canHangupFlag: true
          })
          clearTimeout(this.timeoutFlag)
          this.startTime = +new Date()
        }
      }

      // if (statusCode == -2301 || statusCode == -2302) {
      //   console.log('尝试拉流live: ', statusCode)
      //   this.setData({
      //     teachLive: ''
      //   })
      //   setTimeout(() => {
      //     this.setData({
      //       teachLive: this.teachLive
      //     })
      //   }, 2000)
      // }
    } catch (error) {
      console.log('playerStatechange error', error)
    }
  },
  playerError(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  pusherStatechange(e) {
    console.info('live-pusher code:', e.detail.code)
    
    if (!this.userPusher) {
      this.userPusher = this.data.userPusher
    }

    try {
      console.info('live-pusher code:', e.detail && e.detail.code || 'null')
      console.info('pusher: ', this.data.userPusher)
      if (e.detail.code == 1002) {
        this.pusherStatus = true
        if (this.liveStatus) {
          this.setData({
            canHangupFlag: true
          })
          clearTimeout(this.timeoutFlag)
          this.startTime = +new Date()
        }
      }
      // if (e.detail.code == -1307) {
      //   console.log('尝试推流pusher', e.detail.code)
      //   this.setData({
      //     userPusher: ''
      //   })
      //   setTimeout(() => {
      //     this.setData({
      //       userPusher: this.userPusher
      //     })
      //   }, 2000)
      // }
    } catch (error) {
      console.log('尝试推流pusher err', error)
    }
  },
  // V2 讯轮接听状态
  // pollingHandle() {
  //   polling({
  //     method: 'get',
  //     success: res => {
  //       if (res.code == '1000') {
  //         wx.showToast({
  //           title: '接通成功..'
  //         })
  //         setTimeout(function () {
  //           wx.hideLoading()
  //         }, 2000)
  //         this.startTime = +new Date()
  //         this.roomId = res.data.roomId
  //         this.teacherUserId = this.roomId.split('_')[1]
  //         this.enterRoom()
  //       } else {
  //         // 还没人接通
  //         if (res.msg == '-3') {
  //           console.log('polling:', this.TIME)
  //           if (this.TIME <= 0) {
  //             wx.showToast({
  //               icon: 'none',
  //               title: '没人接通，请稍后再试..'
  //             })
  //             setTimeout(function () {
  //               wx.hideLoading()
  //             }, 5000)
  //           } else {
  //             setTimeout(() => {
  //               this.pollingHandle()
  //               this.TIME--
  //             }, 1000 * this.CYCLE)
  //           }
  //         } else {// 参数出意外
  //           wx.showToast({
  //             icon: 'none',
  //             title: '后台繁忙..'
  //           })
  //           setTimeout(function () {
  //             wx.hideLoading()
  //           }, 3000)
  //         }
  //       }
  //     }
  //   }, this.caseId, this.options.userId)
  // },
  // V3
  // type @ call/one
  getPusherHandle(type) {
    getPusher({
      method: 'get',
      success: res => {
        if (res.code == '1000') {
          this.setData({
            userPusher: res.msg
          })
          this.data.cameraContext.start()
          if (type == 'all') {
            this.callAllHandle()
          } else {
            this.callOneHandle()
          }
          this.isSuccessCall = true
        } else {
          this.isSuccessCall = false
        }
      }
    }, app.globalData.userId || wx.getStorageSync('userId'))
  },
  // 进入房间
  // enterRoom() {
  //   enterRoom({
  //     method: 'get',
  //     success: res => {
  //       if (res.code == '1000') {
  //         // 进入rtc房间
  //         enterRtcroom({
  //           method: 'get',
  //           success: res => {
  //             console.log('enterRtcroom success:', res)
  //             let pushUri = '', liveUri = '', responseData = res.data
  //             if (responseData[0].userId == this.options.userId) {
  //               this.setData({
  //                 canHangupFlag: true,
  //                 teachLive: res.data[1].accelerateURL.split('?')[0].replace('rtmp', 'http'),
  //                 userPusher: res.data[0].pushURL
  //               })
  //             } else {
  //               this.setData({
  //                 canHangupFlag: true,
  //                 teachLive: res.data[0].accelerateURL.split('?')[0].replace('rtmp', 'http'),
  //                 userPusher: res.data[1].pushURL
  //               })
  //             }

  //             this.heartbeat()
  //           }
  //         }, this.roomId)
  //       } else {
  //         wx.showToast({
  //           icon: 'none',
  //           title: '进入房间E..'
  //         })
  //         setTimeout(function () {
  //           wx.hideLoading()
  //         }, 2000)
  //       }
  //     }
  //   }, this.roomId, this.options.userId)
  // },
  // 心跳函数
  heartbeat() {
    heartbeat({
      method: 'get',
      closeLoading: 'hidden',
      success: res => {
        if (res.code == '1000') {
          if (this.continueHeartBeat) {
            setTimeout(() => {
              this.heartbeat()
            }, 1000 * this.CYCLE)
          }
        } else {
          this.setData({
            teachLive: null,
            userPusher: null,
            canHangupFlag: false
          })
        }
      }
    }, this.roomId, this.options.userId)
  },
  // onPush: function (e) {
  //   var self = this;
  //   if (!self.data.pusherContext) {
  //     self.data.pusherContext = wx.createLivePusherContext('camera-push');
  //   }
  //   var code;
  //   if (e.detail) {
  //     code = e.detail.code;
  //   } else {
  //     code = e;
  //   }
  //   console.log('推流情况：', code);
  //   switch (code) {
  //     case 1002: {
  //       if (!self.data.isInRoom) {
  //         self.setData({ isInRoom: true });
  //         if (self.data.role == 'enter') {
  //           self.joinPusher();
  //         } else {
  //           self.createRoom();
  //         }
  //       }
  //       break;
  //     }
  //     case -1301: {
  //       console.log('打开摄像头失败: ', code);
  //       // 触发外部事件
  //       self.triggerEvent('notify', {
  //         type: 'onFail',
  //         errCode: -9,
  //         errMsg: '打开摄像头失败'
  //       }, {});
  //       break;
  //     }
  //     case -1302: {
  //       console.log('打开麦克风失败: ', code);
  //       // 触发外部事件
  //       self.triggerEvent('notify', {
  //         type: 'onFail',
  //         errCode: -9,
  //         errMsg: '打开麦克风失败'
  //       }, {});
  //       break;
  //     }
  //     case -1307: {
  //       console.log('推流连接断开: ', code);
  //       // 推流连接断开就做退房操作
  //       this.exitRoom();
  //       // 触发外部事件
  //       self.triggerEvent('notify', {
  //         type: 'onFail',
  //         errCode: -9,
  //         errMsg: '推流连接断开'
  //       }, {});
  //       break;
  //     }
  //     default: {
  //       // console.log('推流情况：', code);
  //     }
  //   }
  // },
  // 求助单发
  callOneHandle() {
    assignTeacher({
      data: {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
        teacherUserId: this.options.teacherUserId,
        pushUrl: this.data.userPusher
      },
      success: res => {
        if (res.code == '1000') {
          let data = res.data
          this.caseId = data.caseId
          // this.startTime = +(new Date())
          this.setData({
            callTeacherName: data.teacherNick,
            callTeacherCover: data.teacherAvatar,
            connectionFlag: true,
            teachLive: data.teacherPlayer,
            roomId: data.roomId
          })
          wx.vibrateLong()
          this.data.videoContext.play()
          this.isSuccessCall = true
        } else {
          this.isSuccessCall = false
        }
      }
    })
  },
  // 求助群发
  callAllHandle() {
    let options = this.options,
      params = Object.assign(options, {
        pushUrl: this.data.userPusher
      })

    if (options.isFree == 2) {// 付费
      payCallAll({
        data: params,
        success: res => {
          if (res.code == '1000') {
            this.caseId = res.data.caseId
            // this.startTime = +(new Date())
            this.roomId = res.data.roomId

            this.isSuccessCall = true
          } else if (options.isFree && res.code == '1200' && res.msg == '7') {
            this.isSuccessCall = false

            wx.showModal({
              title: '提示',
              content: '钱包余额不足，请您先充值。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../../../pages/self/wallet/wallet?type=paycall&' + obj2uri(options)
                  })
                }
              }
            })
          } else {
            this.errorHandle(res.code, res.msg)
          }
        }
      })
    } else {
      callAll({
        data: params,
        success: res => {
          if (res.code == '1000') {
            this.caseId = res.data.caseId
            // this.startTime = +(new Date())
            this.roomId = res.data.roomId

            this.isSuccessCall = true
          } else {
            this.errorHandle(res.code, res.msg)
            this.isSuccessCall = false
          }
        }
      })
    }
  },
  loginIMFailCb() {
    if (MAX_TRY_LOGIN_IM) {
      this.loginIM(this.USER_DATA.imInfo, this.loginIMFailCb)
      MAX_TRY_LOGIN_IM--
    } else {
      console.error('IM 尝试登录三次均失败')
      this.isIMLoginFailFlag = true
      
      this.authHangupFlag = true
      wx.showModal({
        title: '提示',
        content: '需要先授权基础信息才能操作...',
        showCancel: false,
        success(res) {
          wx.redirectTo({
            url: `../../../pages/wx/authorize/authorize`,
          })
        }
      })
    }
  },
  loginIM(data, failFn) {
    let that = this
    init({
      success: res => {
        // im登录成功后，看求助链接
        this.timeoutFlag = setTimeout(() => {
          wx.showToast({
            icon: 'none', 
            duration: 300,
            mask: true,
            title: '暂无老师接听，请稍后重试。'
          })
          setTimeout(() => {
            wx.hideToast()
            wx.redirectTo({
              url: '../../../pages/help/index/help'
            })
          }, 500)
        }, 1000 * 60)
        if (this.options.callObject == 'all') {
          // v3
          this.getPusherHandle('all')

          return
        }
        this.getPusherHandle('one')
      },
      data: data,
      fail: failFn,
      cb255: msg => {
        console.warn('我收到信息啦啦啦:', msg)
        let msgArr = msg.split('||')

        if (msgArr[0] == '01') {
          this.roomId = msgArr[1]
          this.teacherUserId = msgArr[2]
          that.setData({
            teachLive: msgArr[4],
            callTeacherName: msgArr[5],
            callTeacherCover: msgArr[6],
            canHangupFlag: true
          })
          wx.vibrateLong()
          that.data.videoContext.play()
        } else {
          this.roomId = msgArr[1]
          this.caseId = msgArr[2]
          this.bindCallHangupTap(null, this.caseId, 'passivity')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3c3c3c',
      animation: {
        duration: 800,
        timingFunc: 'linear'
      }
    })
  },
  errorHandle(code, msg) {
    this.isSuccessCall = false
    let title = '服务器暂忙, 请稍后重试。'
    if (code == '1200' && msg == '3') {
      title = '暂无老师在线, 请稍后重试。'
    }
    wx.showToast({
      icon: 'none', title
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {  
    this.setData({
      cameraContext: wx.createLivePusherContext('camera-push'),
      videoContext: wx.createLivePlayerContext("video-livePlayer")
    })

    wx.setKeepScreenOn({
      keepScreenOn: true,
    })

    // this.setData({
    //   pushUrl: "rtmp://20200.livepush.myqcloud.com/live/20200_2454?bizid=20200&txSecret=74effd3da27b26dc92a3c14ff40fa55f&txTime=5B669502"
    // })
    // this.data.cameraContext.start()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.USER_DATA = wx.getStorageSync('userData') || {}
    this.TIME = (this.USER_DATA.imInfo && this.USER_DATA.imInfo.time) || 20
    this.CYCLE = (this.USER_DATA.imInfo && this.USER_DATA.imInfo.cycle) || 5
  
    this.loginIM(this.USER_DATA.imInfo || {}, this.loginIMFailCb)
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
    if (!this.isHangupFlag)
      this.bindCallHangupTap(null, null, 'initiative')

    this.continueHeartBeat = false

    wx.setKeepScreenOn({
      keepScreenOn: false,
    })

    this.data.cameraContext.stop()
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

  }
})