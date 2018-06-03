// pages/templates/paytohelp/paytohelp.js

Component({
  properties: {
    event: { type: Number, value: 0, observer: function (newVal, oldVal) { this.onPush(newVal); } },
    styles: { type: Object, value: {} }
  },
  data: {
   
  },
  methods: {
    // 初始化操作
    bindPayToHelpHandle: function () {
      wx.navigateTo({
        url: '../../../pages/help/pay/pay',
      })
    },
  },
  // 组件布局完成
  ready: function () {
    console.log('初始化data', this.data);
    
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
