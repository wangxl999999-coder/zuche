const app = getApp();
import { showToast, showLoading, hideLoading } from '../../utils/util.js';

Page({
  data: {
    licenseNumber: '',
    licenseType: 'C1',
    firstIssueDate: '',
    validFrom: '',
    validTo: '',
    licenseFront: '',
    licenseBack: '',
    isUploading: false,
    verifyStatus: 0,
    licenseTypes: ['A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2', 'C3', 'C4', 'D', 'E', 'F'],
    showTypePicker: false
  },

  onLoad() {
    this.loadLicenseStatus();
  },

  loadLicenseStatus() {
    const licenseInfo = wx.getStorageSync('licenseInfo');
    if (licenseInfo) {
      this.setData({
        licenseNumber: licenseInfo.licenseNumber,
        licenseType: licenseInfo.licenseType,
        firstIssueDate: licenseInfo.firstIssueDate,
        validFrom: licenseInfo.validFrom,
        validTo: licenseInfo.validTo,
        licenseFront: licenseInfo.licenseFront,
        licenseBack: licenseInfo.licenseBack,
        verifyStatus: licenseInfo.status
      });
    }
  },

  onLicenseNumberInput(e) {
    this.setData({ licenseNumber: e.detail.value });
  },

  showTypePicker() {
    this.setData({ showTypePicker: true });
  },

  onTypeConfirm(e) {
    this.setData({
      licenseType: this.data.licenseTypes[e.detail.value],
      showTypePicker: false
    });
  },

  onTypeCancel() {
    this.setData({ showTypePicker: false });
  },

  onFirstIssueDateChange(e) {
    this.setData({ firstIssueDate: e.detail.value });
  },

  onValidFromChange(e) {
    this.setData({ validFrom: e.detail.value });
  },

  onValidToChange(e) {
    this.setData({ validTo: e.detail.value });
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
    this.chooseImage('licenseFront');
  },

  uploadBack() {
    this.chooseImage('licenseBack');
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url]
    });
  },

  validate() {
    if (!this.data.licenseNumber.trim()) {
      showToast('请输入驾驶证号');
      return false;
    }
    if (!this.data.firstIssueDate) {
      showToast('请选择初次领证日期');
      return false;
    }
    if (!this.data.validFrom) {
      showToast('请选择有效期起始日期');
      return false;
    }
    if (!this.data.validTo) {
      showToast('请选择有效期截止日期');
      return false;
    }
    if (!this.data.licenseFront) {
      showToast('请上传驾驶证正本');
      return false;
    }
    if (!this.data.licenseBack) {
      showToast('请上传驾驶证副页');
      return false;
    }

    const firstIssue = new Date(this.data.firstIssueDate);
    const now = new Date();
    const diffYears = (now - firstIssue) / (1000 * 60 * 60 * 24 * 365);
    if (diffYears < 1) {
      showToast('驾龄需满1年以上');
      return false;
    }

    return true;
  },

  submit() {
    if (!this.validate()) return;

    showLoading('提交中...');

    setTimeout(() => {
      hideLoading();
      
      const licenseInfo = {
        licenseNumber: this.data.licenseNumber,
        licenseType: this.data.licenseType,
        firstIssueDate: this.data.firstIssueDate,
        validFrom: this.data.validFrom,
        validTo: this.data.validTo,
        licenseFront: this.data.licenseFront,
        licenseBack: this.data.licenseBack,
        status: 1,
        submitTime: new Date().toISOString()
      };

      wx.setStorageSync('licenseInfo', licenseInfo);
      app.setDriverVerified(false);

      this.setData({ verifyStatus: 1 });

      showToast('提交成功，审核中', 'success');

      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }, 1500);
  }
});
