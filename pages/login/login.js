const app = getApp();
import { login, getUserProfile, getPhoneNumber } from '../../utils/auth.js';
import { showToast, showLoading, hideLoading } from '../../utils/util.js';

Page({
  data: {
    statusBarHeight: 0,
    userInfo: null,
    hasUserInfo: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
  },

  onGetUserProfile(e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    }
  },

  async onGetPhoneNumber(e) {
    if (!this.data.hasUserInfo) {
      showToast('请先授权用户信息');
      return;
    }

    try {
      showLoading('登录中...');
      const code = await login();
      
      setTimeout(() => {
        hideLoading();
        
        const mockUser = {
          id: 'user_' + Date.now(),
          nickName: this.data.userInfo.nickName,
          avatarUrl: this.data.userInfo.avatarUrl,
          phone: e.detail.code ? '138****8888' : '',
          isAuth: false,
          isDriverVerified: false
        };

        app.setUserInfo(mockUser);
        app.setToken('mock_token_' + Date.now());

        showToast('登录成功', 'success');
        
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      }, 1000);
    } catch (err) {
      hideLoading();
      showToast('登录失败，请重试');
      console.error('登录失败', err);
    }
  },

  goBack() {
    wx.navigateBack();
  },

  goPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们非常重视您的个人信息保护，将按照法律法规要求，采取相应安全保护措施，尽力保护您的个人信息安全。',
      showCancel: false
    });
  },

  goAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '欢迎使用租车小程序。在使用本服务前，请您仔细阅读并理解本协议的全部内容。',
      showCancel: false
    });
  }
});
