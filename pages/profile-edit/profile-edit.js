const app = getApp();
import { showToast, showLoading, hideLoading, chooseImage } from '../../utils/util.js';

Page({
  data: {
    userInfo: null,
    tempAvatar: '',
    nickname: '',
    gender: 0,
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: ''
  },

  onLoad() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo,
        nickname: userInfo.nickName || '',
        gender: userInfo.gender || 0,
        phone: userInfo.phone || '',
        email: userInfo.email || '',
        emergencyContact: userInfo.emergencyContact || '',
        emergencyPhone: userInfo.emergencyPhone || ''
      });
    }
  },

  async chooseAvatar() {
    try {
      const res = await chooseImage(1);
      if (res.tempFilePaths.length > 0) {
        this.setData({ tempAvatar: res.tempFilePaths[0] });
      }
    } catch (err) {
      console.error('选择图片失败', err);
    }
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  onGenderChange(e) {
    this.setData({ gender: Number(e.detail.value) });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onEmailInput(e) {
    this.setData({ email: e.detail.value });
  },

  onEmergencyContactInput(e) {
    this.setData({ emergencyContact: e.detail.value });
  },

  onEmergencyPhoneInput(e) {
    this.setData({ emergencyPhone: e.detail.value });
  },

  validate() {
    if (!this.data.nickname.trim()) {
      showToast('请输入昵称');
      return false;
    }
    
    if (this.data.phone && !/^1[3-9]\d{9}$/.test(this.data.phone)) {
      showToast('请输入正确的手机号');
      return false;
    }

    if (this.data.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(this.data.email)) {
      showToast('请输入正确的邮箱');
      return false;
    }

    if (this.data.emergencyPhone && !/^1[3-9]\d{9}$/.test(this.data.emergencyPhone)) {
      showToast('请输入正确的紧急联系人电话');
      return false;
    }

    return true;
  },

  async saveProfile() {
    if (!this.validate()) return;

    showLoading('保存中...');

    setTimeout(() => {
      hideLoading();

      const userInfo = {
        ...this.data.userInfo,
        nickName: this.data.nickname,
        avatarUrl: this.data.tempAvatar || (this.data.userInfo && this.data.userInfo.avatarUrl),
        gender: this.data.gender,
        phone: this.data.phone,
        email: this.data.email,
        emergencyContact: this.data.emergencyContact,
        emergencyPhone: this.data.emergencyPhone
      };

      app.setUserInfo(userInfo);
      
      showToast('保存成功', 'success');
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1500);
  }
});
