const app = getApp();
const BASE_URL = 'https://api.zuche.example.com';

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token || wx.getStorageSync('token');
    
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else if (res.data.code === 401) {
            app.logout();
            wx.navigateTo({ url: '/pages/login/login' });
            reject(res.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

export const get = (url, data) => request({ url, method: 'GET', data });
export const post = (url, data) => request({ url, method: 'POST', data });
export const put = (url, data) => request({ url, method: 'PUT', data });
export const del = (url, data) => request({ url, method: 'DELETE', data });
export const upload = (url, filePath, name = 'file', formData = {}) => {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token || wx.getStorageSync('token');
    wx.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          resolve(data.data);
        } else {
          reject(data);
        }
      },
      fail: reject
    });
  });
};

export default request;
