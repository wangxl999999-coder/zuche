const app = getApp();
import { showToast, showLoading, hideLoading, showModal } from '../../utils/util.js';
import { formatDate, addDays, getDaysDiff } from '../../utils/date.js';

Page({
  data: {
    carId: '',
    car: null,
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00',
    rentalDays: 1,
    pickupMethod: 'self',
    deliveryAddress: '',
    pickupAddress: '',
    returnAddress: '',
    additionalServices: [
      { id: 1, name: '基础保险', price: 50, unit: '/天', selected: true, desc: '车辆损失险、第三者责任险' },
      { id: 2, name: '全车盗抢险', price: 30, unit: '/天', selected: false, desc: '车辆被盗被抢保障' },
      { id: 3, name: '司机服务', price: 300, unit: '/天', selected: false, desc: '专业司机代驾服务' },
      { id: 4, name: 'GPS导航', price: 20, unit: '/天', selected: false, desc: '车载GPS导航设备' },
      { id: 5, name: '儿童座椅', price: 30, unit: '/天', selected: false, desc: '安全儿童座椅' },
      { id: 6, name: '道路救援', price: 15, unit: '/天', selected: true, desc: '24小时道路救援服务' }
    ],
    couponId: '',
    coupon: null,
    showCouponPicker: false,
    coupons: [
      { id: 1, name: '新用户首日免租', type: 'free', value: 1, minAmount: 0, status: 1 },
      { id: 2, name: '满500减100', type: 'cash', value: 100, minAmount: 500, status: 1 },
      { id: 3, name: '8折优惠券', type: 'discount', value: 0.8, minAmount: 300, status: 1 }
    ],
    showDetail: false,
    deposit: 3000,
    totalAmount: 0,
    basePrice: 0,
    servicePrice: 0,
    couponDiscount: 0
  },

  onLoad(options) {
    this.setData({ carId: options.carId });
    this.initDates();
    this.loadCarInfo();
  },

  initDates() {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const dayAfter = addDays(today, 2);
    
    this.setData({
      pickupDate: formatDate(tomorrow),
      returnDate: formatDate(dayAfter),
      rentalDays: 1
    });
  },

  loadCarInfo() {
    const cars = [
      {
        id: 1,
        name: '大众朗逸 2023款',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20Volkswagen%20Lavida%20car%20front%20view%20studio%20shot&image_size=square',
        transmission: '自动',
        seats: 5,
        fuelType: '汽油',
        price: 128,
        address: '北京市朝阳区建国路88号门店'
      },
      {
        id: 2,
        name: '丰田凯美瑞 2023款',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20Toyota%20Camry%20sedan%20front%20view%20professional%20photo&image_size=square',
        transmission: '自动',
        seats: 5,
        fuelType: '汽油',
        price: 218,
        address: '北京市东城区王府井大街1号门店'
      }
    ];

    const car = cars.find(c => c.id === Number(this.data.carId)) || cars[0];
    this.setData({ 
      car,
      pickupAddress: car.address,
      returnAddress: car.address,
      deposit: car.price > 200 ? 5000 : 3000
    });
    this.calculatePrice();
  },

  onPickupDateChange(e) {
    const pickupDate = e.detail.value;
    let returnDate = this.data.returnDate;
    
    if (new Date(pickupDate) >= new Date(returnDate)) {
      returnDate = formatDate(addDays(pickupDate, 1));
    }
    
    const rentalDays = getDaysDiff(pickupDate, returnDate);
    
    this.setData({ 
      pickupDate, 
      returnDate,
      rentalDays
    });
    this.calculatePrice();
  },

  onReturnDateChange(e) {
    const returnDate = e.detail.value;
    const rentalDays = getDaysDiff(this.data.pickupDate, returnDate);
    
    if (rentalDays < 1) {
      showToast('租期至少1天');
      return;
    }
    
    this.setData({ 
      returnDate,
      rentalDays
    });
    this.calculatePrice();
  },

  onPickupTimeChange(e) {
    this.setData({ pickupTime: e.detail.value });
  },

  onReturnTimeChange(e) {
    this.setData({ returnTime: e.detail.value });
  },

  togglePickupMethod(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ pickupMethod: method });
    this.calculatePrice();
  },

  onAddressInput(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      [type]: e.detail.value
    });
  },

  toggleService(e) {
    const { id } = e.currentTarget.dataset;
    const services = this.data.additionalServices.map(s => {
      if (s.id === id) {
        return { ...s, selected: !s.selected };
      }
      return s;
    });
    this.setData({ additionalServices: services });
    this.calculatePrice();
  },

  toggleCouponPicker() {
    this.setData({ showCouponPicker: !this.data.showCouponPicker });
  },

  selectCoupon(e) {
    const { id } = e.currentTarget.dataset;
    const coupon = this.data.coupons.find(c => c.id === id);
    
    if (coupon && this.data.basePrice < coupon.minAmount) {
      showToast(`订单满${coupon.minAmount}元可用`);
      return;
    }
    
    this.setData({ 
      couponId: id,
      coupon,
      showCouponPicker: false
    });
    this.calculatePrice();
  },

  toggleDetail() {
    this.setData({ showDetail: !this.data.showDetail });
  },

  calculatePrice() {
    const { car, rentalDays, additionalServices, coupon, pickupMethod } = this.data;
    
    const basePrice = car.price * rentalDays;
    let servicePrice = 0;
    
    additionalServices.forEach(s => {
      if (s.selected) {
        if (s.id === 3) {
          servicePrice += s.price * rentalDays;
        } else {
          servicePrice += s.price * rentalDays;
        }
      }
    });

    if (pickupMethod === 'delivery') {
      servicePrice += 50;
    }

    let couponDiscount = 0;
    if (coupon) {
      if (coupon.type === 'cash') {
        couponDiscount = coupon.value;
      } else if (coupon.type === 'discount') {
        couponDiscount = Math.floor(basePrice * (1 - coupon.value));
      } else if (coupon.type === 'free') {
        couponDiscount = car.price;
      }
    }

    const totalAmount = basePrice + servicePrice - couponDiscount;

    this.setData({
      basePrice,
      servicePrice,
      couponDiscount,
      totalAmount: Math.max(0, totalAmount)
    });
  },

  async submitOrder() {
    if (this.data.pickupMethod === 'delivery' && !this.data.deliveryAddress) {
      showToast('请填写送车地址');
      return;
    }

    const confirmed = await showModal('确认订单', '请确认订单信息无误后提交');
    if (!confirmed) return;

    showLoading('提交中...');

    setTimeout(() => {
      hideLoading();
      
      const order = {
        id: Date.now(),
        orderNo: 'ZC' + Date.now(),
        carId: this.data.carId,
        carName: this.data.car.name,
        carImage: this.data.car.image,
        transmission: this.data.car.transmission,
        seats: this.data.car.seats,
        fuelType: this.data.car.fuelType,
        pickupDate: this.data.pickupDate,
        pickupTime: this.data.pickupTime,
        returnDate: this.data.returnDate,
        returnTime: this.data.returnTime,
        rentalDays: this.data.rentalDays,
        pickupMethod: this.data.pickupMethod,
        pickupAddress: this.data.pickupAddress,
        returnAddress: this.data.returnAddress,
        deliveryAddress: this.data.deliveryAddress,
        services: this.data.additionalServices.filter(s => s.selected),
        couponId: this.data.couponId,
        deposit: this.data.deposit,
        basePrice: this.data.basePrice,
        servicePrice: this.data.servicePrice,
        couponDiscount: this.data.couponDiscount,
        totalAmount: this.data.totalAmount,
        status: 0,
        createTime: new Date().toISOString()
      };

      const orders = wx.getStorageSync('orders') || [];
      orders.unshift(order);
      wx.setStorageSync('orders', orders);

      showToast('订单提交成功', 'success');

      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/order-detail/order-detail?id=${order.id}`
        });
      }, 1500);
    }, 1500);
  }
});
