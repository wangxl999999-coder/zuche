const app = getApp();
import { showModal, makePhoneCall } from '../../utils/util.js';

Page({
  data: {
    userInfo: null,
    isLogin: false,
    isAuth: false,
    isDriverVerified: false,
    couponCount: 3,
    menuItems: [
      {
        group: '我的订单',
        items: [
          { icon: '📋', name: '全部订单', path: '/pages/orders/orders' },
          { icon: '💳', name: '待支付', path: '/pages/orders/orders?tab=1' },
          { icon: '🚗', name: '待取车', path: '/pages/orders/orders?tab=2' },
          { icon: '⭐', name: '待评价', path: '/pages/orders/orders?tab=4' }
        ]
      },
      {
        group: '认证服务',
        items: [
          { icon: '🆔', name: '实名认证', path: '/pages/auth/auth', needAuth: false },
          { icon: '📄', name: '驾驶证认证', path: '/pages/driver-license/driver-license', needAuth: true }
        ]
      },
      {
        group: '我的服务',
        items: [
          { icon: '🎫', name: '我的卡券', path: '/pages/coupons/coupons' },
          { icon: '🔧', name: '故障报修', path: '/pages/repair/repair' },
          { icon: '💬', name: '联系客服', path: '/pages/customer-service/customer-service' },
          { icon: '🎁', name: '邀请有礼', path: '/pages/invite/invite' }
        ]
      },
      {
        group: '更多',
        items: [
          { icon: '⚙️', name: '个人资料', path: '/pages/profile-edit/profile-edit' },
          { icon: '📜', name: '用户协议', path: '' },
          { icon: '🔒', name: '隐私政策', path: '' }
        ]
      }
    ]
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    const isAuth = app.globalData.isAuth;
    const isDriverVerified = app.globalData.isDriverVerified;
    
    this.setData({
      userInfo,
      isLogin: !!userInfo,
      isAuth,
      isDriverVerified
    });
  },

  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  goEditProfile() {
    if (!this.data.isLogin) {
      this.goLogin();
      return;
    }
    wx.navigateTo({
      url: '/pages/profile-edit/profile-edit'
    });
  },

  goPage(e) {
    const { path, needauth } = e.currentTarget.dataset;
    
    if (!path) {
      wx.showToast({
        title: '功能开发中',
        icon: 'none'
      });
      return;
    }

    if (!this.data.isLogin) {
      this.goLogin();
      return;
    }

    if (needauth && !this.data.isAuth) {
      wx.showModal({
        title: '提示',
        content: '请先完成实名认证',
        confirmText: '去认证',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth'
            });
          }
        }
      });
      return;
    }

    wx.navigateTo({ url: path });
  },

  callService() {
    makePhoneCall('400-888-8888');
  },

  async logout() {
    const confirmed = await showModal('退出登录', '确定要退出登录吗？');
    if (confirmed) {
      app.logout();
      this.setData({
        userInfo: null,
        isLogin: false,
        isAuth: false,
        isDriverVerified: false
      });
      wx.showToast({
        title: '已退出登录',
        icon: 'success'
      });
    }
  }
});
