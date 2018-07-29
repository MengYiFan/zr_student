// pages/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing: false,
    videoContext: {},

    fullScreen: false,
    playUrl: "rtmp://20200.liveplay.myqcloud.com/live/20200_2456",
    orientation: "vertical",
    objectFit: "contain",
    muted: false,
    backgroundMuted: false,
    debug: false,



    ////
    focus: false,
    playing: false,
    frontCamera: true,
    cameraContext: {},
    pushUrl: "rtmp://20200.livepush.myqcloud.com/live/20200_2454?bizid=20200&txSecret=74effd3da27b26dc92a3c14ff40fa55f&txTime=5B669502",
    mode: "HD",
    muted: false,
    enableCamera: true,
    orientation: "vertical",
    beauty: 6.3,
    whiteness: 3.0,
    backgroundMute: false,
    hide: false,
    debug: false
  },

  onInputTap: function () {
    this.setData({
      focus: true
    })
  },

  // input框内容同步到js
  onInputChange: function (e) {
    this.setData({
      pushUrl: e.detail.value
    })
  },

  onScanQR: function () {

    this.stop();
    console.log("onScaneQR");
    var self = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        self.setData({
          pushUrl: res.result,
        })
      }
    })
  },

  onNewUrlClick: function () {
    var self = this;

    wx.request({
      url: 'https://lvb.qcloud.com/weapp/utils/get_test_pushurl',
      success: (res) => {
        // if (res.data.returnValue != 0) {
        //   wx.showToast({
        //     title: '获取推流地址失败',
        //   })
        //   return;
        // }

        var pushUrl = res.data['url_push'];
        var rtmpUrl = res.data['url_play_rtmp'];
        var flvUrl = res.data['url_play_flv'];
        var hlsUrl = res.data['url_play_hls'];
        var accUrl = res.data['url_play_acc'];
        console.log(pushUrl);
        self.setData({
          pushUrl: pushUrl
        })

        wx.setClipboardData({
          data: "rtmp播放地址:" + rtmpUrl + "\nflv播放地址:" + flvUrl + "\nhls播放地址:" + hlsUrl + "\n低延时播放地址:" + accUrl,
        })

        wx.showToast({
          title: '获取地址成功',
        })
        setTimeout(function () {
          wx.showToast({
            title: '播放地址在剪贴板',
            duration: 2000
          })
        }, 1000)

      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: '网络或服务器异常',
        })
      }
    })
  },

  onPushClick: function () {
    // this.data.pusherConfig.debug = !this.data.pusherConfig.debug;
    console.log("onPushClick", this.data);
    if (this.data.pushUrl.indexOf("rtmp://") != 0) {
      wx.showModal({
        title: '提示',
        content: '推流地址不合法，请点击右上角New按钮获取推流地址',
        showCancel: false
      });
      return;
    }
    this.setData({
      playing: !this.data.playing,
    })
    if (this.data.playing) {
      this.data.cameraContext.start();
      console.log("camera start");
    } else {
      this.data.cameraContext.stop();
      console.log("camera stop");
    }
  },

  onSwitchCameraClick: function () {
    this.data.frontCamera = !this.data.frontCamera;
    this.setData({
      frontCamera: this.data.frontCamera
    })
    this.data.cameraContext.switchCamera();
  },

  onBeautyClick: function () {
    if (this.data.beauty != 0) {
      this.data.beauty = 0;
      this.data.whiteness = 0;
    } else {
      this.data.beauty = 6.3;
      this.data.whiteness = 3.0;
    }

    this.setData({
      beauty: this.data.beauty,
      whiteness: this.data.whiteness
    })
  },

  onOrientationClick: function () {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }
    this.setData({
      orientation: this.data.orientation
    })
  },

  onLogClick: function () {
    this.setData({
      debug: !this.data.debug
    })
  },

  onModeClick: function () {
    if (this.data.mode == "SD") {
      this.data.mode = "HD";
    }
    else if (this.data.mode == "HD") {
      this.data.mode = "FHD";
    }
    else if (this.data.mode == "FHD") {
      this.data.mode = "SD";
    }
    wx.showToast({
      title: this.data.mode,
    })
    this.setData({
      mode: this.data.mode
    })
  },

  onEnableCameraClick: function () {
    this.setData({
      enableCamera: !this.data.enableCamera
    })
    if (this.data.playing) {
      this.data.cameraContext.stop();
      setTimeout(() => {
        this.data.cameraContext.start();
      }, 500)
    }
  },

  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },

  onPushEvent: function (e) {
    console.log(e.detail.code);

    if (e.detail.code == -1307) {
      this.stop();
      wx.showToast({
        title: '推流多次失败',
      })
    }
  },

  stop: function () {
    this.setData({
      playing: false,
      //pushUrl: "rtmp://2157.livepush.myqcloud.com/live/2157_wx_live_test1?bizid=2157&txSecret=7b0391fa4d9956a54d1a8238bc358372&txTime=5A071E7F",
      mode: "HD",
      muted: false,
      enableCamera: true,
      orientation: "vertical",
      beauty: 0,
      whiteness: 0,
      backgroundMute: false,
      debug: false
    })
    this.data.cameraContext.stop();
  },

  ////////

  onScanQR: function () {
    this.stop();
    this.createContext();
    console.log("onScaneQR");
    var self = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        self.setData({
          playUrl: res.result
        })
      }
    })
  },

  onBlur: function (e) {
    this.setData({
      playUrl: e.detail.value
    })
  },

  onPlayClick: function () {

    var url = this.data.playUrl;
    if (url.indexOf("rtmp:") == 0) {
    } else if (url.indexOf("https:") == 0 || url.indexOf("http:") == 0) {
      if (url.indexOf(".flv") != -1) {
      }
    } else {
      wx.showToast({
        title: '播放地址不合法，目前仅支持rtmp,flv方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.videoContext.play();
      console.log("video play()");
      wx.showLoading({
        title: '',
      })
    } else {
      this.data.videoContext.stop();
      console.log("video stop()");
      wx.hideLoading();
    }
  },

  onOrientationClick: function () {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }

    this.setData({
      orientation: this.data.orientation
    })
  },

  onObjectfitClick: function () {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function () {
    this.setData({
      debug: !this.data.debug
    })
  },

  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },

  onFullScreenClick: function () {

    if (!this.data.fullScreen) {
      this.data.videoContext.requestFullScreen({
        direction: 0,

      })

    } else {
      this.data.videoContext.exitFullScreen({

      })
    }
  },

  onPlayEvent: function (e) {
    console.log(e.detail.code);
    if (e.detail.code == -2301) {
      this.stop();
      wx.showToast({
        title: '拉流多次失败',
      })
    }
    if (e.detail.code == 2004) {
      wx.hideLoading();
    }
  },

  onFullScreenChange: function (e) {
    this.setData({
      fullScreen: e.detail.fullScreen
    })
    console.log(e);
    wx.showToast({
      title: this.data.fullScreen ? '全屏' : '退出全屏',
    })
  },

  stop: function () {
    this.setData({
      playing: false,
      // playUrl: "rtmp://2157.liveplay.myqcloud.com/live/2157_wx_live_test1",
      orientation: "vertical",
      objectFit: "contain",
      muted: false,
      fullScreen: false,
      backgroundMuted: false,
      debug: false,
    })
    this.data.videoContext.stop();
    wx.hideLoading();
  },

  createContext: function () {
    this.setData({
      videoContext: wx.createLivePlayerContext("video-livePlayer")
    })
    this.setData({
      cameraContext: wx.createLivePusherContext('camera-push')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.createContext();
    console.log(this.data.videoContext);

    wx.setKeepScreenOn({
      keepScreenOn: true,
    })

    this.setData({
      pushUrl: "rtmp://20200.livepush.myqcloud.com/live/20200_2454?bizid=20200&txSecret=74effd3da27b26dc92a3c14ff40fa55f&txTime=5B669502"
    })
    this.data.cameraContext.start()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
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
    this.stop();

    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
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
      title: '直播播放器',
      path: '/pages/play/play',
      imageUrl: '../Resources/share.png'
    }
  }
})