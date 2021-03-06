/**
 * 获取登录信息
 */
var rtcroom = require('./utils/rtcroom.js');
var liveroom = require('./utils/liveroom.js');
var config = require('./config.js');

// 获取微信登录信息，用于获取openid
function getLoginInfo(options) {
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log('获取code成功',res.code);
        options.code = res.code;
        // 获取用户信息
        wx.getUserInfo({
          withCredentials: false,
          success: function (ret) {
            options.userName = ret.userInfo.nickName;
            proto_getLoginInfo(options);
          },
          fail: function() {
            proto_getLoginInfo(options);
          }
        });
      } else {
        console.log('获取用户登录态失败！' + res.errMsg);
        options.fail && options.fail({
          errCode: -1,
          errMsg: '获取用户登录态失败，请退出重试'
        });
      }
    },
    fail: function () {
      console.log('获取用户登录态失败！' + res.errMsg);
      if (ret.errMsg == 'request:fail timeout') {
        var errCode = -1;
        var errMsg = '网络请求超时，请检查网络设置';
      }
      options.fail && options.fail({
        errCode: errCode || -1,
        errMsg: errMsg || '获取用户登录态失败，请退出重试'
      });
    }
  });
}

// 调用后台获取登录信息接口
function proto_getLoginInfo(options) {
  wx.request({
    url: config.url + '/weapp/' + options.type + '/get_im_login_info',
    data: { userIDPrefix: 'weixin', code: options.code },
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (ret) {
      if (ret.data.code) {
        console.log('获取登录信息失败，如果您是在调试，请开启小程序的调试模式');
        options.fail && options.fail({
          errCode: ret.data.code,
          errMsg: ret.data.message + '[' + ret.data.code + ']'
        });
        return;
      }
      console.log('获取IM登录信息成功: ', ret.data);
      ret.data.serverDomain = config.url + '/weapp/' + options.type + '/';
      ret.data.userName = options.userName;
      switch (options.type) {
        case 'multi_room': {
          rtcroom.init({
            data: ret.data,
            success: options.success,
            fail: options.fail
          });
          break;
        }
        case 'double_room': {
          rtcroom.init({
            data: ret.data,
            success: options.success,
            fail: options.fail
          });
          break;
        }
        case 'live_room': {
          liveroom.init({
            data: ret.data,
            success: options.success,
            fail: options.fail
          });
          break;
        }
      }
    },
    fail: function (ret) {
      console.log('获取IM登录信息失败: ', ret);
      if (ret.errMsg == 'request:fail timeout') {
        var errCode = -1;
        var errMsg = '网络请求超时，请检查网络设置';
      }
      options.fail && options.fail({
        errCode: errCode || -1,
        errMsg: errMsg || '获取登录信息失败，如果您是在调试，请点击右上角三个点按钮，选择打开调试'
      });
    }
  });
}

module.exports = {
  getLoginInfo: getLoginInfo
};