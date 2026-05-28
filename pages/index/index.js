const app = getApp();
import { getCurrentLocation, calculateDistance, formatDistance } from '../../utils/map.js';

Page({
  data: {
    location: {
      latitude: 39.908823,
      longitude: 116.397470
    },
    markers: [],
    showList: true,
    cars: [],
    filteredCars: [],
    filters: {},
    selectedCar: null,
    loading: false
  },

  onLoad() {
    this.initLocation();
    this.loadCars();
  },

  onShow() {
    this.checkNewUserPromotion();
  },

  onPullDownRefresh() {
    this.loadCars().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  initLocation() {
    if (app.globalData.location) {
      this.setData({
        location: app.globalData.location
      });
    } else {
      getCurrentLocation().then(res => {
        this.setData({
          location: res
        });
        app.globalData.location = res;
      }).catch(() => {
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      });
    }
  },

  loadCars() {
    this.setData({ loading: true });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const cars = this.getMockCars();
        cars.forEach(car => {
          car.distance = calculateDistance(
            this.data.location.latitude,
            this.data.location.longitude,
            car.latitude,
            car.longitude
          );
        });
        cars.sort((a, b) => a.distance - b.distance);
        
        this.setData({
          cars,
          filteredCars: cars,
          loading: false
        });
        this.createMarkers(cars);
        resolve();
      }, 500);
    });
  },

  getMockCars() {
    return [
      {
        id: 1,
        name: '大众朗逸 2023款',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20Volkswagen%20Lavida%20car%20side%20view%20studio%20shot&image_size=square',
        type: 'economic',
        transmission: '自动',
        seats: 5,
        fuelType: '汽油',
        price: 128,
        rating: 4.8,
        reviewCount: 256,
        provider: 'self',
        isNew: true,
        features: ['蓝牙', '倒车雷达', 'GPS导航'],
        latitude: 39.918823,
        longitude: 116.407470,
        address: '北京市朝阳区建国路88号',
        status: 'available'
      },
      {
        id: 2,
        name: '丰田凯美瑞 2023款',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silver%20Toyota%20Camry%20sedan%20side%20view%20professional%20photo&image_size=square',
        type: 'comfort',
        transmission: '自动',
        seats: 5,
        fuelType: '汽油',
        price: 218,
        rating: 4.9,
        reviewCount: 512,
        provider: 'self',
        isNew: false,
        features: ['真皮座椅', '自动空调', '倒车影像', '定速巡航'],
        latitude: 39.898823,
        longitude: 116.387470,
        address: '北京市东城区王府井大街1号',
        status: 'available'
      },
      {
        id: 3,
        name: '本田CR-V 2023款',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20Honda%20CRV%20SUV%20side%20view%20outdoor%20shot&image_size=square',
        type: 'suv',
        transmission: '自动',
        seats: 5,
        fuelType: '汽油',
        price: 298,
        rating: 4.7,
        reviewCount: 328,
        provider: 'franchise',
        isNew: false,
        features: ['全景天窗', '四驱系统', '座椅加热'],
        latitude: 39.928823,
        longitude: 116.427470,
        address: '北京市朝阳区三里屯太古里',
        status: 'available'
      },
      {
        id: 4,
        name: '别克GL8 2023款',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20Buick%20GL8%20MPV%20side%20view%20business%20car&image_size=square',
        type: 'business',
        transmission: '自动',
        seats: 7,
        fuelType: '汽油',
        price: 458,
        rating: 4.9,
        reviewCount: 189,
        provider: 'self',
        isNew: true,
        features: ['航空座椅', '电动侧滑门', '后排娱乐'],
        latitude: 39.905823,
        longitude: 116.417470,
        address: '北京市朝阳区国贸中心',
        status: 'available'
      },
      {
        id: 5,
        name: '特斯拉Model 3',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20Tesla%20Model%203%20electric%20car%20side%20view%20modern&image_size=square',
        type: 'newenergy',
        transmission: '自动',
        seats: 5,
        fuelType: '纯电',
        price: 388,
        rating: 4.8,
        reviewCount: 425,
        provider: 'franchise',
        isNew: false,
        features: ['自动驾驶', '智能互联', '快充'],
        latitude: 39.888823,
        longitude: 116.397470,
        address: '北京市西城区金融街',
        status: 'available'
      },
      {
        id: 6,
        name: '宝马5系 2023款',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20BMW%205%20series%20luxury%20sedan%20side%20view%20elegant&image_size=square',
        type: 'luxury',
        transmission: '自动',
        seats: 5,
        fuelType: '汽油',
        price: 688,
        rating: 4.9,
        reviewCount: 156,
        provider: 'self',
        isNew: true,
        features: ['真皮内饰', '氛围灯', 'HUD抬头显示'],
        latitude: 39.912823,
        longitude: 116.377470,
        address: '北京市海淀区中关村',
        status: 'available'
      }
    ];
  },

  createMarkers(cars) {
    const markers = cars.map(car => ({
      id: car.id,
      latitude: car.latitude,
      longitude: car.longitude,
      iconPath: '../../images/marker-car.png',
      width: 60,
      height: 60,
      callout: {
        content: `¥${car.price}/天\n${car.name}`,
        color: '#333',
        fontSize: 12,
        borderRadius: 8,
        bgColor: '#fff',
        padding: 8,
        display: 'BYCLICK'
      }
    }));
    this.setData({ markers });
  },

  onMarkerTap(e) {
    const carId = e.markerId;
    const car = this.data.cars.find(c => c.id === carId);
    this.setData({ selectedCar: car });
  },

  onCalloutTap(e) {
    const carId = e.markerId;
    wx.navigateTo({
      url: `/pages/car-detail/car-detail?id=${carId}`
    });
  },

  toggleView() {
    this.setData({
      showList: !this.data.showList
    });
  },

  onFilter(e) {
    const filters = e.detail;
    this.setData({ filters });
    this.applyFilters();
  },

  applyFilters() {
    let filtered = [...this.data.cars];
    const { filters } = this.data;

    if (filters.carType) {
      filtered = filtered.filter(car => car.type === filters.carType);
    }
    if (filters.fuelType) {
      filtered = filtered.filter(car => car.fuelType === filters.fuelType);
    }
    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }
    if (filters.seats) {
      if (filters.seats === '2') {
        filtered = filtered.filter(car => car.seats <= 2);
      } else if (filters.seats === '4-5') {
        filtered = filtered.filter(car => car.seats >= 4 && car.seats <= 5);
      } else if (filters.seats === '6-7') {
        filtered = filtered.filter(car => car.seats >= 6 && car.seats <= 7);
      } else if (filters.seats === '7+') {
        filtered = filtered.filter(car => car.seats > 7);
      }
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(v => v === '+' ? Infinity : Number(v));
      filtered = filtered.filter(car => car.price >= min && car.price <= (max || Infinity));
    }
    if (filters.provider) {
      filtered = filtered.filter(car => car.provider === filters.provider);
    }

    this.setData({ filteredCars: filtered });
    this.createMarkers(filtered);
  },

  checkNewUserPromotion() {
    const isNewUser = !wx.getStorageSync('hasVisited');
    if (isNewUser) {
      wx.showModal({
        title: '新用户专享',
        content: '新用户首日免租，立即预订享受优惠！',
        confirmText: '去看看',
        cancelText: '稍后再说',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/flash-sale/flash-sale'
            });
          }
        }
      });
      wx.setStorageSync('hasVisited', true);
    }
  },

  goSearch() {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },

  goPromotion() {
    wx.navigateTo({
      url: '/pages/flash-sale/flash-sale'
    });
  },

  goInvite() {
    wx.navigateTo({
      url: '/pages/invite/invite'
    });
  }
});
