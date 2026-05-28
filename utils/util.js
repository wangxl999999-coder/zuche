export const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

export const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
};

export const generateOrderNo = () => {
  const date = new Date();
  const timestamp = date.getTime().toString();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return 'ZC' + timestamp.substr(-8) + random;
};

export const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  });
};

export const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  });
};

export const hideLoading = () => {
  wx.hideLoading();
};

export const showModal = (title, content, options = {}) => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      showCancel: options.showCancel !== false,
      success: (res) => {
        resolve(res.confirm);
      }
    });
  });
};

export const chooseImage = (count = 1) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: resolve,
      fail: reject
    });
  });
};

export const previewImage = (urls, current) => {
  wx.previewImage({
    urls,
    current
  });
};

export const makePhoneCall = (phoneNumber) => {
  wx.makePhoneCall({
    phoneNumber
  });
};

export const copyText = (text) => {
  wx.setClipboardData({
    data: text,
    success: () => {
      showToast('复制成功', 'success');
    }
  });
};

export const debounce = (fn, delay = 300) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export const throttle = (fn, delay = 300) => {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
};
