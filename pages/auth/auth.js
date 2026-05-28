const app = getApp();
import { showToast, showLoading, hideLoading } from '../../utils/util.js';

Page({
  data: {
    name: '',
    idCard: '',
    idCardFront: '',
    idCardBack: '',
    isUploading: false,
    isSubmitted: false,
    authStatus: 0
  },

  onLoad() {
    this.loadAuthStatus();
  },

  loadAuthStatus() {
    const authInfo = wx.getStorageSync('authInfo');
    if (authInfo) {
      this.setData({
        name: authInfo.name,
        idCard: authInfo.idCard,
        idCardFront: authInfo.idCardFront,
        idCardBack: authInfo.idCardBack,
        authStatus: authInfo.status
      });
    }
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onIdCardInput(e) {
    this.setData({ idCard: e.detail.value });
  },

  async chooseImage(type) {
    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed']
      });
      
      const tempFilePath = res.tempFiles[0].tempFilePath;
      this.setData({ isUploading: true });
      
      setTimeout(() => {
        this.setData({
          [type]: tempFilePath,
          isUploading: false
        });
        showToast('上传成功', 'success');
      }, 1000);
    } catch (err) {
      console.error('选择图片失败', err);
    }
  },

  uploadFront() {
    this.chooseImage('idCardFront');
  },

  uploadBack() {
    this.chooseImage('idCardBack');
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url]
    });
  },

  validate() {
    if (!this.data.name.trim()) {
      showToast('请输入真实姓名');
      return false;
    }
    if (!/^[\u4e00-\u9fa5]{2,10}$/.test(this.data.name)) {
      showToast('请输入正确的姓名');
      return false;
    }
    if (!this.data.idCard.trim()) {
      showToast('请输入身份证号');
      return false;
    }
    if (!/^\d{17}[\dXx]$/.test(this.data.idCard)) {
      showToast('请输入正确的身份证号');
      return false;
    }
    if (!this.data.idCardFront) {
      showToast('请上传身份证正面');
      return false;
    }
    if (!this.data.idCardBack) {
      showToast('请上传身份证反面');
      return false;
    }
    return true;
  },

  submit() {
    if (!this.validate()) return;

    showLoading('提交中...');

    setTimeout(() => {
      hideLoading();
      
      const authInfo = {
        name: this.data.name,
        idCard: this.data.idCard,
        idCardFront: this.data.idCardFront,
        idCardBack: this.data.idCardBack,
        status: 1,
        submitTime: new Date().toISOString()
      };

      wx.setStorageSync('authInfo', authInfo);
      app.setAuthStatus(true);

      this.setData({ 
        isSubmitted: true,
        authStatus: 1
      });

      showToast('提交成功，审核中', 'success');

      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }, 1500);
  },

  getStatusText() {
    const statusMap = {
      0: '未认证',
      1: '审核中',
      2: '已通过',
      3: '已拒绝'
    };
    return statusMap[this.data.authStatus] || '未认证';
  }
});
