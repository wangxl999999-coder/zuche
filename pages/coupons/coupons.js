import { showToast } from '../../utils/util.js';

Page({
  data: {
    activeTab: 0,
    tabs: [
      { label: '可使用', value: 1 },
      { label: '已使用', value: 2 },
      { label: '已过期', value: 3 }
    ],
    coupons: [
      {
        id: 1,
        name: '新用户首日免租',
        type: 'free',
        value: 1,
        minAmount: 0,
        status: 1,
        expireTime: '2024-12-31',
        desc: '首租日租金全免，最高抵扣200元'
      },
      {
        id: 2,
        name: '满500减100',
        type: 'cash',
        value: 100,
        minAmount: 500,
        status: 1,
        expireTime: '2024-06-30',
        desc: '订单满500元可用'
      },
      {
        id: 3,
        name: '8折优惠券',
        type: 'discount',
        value: 0.8,
        minAmount: 300,
        status: 1,
        expireTime: '2024-05-31',
        desc: '订单满300元享8折，最高减150元'
      },
      {
        id: 4,
        name: '邀请好友专享券',
        type: 'cash',
        value: 50,
        minAmount: 200,
        status: 2,
        expireTime: '2024-03-31',
        desc: '订单满200元可用'
      },
      {
        id: 5,
        name: '春节特惠券',
        type: 'discount',
        value: 0.7,
        minAmount: 1000,
        status: 3,
        expireTime: '2024-02-15',
        desc: '春节期间专享7折优惠'
      }
    ],
    filteredCoupons: []
  },

  onLoad() {
    this.filterCoupons();
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
    this.filterCoupons();
  },

  filterCoupons() {
    const status = this.data.tabs[this.data.activeTab].value;
    const filtered = this.data.coupons.filter(c => c.status === status);
    this.setData({ filteredCoupons: filtered });
  },

  useCoupon(e) {
    const { id } = e.currentTarget.dataset;
    const coupon = this.data.coupons.find(c => c.id === id);
    
    if (coupon && coupon.status === 1) {
      wx.switchTab({
        url: '/pages/index/index',
        success: () => {
          showToast('请选择车辆后使用优惠券', 'none');
        }
      });
    }
  },

  getCouponValue(coupon) {
    if (coupon.type === 'cash') {
      return `¥${coupon.value}`;
    } else if (coupon.type === 'discount') {
      return `${coupon.value * 10}折`;
    } else {
      return '免1天';
    }
  }
});
