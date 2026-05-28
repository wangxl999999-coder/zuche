import { showToast, showLoading, hideLoading, showModal } from '../../utils/util.js';

Page({
  data: {
    orderId: '',
    order: null,
    agreed: false,
    signing: false
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

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  async signContract() {
    if (!this.data.agreed) {
      showToast('请先阅读并同意合同条款');
      return;
    }

    const confirmed = await showModal('签署确认', '确认签署电子合同吗？签署后具有法律效力。');
    if (!confirmed) return;

    showLoading('签署中...');
    this.setData({ signing: true });

    setTimeout(() => {
      hideLoading();
      this.setData({ signing: false });
      
      const orders = wx.getStorageSync('orders') || [];
      const index = orders.findIndex(o => o.id === Number(this.data.orderId));
      if (index !== -1) {
        orders[index].status = 2;
        orders[index].contractSigned = true;
        orders[index].contractSignTime = new Date().toISOString();
        wx.setStorageSync('orders', orders);
      }

      showToast('签署成功', 'success');
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 2000);
  },

  previewContract() {
    wx.showModal({
      title: '汽车租赁合同',
      content: '出租方（甲方）：租车出行\n承租方（乙方）：用户\n\n一、租赁车辆\n乙方租用甲方提供的车辆，车辆信息以订单为准。\n\n二、租赁期限\n租赁期限以订单确认的租期为准。\n\n三、租金及支付\n租金按天计算，支付方式以平台为准。\n\n四、双方权利义务\n1. 甲方保证车辆性能良好，手续齐全；\n2. 乙方应按时支付租金，合法使用车辆；\n3. 乙方不得转借、抵押、转租车辆。\n\n五、违约责任\n违约方应承担相应的违约责任。\n\n六、争议解决\n协商不成，可向法院提起诉讼。',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});
