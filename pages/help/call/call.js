// pages/help/call/call.js
import { getHelpCall, hangupHelpCall, assignTeacher, callAll, polling, enterRoom, enterRtcroom, exitRtcroom, heartbeat, getPusher, hangupApply } from '../../../utils/api'
import { init, setListener, sendRoomTextMsg } from '../../../utils/wx/rtcroom'

var app = getApp()
var intervalId = null
var USER_DATA
var time
var CYCLE
try {
  USER_DATA = wx.getStorageSync('userData')
  time = (USER_DATA.imInfo && USER_DATA.imInfo.time) || 20
  CYCLE = (USER_DATA.imInfo && USER_DATA.imInfo.cycle) || 5
} catch(e) {
  time = 20
  CYCLE = 5
}

//DEBUG
//second 没有做记录
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teachLive: null,
    userPusher: null,
    pusherContext: '',  // 推流context
    pushURL: '',        // 推流地址
    members: [],        // 成员信息
    isInRoom: false,    // 是否已经进入房间
    //
    controler: {
      muted: false,
      enableCamera: false
    },
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
  caseId: null,
  teacherUserId: null,
  roomId: null,
  startTime: 0,
  options: null,
  isHangupFlag: false,
  continueHeartBeat: true,
  // 挂断
  bindCallHangupTap(e, caseId, type) {
    if (type != 'passivity' || !type) {// 主动发起
      let data = this.data,
        seconds = this.startTime ? (+new Date() - this.startTime) / 1000 : 0,
        reqData = {
          userId: app.globalData.userId || wx.getStorageSync('userId'),
          caseId: this.caseId,
          hangupType: 1,
          teacherUserId: this.teacherUserId || this.options.teacherUserId,
          seconds: parseInt(seconds),
          roomId: this.roomId || this.data.roomId
        }

      hangupApply({
        data: reqData,
        complete: () => {
          this.isHangupFlag = true
        },
        success: res => {
          if (res.code == '1000') {
            wx.switchTab({
              url: '../../../pages/help/index/help'
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '退出房间失败..'
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
          seconds: parseInt(seconds)
        }

      hangupHelpCall({
        data: reqData,
        complete: () => {
          this.isHangupFlag = true
        },
        success: (res) => {
          if (res.code == '1000') {
            if (!this.data.canHangupFlag) {
              wx.switchTab({
                url: '../../../pages/help/index/help'
              })
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
                      title: '退出房间失败..'
                    })
                    setTimeout(function () {
                      wx.hideLoading()
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
    try {
      console.log('live-player code:', e.detail.code)
      if (e.detail.code == -2302 || e.detail.code == -2301) {
        console.log('尝试连接live')
        let teachLive = this.data.teachLive
        this.setData({
          teachLive: ''
        })
        setTimeout(() => {
          this.setData({
            teachLive: teachLive
          })
        }, 5000)
      }
    } catch(e) {
      console.log('playerStatechange error', e)
    }
  },
  playerError(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  pusherStatechange(e) {
    try {
      console.log('live-pusher code:', e.detail && e.detail.code || 'null')
      if (e.detail.code < 0) {
        console.log('尝试推流pusher', e.detail.code)
        let userPusher = this.data.userPusher
        this.setData({
          userPusher: ''
        })
        setTimeout(() => {
          this.setData({
            userPusher: userPusher
          })
        }, 5000)
      }
    } catch(e) {
      console.log('尝试推流pusher err', e)
    }
  },
  // V2 讯轮接听状态
  pollingHandle() {
    polling({
      method: 'get',
      success: res => {
        if (res.code == '1000') {
          wx.showToast({
            title: '接通成功..'
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          this.startTime = +new Date()
          this.roomId = res.data.roomId
          this.teacherUserId = this.roomId.split('_')[1]
          this.enterRoom()
        } else {
          // 还没人接通
          if (res.msg == '-3') {
            console.log('polling:', time)
            if (time <= 0) {
              wx.showToast({
                icon: 'none',
                title: '没人接通，请稍后再试..'
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 5000)
            } else {
              setTimeout(() => {
                this.pollingHandle()
                time--
              }, 1000 * CYCLE)
            }
          } else {// 参数出意外
            wx.showToast({
              icon: 'none',
              title: '后台繁忙..'
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
          }
        }
      }
    }, this.caseId, this.options.userId)
  },
  // V3
  getPusherHandle(type) {
    getPusher({
      method: 'get',
      success: res => {
        console.log('getPusherHandle:', res, '@type@', type)
        if (res.code == '1000') {
          this.setData({
            userPusher: res.msg
          })
          if (type == 'all') {
            this.callAllHandle()
          } else {
            this.callOneHandle()
          }
        } else {

        }
      }
    }, app.globalData.userId || wx.getStorageSync('userId'))
  },
  // 进入房间
  enterRoom() {
    enterRoom({
      method: 'get',
      success: res => {
        if (res.code == '1000') {
          // 进入rtc房间
          enterRtcroom({
            method: 'get',
            success: res => {
              console.log('enterRtcroom success:', res)
              let pushUri = '', liveUri = '', responseData = res.data
              if (responseData[0].userId == this.options.userId) {
                this.setData({
                  canHangupFlag: true,
                  teachLive: res.data[1].accelerateURL.split('?')[0].replace('rtmp', 'http'),
                  userPusher: res.data[0].pushURL
                })
              } else {
                this.setData({
                  canHangupFlag: true,
                  teachLive: res.data[0].accelerateURL.split('?')[0].replace('rtmp', 'http'),
                  userPusher: res.data[1].pushURL
                })
              }
              
              this.heartbeat()
            }
          }, this.roomId)
        } else {
          wx.showToast({
            icon: 'none',
            title: '进入房间失败..'
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }
      }
    }, this.roomId, this.options.userId)
  },
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
            }, 1000 * CYCLE)
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
  onPush: function (e) {
    var self = this;
    if (!self.data.pusherContext) {
      self.data.pusherContext = wx.createLivePusherContext('rtcpusher');
    }
    var code;
    if (e.detail) {
      code = e.detail.code;
    } else {
      code = e;
    }
    console.log('推流情况：', code);
    switch (code) {
      case 1002: {
        if (!self.data.isInRoom) {
          self.setData({ isInRoom: true });
          if (self.data.role == 'enter') {
            self.joinPusher();
          } else {
            self.createRoom();
          }
        }
        break;
      }
      case -1301: {
        console.log('打开摄像头失败: ', code);
        // 触发外部事件
        self.triggerEvent('notify', {
          type: 'onFail',
          errCode: -9,
          errMsg: '打开摄像头失败'
        }, {});
        break;
      }
      case -1302: {
        console.log('打开麦克风失败: ', code);
        // 触发外部事件
        self.triggerEvent('notify', {
          type: 'onFail',
          errCode: -9,
          errMsg: '打开麦克风失败'
        }, {});
        break;
      }
      case -1307: {
        console.log('推流连接断开: ', code);
        // 推流连接断开就做退房操作
        this.exitRoom();
        // 触发外部事件
        self.triggerEvent('notify', {
          type: 'onFail',
          errCode: -9,
          errMsg: '推流连接断开'
        }, {});
        break;
      }
      default: {
        // console.log('推流情况：', code);
      }
    }
  },
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
          this.startTime = +(new Date())
          this.setData({
            callTeacherName: data.teacherNick,
            callTeacherCover: data.teacherAvatar,
            connectionFlag: true,
            teachLive: data.teacherPlayer,
            roomId: data.roomId
          })
        }
      }
    })
  },
  // 求助群发
  callAllHandle() {
    let options = this.options
    callAll({
      data: Object.assign(options, {
        pushUrl: this.data.userPusher
      }),
      success: res => {
        console.log('callAll response: ', res)
        if (res.code == '1000') {
          this.caseId = res.data.caseId
          this.startTime = +(new Date())
          this.roomId = res.data.roomId
          // V2
          // this.pollingHandle()

          // V1
          // var data = res.data
          // let fa = data.userPusher.replace(/[\'\"]/g, '').split('|')[0].trim(),
          //   shou = data.teachLive.replace(/[\'\"]/g, '').split('|')[1].split(',')[0].slice(6).replace('}', '').trim()

          // this.setData({
          //   subjectIds: this.caseId,
          //   canHangupFlag: true,
          //   teachLive: shou,
          //   userPusher: fa
          // })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.warn('options:', options)
    this.options = options
    let that = this
    time = USER_DATA.imInfo.time
    init({
      success: res => {
        if (options.callObject == 'all') {
          // v3
          this.getPusherHandle('all')

          return
        }

        this.getPusherHandle('one')

        // assignTeacher({
        //   data: {
        //     'userId': app.globalData.userId,
        //     'teacherUserId': options.teacherUserId
        //   },
        //   success: res => {
        //     if (res.code == '1000') {
        //       var data = res.data,
        //         reg = new RegExp('http:\/\/.+\.flv', 'gi'),
        //         reg2 = new RegExp('http:\/\/.+\.flv', 'gi')

        //       // this.setData({
        //       //   subjectIds: this.caseId,
        //       //   canHangupFlag: true,
        //       //   teachLive: reg.exec(data.teachLive)[0],
        //       //   userPusher: reg2.exec(data.userPusher)[0]
        //       // })
        //       // let fa = data.teachLive.replace(/[\'\"]/g, '').split('|')[0],
        //       //   shou = data.userPusher.replace(/[\'\"]/g, '').split('|')[1].split(',')[0].slice(5).replace('}', '')

        //       let fa = data.userPusher.replace(/[\'\"]/g, '').split('|')[0].trim(),
        //         shou = data.teachLive.replace(/[\'\"]/g, '').split('|')[1].split(',')[0].slice(6).replace('}', '').trim()

        //       this.setData({
        //         subjectIds: data.caseId,
        //         canHangupFlag: true,
        //         teachLive: shou,
        //         userPusher: fa
        //       })
        //     }
        //   }
        // })
      },
      data: USER_DATA.imInfo,
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
          console.log('claose!!!!')
          this.bindCallHangupTap(null, this.caseId, 'passivity')
        }
      }
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3c3c3c',
      animation: {
        duration: 800,
        timingFunc: 'linear'
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
    if (!this.isHangupFlag)
      this.bindCallHangupTap(null, null, 'initiative')
    
    this.continueHeartBeat = false
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