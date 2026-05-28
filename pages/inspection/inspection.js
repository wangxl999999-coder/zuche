import { showToast, showLoading, hideLoading, previewImage, showModal } from '../../utils/util.js';

Page({
  data: {
    orderId: '',
    type: 'pickup',
    typeText: '取车',
    inspectionItems: [
      { id: 1, name: '车身外观', status: 0, images: [], required: true },
      { id: 2, name: '车辆内饰', status: 0, images: [], required: true },
      { id: 3, name: '轮胎状况', status: 0, images: [], required: true },
      { id: 4, name: '仪表盘', status: 0, images: [], required: true },
      { id: 5, name: '后备箱', status: 0, images: [], required: false }
    ],
    damageMarks: [],
    mileage: '',
    fuelLevel: 50,
    currentItemId: null,
    submitting: false
  },

  onLoad(options) {
    const type = options.type || 'pickup';
    this.setData({
      orderId: options.id,
      type,
      typeText: type === 'pickup' ? '取车' : '还车'
    });
  },

  onMileageInput(e) {
    this.setData({ mileage: e.detail.value });
  },

  onFuelChange(e) {
    this.setData({ fuelLevel: e.detail.value });
  },

  selectItem(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ currentItemId: id });
  },

  async takePhoto() {
    if (!this.data.currentItemId) {
      showToast('请先选择验车项目');
      return;
    }

    try {
      const res = await wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed']
      });

      const tempFiles = res.tempFiles.map(f => f.tempFilePath);
      const items = this.data.inspectionItems.map(item => {
        if (item.id === this.data.currentItemId) {
          const newImages = [...item.images, ...tempFiles].slice(0, 9);
          return {
            ...item,
            images: newImages,
            status: newImages.length > 0 ? 1 : 0
          };
        }
        return item;
      });

      this.setData({ inspectionItems: items });
      showToast('上传成功', 'success');
    } catch (err) {
      console.error('拍照失败', err);
    }
  },

  previewImage(e) {
    const { itemId, index } = e.currentTarget.dataset;
    const item = this.data.inspectionItems.find(i => i.id === itemId);
    if (item && item.images.length > 0) {
      previewImage(item.images, item.images[index]);
    }
  },

  deleteImage(e) {
    const { itemId, index } = e.currentTarget.dataset;
    const items = this.data.inspectionItems.map(item => {
      if (item.id === itemId) {
        const newImages = item.images.filter((_, i) => i !== index);
        return {
          ...item,
          images: newImages,
          status: newImages.length > 0 ? 1 : 0
        };
      }
      return item;
    });
    this.setData({ inspectionItems: items });
  },

  addDamageMark() {
    const marks = [...this.data.damageMarks];
    marks.push({
      id: Date.now(),
      description: '',
      images: []
    });
    this.setData({ damageMarks: marks });
  },

  onDamageDescInput(e) {
    const { index } = e.currentTarget.dataset;
    const marks = [...this.data.damageMarks];
    marks[index].description = e.detail.value;
    this.setData({ damageMarks: marks });
  },

  async uploadDamagePhoto(e) {
    const { index } = e.currentTarget.dataset;
    
    try {
      const res = await wx.chooseMedia({
        count: 3,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed']
      });

      const tempFiles = res.tempFiles.map(f => f.tempFilePath);
      const marks = [...this.data.damageMarks];
      marks[index].images = [...marks[index].images, ...tempFiles].slice(0, 3);
      this.setData({ damageMarks: marks });
      showToast('上传成功', 'success');
    } catch (err) {
      console.error('拍照失败', err);
    }
  },

  deleteDamageMark(e) {
    const { index } = e.currentTarget.dataset;
    const marks = this.data.damageMarks.filter((_, i) => i !== index);
    this.setData({ damageMarks: marks });
  },

  validate() {
    const requiredItems = this.data.inspectionItems.filter(item => item.required);
    const incompleteItems = requiredItems.filter(item => item.images.length === 0);
    
    if (incompleteItems.length > 0) {
      showToast(`请完成${incompleteItems[0].name}的拍照`);
      return false;
    }

    if (!this.data.mileage) {
      showToast('请填写行驶里程');
      return false;
    }

    return true;
  },

  async submitInspection() {
    if (!this.validate()) return;

    const confirmed = await showModal(
      '确认提交',
      `确认提交${this.data.typeText}验车报告吗？`
    );
    if (!confirmed) return;

    showLoading('提交中...');
    this.setData({ submitting: true });

    setTimeout(() => {
      hideLoading();
      this.setData({ submitting: false });

      const orders = wx.getStorageSync('orders') || [];
      const index = orders.findIndex(o => o.id === Number(this.data.orderId));
      if (index !== -1) {
        if (this.data.type === 'pickup') {
          orders[index].status = 4;
          orders[index].pickupInspection = {
            items: this.data.inspectionItems,
            mileage: this.data.mileage,
            fuelLevel: this.data.fuelLevel,
            damageMarks: this.data.damageMarks,
            time: new Date().toISOString()
          };
        } else {
          orders[index].status = 8;
          orders[index].returnInspection = {
            items: this.data.inspectionItems,
            mileage: this.data.mileage,
            fuelLevel: this.data.fuelLevel,
            damageMarks: this.data.damageMarks,
            time: new Date().toISOString()
          };
        }
        wx.setStorageSync('orders', orders);
      }

      showToast('验车完成', 'success');
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 2000);
  }
});
