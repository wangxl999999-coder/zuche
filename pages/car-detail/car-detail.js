const app = getApp();
import { checkAuth, checkRealName, checkDriverLicense } from '../../utils/auth.js';
import { previewImage } from '../../utils/util.js';
import { RENTAL_RULES } from '../../utils/constants.js';

Page({
  data: {
    carId: '',
    car: null,
    currentImageIndex: 0,
    activeTab: 'config',
    reviews: [],
    rentalRules: RENTAL_RULES,
    showShare: false
  },

  onLoad(options) {
    this.setData({ carId: options.id });
    this.loadCarDetail();
    this.loadReviews();
  },

  loadCarDetail() {
    const cars = [
      {
        id: 1,
        name: '大众朗逸 2023款',
        images: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20Volkswagen%20Lavida%20car%20front%20view%20studio%20shot&image_size=square_hd',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20Volkswagen%20Lavida%20car%20side%20view%20studio%20shot&image_size=square_hd',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20Volkswagen%20Lavida%20car%20interior%20view%20studio%20shot&image_size=square_hd',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20Volkswagen%20Lavida%20car%20rear%20view%20studio%20shot&image_size=square_hd'
        ],
        type: 'economic',
        typeName: '经济型',
        transmission: '自动',
        seats: 5,
        fuelType: '汽油',
        displacement: '1.4T',
        price: 128,
        rating: 4.8,
        reviewCount: 256,
        provider: 'self',
        providerName: '自营',
        isNew: true,
        features: ['蓝牙', '倒车雷达', 'GPS导航', '自动空调', '电动天窗'],
        config: {
          body: '三厢轿车',
          engine: '1.4T 涡轮增压',
          power: '150马力',
          torque: '250N·m',
          transmission: '7挡双离合',
          drive: '前置前驱',
          fuel: '汽油',
          fuelConsumption: '5.5L/100km',
          seats: '5座',
          doors: '4门',
          airbag: '前排双气囊',
          abs: '有',
          esp: '有',
          parkingRadar: '后雷达',
          reverseCamera: '有',
          sunroof: '电动天窗',
          cruise: '定速巡航',
          airConditioning: '自动空调',
          bluetooth: '有',
          gps: '有',
          leatherSeats: '织物'
        },
        address: '北京市朝阳区建国路88号门店',
        latitude: 39.918823,
        longitude: 116.407470,
        deposit: 3000,
        dailyLimit: 200,
        overFee: 1
      },
      {
        id: 2,
        name: '丰田凯美瑞 2023款',
        images: [
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20Toyota%20Camry%20sedan%20front%20view%20professional%20photo&image_size=square_hd',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20Toyota%20Camry%20sedan%20side%20view%20professional%20photo&image_size=square_hd',
          'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20Toyota%20Camry%20sedan%20interior%20view%20professional%20photo&image_size=square_hd'
        ],
        type: 'comfort',
        typeName: '舒适型',
        transmission: '自动',
        seats: 5,
        fuelType: '汽油',
        displacement: '2.0L',
        price: 218,
        rating: 4.9,
        reviewCount: 512,
        provider: 'self',
        providerName: '自营',
        isNew: false,
        features: ['真皮座椅', '自动空调', '倒车影像', '定速巡航', '无钥匙进入'],
        config: {
          body: '三厢轿车',
          engine: '2.0L 自然吸气',
          power: '178马力',
          torque: '210N·m',
          transmission: 'CVT无级变速',
          drive: '前置前驱',
          fuel: '汽油',
          fuelConsumption: '5.8L/100km',
          seats: '5座',
          doors: '4门',
          airbag: '前排侧气囊',
          abs: '有',
          esp: '有',
          parkingRadar: '前后雷达',
          reverseCamera: '360全景',
          sunroof: '全景天窗',
          cruise: '自适应巡航',
          airConditioning: '自动空调',
          bluetooth: '有',
          gps: '有',
          leatherSeats: '真皮'
        },
        address: '北京市东城区王府井大街1号门店',
        latitude: 39.898823,
        longitude: 116.387470,
        deposit: 5000,
        dailyLimit: 300,
        overFee: 1.5
      }
    ];

    const car = cars.find(c => c.id === Number(this.data.carId)) || cars[0];
    this.setData({ car });
  },

  loadReviews() {
    const reviews = [
      {
        id: 1,
        userName: '张**',
        avatar: '',
        rating: 5,
        content: '车辆很新，车况很好，取还车都很方便，下次还会再来！',
        images: [],
        createTime: '2024-01-15',
        tags: ['车况佳', '服务好', '取车快']
      },
      {
        id: 2,
        userName: '李**',
        avatar: '',
        rating: 4,
        content: '整体体验不错，车辆干净整洁，就是门店位置稍微有点偏。',
        images: [],
        createTime: '2024-01-10',
        tags: ['车况佳', '价格实惠']
      },
      {
        id: 3,
        userName: '王**',
        avatar: '',
        rating: 5,
        content: '非常满意的一次租车体验，客服态度很好，车辆性能也很棒！',
        images: [],
        createTime: '2024-01-05',
        tags: ['服务好', '车况佳', '性价比高']
      }
    ];
    this.setData({ reviews });
  },

  onImageChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    previewImage(this.data.car.images, this.data.car.images[index]);
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  goLocation() {
    wx.openLocation({
      latitude: this.data.car.latitude,
      longitude: this.data.car.longitude,
      name: this.data.car.address,
      scale: 18
    });
  },

  async goBooking() {
    const isLogin = await checkAuth();
    if (!isLogin) return;

    const isAuth = await checkRealName();
    if (!isAuth) return;

    const isDriver = await checkDriverLicense();
    if (!isDriver) return;

    wx.navigateTo({
      url: `/pages/booking/booking?carId=${this.data.carId}`
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.car.name,
      path: `/pages/car-detail/car-detail?id=${this.data.carId}`,
      imageUrl: this.data.car.images[0]
    };
  },

  toggleShare() {
    this.setData({ showShare: !this.data.showShare });
  },

  closeShare() {
    this.setData({ showShare: false });
  }
});
