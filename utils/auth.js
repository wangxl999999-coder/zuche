const app = getApp();

export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: reject
    });
  });
};

export const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: resolve,
      fail: reject
    });
  });
};

export const getPhoneNumber = (e) => {
  return new Promise((resolve, reject) => {
    if (e.detail.code) {
      resolve(e.detail.code);
    } else {
      reject(e.detail);
    }
  });
};

export const checkAuth = () => {
  return new Promise((resolve) => {
    if (app.globalData.token) {
      resolve(true);
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/login/login' });
          }
          resolve(false);
        }
      });
    }
  });
};

export const checkRealName = () => {
  return new Promise((resolve) => {
    if (app.globalData.isAuth) {
      resolve(true);
    } else {
      wx.showModal({
        title: '提示',
        content: '请先完成实名认证',
        confirmText: '去认证',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/auth/auth' });
          }
          resolve(false);
        }
      });
    }
  });
};

export const checkDriverLicense = () => {
  return new Promise((resolve) => {
    if (app.globalData.isDriverVerified) {
      resolve(true);
    } else {
      wx.showModal({
        title: '提示',
        content: '请先上传驾驶证并通过审核',
        confirmText: '去上传',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/driver-license/driver-license' });
          }
          resolve(false);
        }
      });
    }
  });
};
