import { showToast, showLoading, hideLoading, chooseImage, previewImage, makePhoneCall } from '../../utils/util.js';

Page({
  data: {
    orderId: '',
    orders: [],
    selectedOrder: null,
    faultTypes: [
      { id: 1, name: '发动机故障', selected: false },
      { id: 2, name: '轮胎问题', selected: false },
      { id: 3, name: '刹车异常', selected: false },
      { id: 4, name: '电瓶亏电', selected: false },
      { id: 5, name: '空调问题', selected: false },
      { id: 6, name: '车身刮擦', selected: false },
      { id: 7, name: '内饰损坏', selected: false },
      { id: 8, name: '其他问题', selected: false }
    ],
    description: '',
    contactPhone: '',
    images: [],
    emergency: false,
    submitting: false
  },

  onLoad(options) {
    this.loadActiveOrders();
    if (options.orderId) {
      this.setData({ orderId: options.orderId });
    }
  },

  loadActiveOrders() {
    const orders = wx.getStorageSync('orders') || [];
    const activeOrders = orders.filter(o => o.status >= 4 && o.status < 8);
    this.setData({ orders: activeOrders });
    
    if (activeOrders.length === 1) {
      this.setData({ selectedOrder: activeOrders[0] });
    }
  },

  selectOrder(e) {
    const { id } = e.currentTarget.dataset;
    const order = this.data.orders.find(o => o.id === Number(id));
    this.setData({ selectedOrder: order });
  },

  toggleFaultType(e) {
    const { index } = e.currentTarget.dataset;
    const types = [...this.data.faultTypes];
    types[index].selected = !types[index].selected;
    this.setData({ faultTypes: types });
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value });
  },

  toggleEmergency() {
    this.setData({ emergency: !this.data.emergency });
  },

  async uploadImage() {
    if (this.data.images.length >= 9) {
      showToast('最多上传9张图片');
      return;
    }

    try {
      const res = await chooseImage(9 - this.data.images.length);
      const images = [...this.data.images, ...res.tempFilePaths].slice(0, 9);
      this.setData({ images });
    } catch (err) {
      console.error('选择图片失败', err);
    }
  },

  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    previewImage(this.data.images, this.data.images[index]);
  },

  deleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  callEmergency() {
    makePhoneCall('400-888-8888');
  },

  validate() {
    if (!this.data.selectedOrder) {
      showToast('请选择报修订单');
      return false;
    }

    const selectedTypes = this.data.faultTypes.filter(t => t.selected);
    if (selectedTypes.length === 0) {
      showToast('请选择故障类型');
      return false;
    }

    if (!this.data.description.trim()) {
      showToast('请描述故障情况');
      return false;
    }

    if (!/^1[3-9]\d{9}$/.test(this.data.contactPhone)) {
      showToast('请输入正确的联系电话');
      return false;
    }

    return true;
  },

  async submitRepair() {
    if (!this.validate()) return;

    showLoading('提交中...');
    this.setData({ submitting: true });

    setTimeout(() => {
      hideLoading();
      this.setData({ submitting: false });

      const repairs = wx.getStorageSync('repairs') || [];
      const newRepair = {
        id: Date.now(),
        orderId: this.data.selectedOrder.id,
        carName: this.data.selectedOrder.carName,
        faultTypes: this.data.faultTypes.filter(t => t.selected).map(t => t.name),
        description: this.data.description,
        contactPhone: this.data.contactPhone,
        images: this.data.images,
        emergency: this.data.emergency,
        status: 0,
        createTime: new Date().toISOString()
      };
      repairs.unshift(newRepair);
      wx.setStorageSync('repairs', repairs);

      wx.showModal({
        title: '提交成功',
        content: '我们已收到您的报修申请，客服将在10分钟内联系您。如有紧急情况，请拨打救援电话。',
        confirmText: '我知道了',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
    }, 1500);
  }
});
