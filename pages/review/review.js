import { showToast, showLoading, hideLoading, chooseImage, previewImage } from '../../utils/util.js';

Page({
  data: {
    orderId: '',
    order: null,
    carRating: 5,
    serviceRating: 5,
    tags: [
      { id: 1, name: '车况良好', selected: false },
      { id: 2, name: '服务周到', selected: false },
      { id: 3, name: '取车方便', selected: false },
      { id: 4, name: '性价比高', selected: false },
      { id: 5, name: '车内整洁', selected: false },
      { id: 6, name: '还车快捷', selected: false }
    ],
    content: '',
    images: [],
    submitting: false
  },

  onLoad(options) {
    this.setData({ orderId: options.id });
    this.loadOrderInfo();
  },

  loadOrderInfo() {
    const orders = wx.getStorageSync('orders') || [];
    const order = orders.find(o => o.id === Number(this.data.orderId));
    if (order) {
      this.setData({ order });
    }
  },

  onCarRatingChange(e) {
    this.setData({ carRating: e.detail.value });
  },

  onServiceRatingChange(e) {
    this.setData({ serviceRating: e.detail.value });
  },

  toggleTag(e) {
    const { index } = e.currentTarget.dataset;
    const tags = [...this.data.tags];
    tags[index].selected = !tags[index].selected;
    this.setData({ tags });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
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

  validate() {
    if (this.data.carRating === 0) {
      showToast('请给车辆打分');
      return false;
    }
    if (this.data.serviceRating === 0) {
      showToast('请给服务打分');
      return false;
    }
    return true;
  },

  async submitReview() {
    if (!this.validate()) return;

    showLoading('提交中...');
    this.setData({ submitting: true });

    setTimeout(() => {
      hideLoading();
      this.setData({ submitting: false });

      const orders = wx.getStorageSync('orders') || [];
      const index = orders.findIndex(o => o.id === Number(this.data.orderId));
      if (index !== -1) {
        orders[index].status = 10;
        orders[index].review = {
          carRating: this.data.carRating,
          serviceRating: this.data.serviceRating,
          tags: this.data.tags.filter(t => t.selected).map(t => t.name),
          content: this.data.content,
          images: this.data.images,
          time: new Date().toISOString()
        };
        wx.setStorageSync('orders', orders);
      }

      showToast('评价成功', 'success');
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1500);
  }
});
