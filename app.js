App({
  globalData: {
    userInfo: null,
    token: '',
    location: null,
    isAuth: false,
    isDriverVerified: false
  },

  onLaunch() {
    this.checkLoginStatus();
    this.getLocation();
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.isAuth = wx.getStorageSync('isAuth') || false;
      this.globalData.isDriverVerified = wx.getStorageSync('isDriverVerified') || false;
    }
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        };
      },
      fail: () => {
        this.globalData.location = {
          latitude: 39.908823,
          longitude: 116.397470
        };
      }
    });
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },

  setToken(token) {
    this.globalData.token = token;
    wx.setStorageSync('token', token);
  },

  setAuthStatus(status) {
    this.globalData.isAuth = status;
    wx.setStorageSync('isAuth', status);
  },

  setDriverVerified(status) {
    this.globalData.isDriverVerified = status;
    wx.setStorageSync('isDriverVerified', status);
  },

  logout() {
    this.globalData.userInfo = null;
    this.globalData.token = '';
    this.globalData.isAuth = false;
    this.globalData.isDriverVerified = false;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('isAuth');
    wx.removeStorageSync('isDriverVerified');
  }
});
