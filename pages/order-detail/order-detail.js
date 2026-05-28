const app = getApp();
import { showToast, showLoading, hideLoading, showModal, makePhoneCall } from '../../utils/util.js';
import { formatDateTime } from '../../utils/date.js';

Page({
  data: {
    orderId: '',
    order: null,
    statusMap: {
      0: { label: '待支付', color: '#ff976a', steps: ['提交订单', '待支付', '待取车', '租用中', '已完成'] },
      1: { label: '待取车', color: '#1989fa', steps: ['提交订单', '支付完成', '待取车', '租用中', '已完成'] },
      2: { label: '待签署合同', color: '#ff976a', steps: ['提交订单', '支付完成', '待签署合同', '租用中', '已完成'] },
      3: { label: '待验车', color: '#ff976a', steps: ['提交订单', '支付完成', '签署合同', '待验车', '已完成'] },
      4: { label: '租用中', color: '#07c160', steps: ['提交订单', '支付完成', '取车完成', '租用中', '已完成'] },
      5: { label: '待还车', color: '#1989fa', steps: ['提交订单', '支付完成', '取车完成', '租用中', '待还车'] },
      6: { label: '还车验车中', color: '#ff976a', steps: ['提交订单', '支付完成', '取车完成', '还车验车', '已完成'] },
      7: { label: '结算中', color: '#ff976a', steps: ['提交订单', '支付完成', '取车完成', '验车完成', '结算中'] },
      8: { label: '待评价', color: '#1989fa', steps: ['提交订单', '支付完成', '取车完成', '还车完成', '待评价'] },
      9: { label: '已完成', color: '#07c160', steps: ['提交订单', '支付完成', '取车完成', '还车完成', '已完成'] },
      10: { label: '已取消', color: '#999', steps: ['提交订单', '已取消', '', '', ''] },
      11: { label: '已退款', color: '#999', steps: ['提交订单', '退款中', '已退款', '', ''] }
    },
    currentStep: 0,
    showPassword: false,
    doorPassword: '123456'
  },

  onLoad(options) {
    this.setData({ orderId: options.id });
    this.loadOrderDetail();
  },

  loadOrderDetail() {
    const orders = wx.getStorageSync('orders') || [];
    const order = orders.find(o => o.id === Number(this.data.orderId));
    
    if (order) {
      const statusInfo = this.data.statusMap[order.status] || this.data.statusMap[0];
      let currentStep = 0;
      
      if (order.status >= 1) currentStep = 1;
      if (order.status >= 4) currentStep = 2;
      if (order.status >= 5) currentStep = 3;
      if (order.status >= 9) currentStep = 4;

      this.setData({ 
        order,
        currentStep,
        statusInfo
      });
    }
  },

  async payOrder() {
    const confirmed = await showModal('支付确认', `确认支付 ¥${this.data.order.totalAmount}？`);
    if (!confirmed) return;

    showLoading('支付中...');

    setTimeout(() => {
      hideLoading();
      
      const orders = wx.getStorageSync('orders') || [];
      const index = orders.findIndex(o => o.id === Number(this.data.orderId));
      if (index !== -1) {
        orders[index].status = 1;
        orders[index].payTime = new Date().toISOString();
        wx.setStorageSync('orders', orders);
        this.loadOrderDetail();
      }

      showToast('支付成功', 'success');
    }, 1500);
  },

  async cancelOrder() {
    const confirmed = await showModal('取消订单', '确定要取消该订单吗？');
    if (!confirmed) return;

    showLoading('处理中...');

    setTimeout(() => {
      hideLoading();
      
      const orders = wx.getStorageSync('orders') || [];
      const index = orders.findIndex(o => o.id === Number(this.data.orderId));
      if (index !== -1) {
        orders[index].status = 10;
        wx.setStorageSync('orders', orders);
        this.loadOrderDetail();
      }

      showToast('订单已取消', 'success');
    }, 1000);
  },

  goSignContract() {
    wx.navigateTo({
      url: `/pages/contract/contract?orderId=${this.data.orderId}`
    });
  },

  goInspection() {
    wx.navigateTo({
      url: `/pages/inspection/inspection?orderId=${this.data.orderId}&type=pickup`
    });
  },

  goReturnInspection() {
    wx.navigateTo({
      url: `/pages/inspection/inspection?orderId=${this.data.orderId}&type=return`
    });
  },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword });
  },

  openDoor() {
    showToast('车门已解锁', 'success');
  },

  goReview() {
    wx.navigateTo({
      url: `/pages/review/review?orderId=${this.data.orderId}`
    });
  },

  contactService() {
    makePhoneCall('400-888-8888');
  },

  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  onPullDownRefresh() {
    this.loadOrderDetail();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
