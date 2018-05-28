// pages/templates/paytohelp/paytohelp.js
import {
  payVedio, payInit, payQuery, payResult, payClose, payVedioInit, getVedioLive
} from '../../../utils/api'

Component({
  properties: {
    role: { type: String, value: 'enter' },
    event: { type: Number, value: 0, observer: function (newVal, oldVal) { this.onPush(newVal); } },
    styles: { type: Object, value: {} }
  },
  data: {
   
  },
  methods: {
    // 初始化操作
    init: function () {
      // 重置用户名，因为一开始用户名是空的
      this.setData({
        username: this.data.username
      });
      this.getPushURL();
    },
  },
  // 组件布局完成
  ready: function () {
    console.log('初始化data', this.data);
    wx.showLoading({
      title: '连接中...'
    })
    // 布局完成开始初始化
    this.init();
  },
  // 组件实例被从页面节点树移除
  detached: function () {
    // self.triggerEvent('notify', {
    //   type: 'onFail',
    //   errCode: ret.errCode,
    //   errMsg: ret.errMsg
    // }, {});
  }
})
