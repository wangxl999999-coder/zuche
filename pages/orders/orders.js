const app = getApp();
import { checkAuth } from '../../utils/auth.js';

Page({
  data: {
    activeTab: 0,
    tabs: [
      { label: '全部', value: -1 },
      { label: '待支付', value: 0 },
      { label: '待取车', value: 1 },
      { label: '租用中', value: 4 },
      { label: '已完成', value: 9 }
    ],
    orders: [],
    filteredOrders: [],
    loading: false
  },

  onLoad() {
    this.initMockOrders();
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  initMockOrders() {
    const existingOrders = wx.getStorageSync('orders');
    if (!existingOrders || existingOrders.length === 0) {
      const mockOrders = [
        {
          id: 1001,
          orderNo: 'ZC20240120001',
          carId: 1,
          carName: '大众朗逸 2023款',
          carImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20Volkswagen%20Lavida%20car%20front%20view%20studio%20shot&image_size=square',
          transmission: '自动',
          seats: 5,
          fuelType: '汽油',
          pickupDate: '2024-01-21',
          pickupTime: '10:00',
          returnDate: '2024-01-23',
          returnTime: '10:00',
          rentalDays: 2,
          pickupAddress: '北京市朝阳区建国路88号门店',
          totalAmount: 356,
          status: 1,
          createTime: '2024-01-20T10:00:00.000Z'
        },
        {
          id: 1002,
          orderNo: 'ZC20240115002',
          carId: 2,
          carName: '丰田凯美瑞 2023款',
          carImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20Toyota%20Camry%20sedan%20front%20view%20professional%20photo&image_size=square',
          transmission: '自动',
          seats: 5,
          fuelType: '汽油',
          pickupDate: '2024-01-10',
          pickupTime: '09:00',
          returnDate: '2024-01-12',
          returnTime: '09:00',
          rentalDays: 2,
          pickupAddress: '北京市东城区王府井大街1号门店',
          totalAmount: 586,
          status: 9,
          createTime: '2024-01-09T15:00:00.000Z'
        },
        {
          id: 1003,
          orderNo: 'ZC20240118003',
          carId: 3,
          carName: '本田CR-V 2023款',
          carImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20Honda%20CRV%20SUV%20side%20view%20outdoor%20shot&image_size=square',
          transmission: '自动',
          seats: 5,
          fuelType: '汽油',
          pickupDate: '2024-01-18',
          pickupTime: '14:00',
          returnDate: '2024-01-20',
          returnTime: '14:00',
          rentalDays: 2,
          pickupAddress: '北京市朝阳区三里屯太古里',
          totalAmount: 796,
          status: 4,
          createTime: '2024-01-17T09:00:00.000Z'
        }
      ];
      wx.setStorageSync('orders', mockOrders);
    }
  },

  loadOrders() {
    this.setData({ loading: true });
    
    setTimeout(() => {
      const orders = wx.getStorageSync('orders') || [];
      this.setData({ 
        orders,
        loading: false
      });
      this.filterOrders();
    }, 300);
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
    this.filterOrders();
  },

  filterOrders() {
    const { activeTab, tabs, orders } = this.data;
    const status = tabs[activeTab].value;
    
    let filtered = orders;
    if (status !== -1) {
      filtered = orders.filter(order => order.status === status);
    }
    
    this.setData({ filteredOrders: filtered });
  },

  onPullDownRefresh() {
    this.loadOrders();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
