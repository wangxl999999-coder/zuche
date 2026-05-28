import { formatPrice, showToast, showLoading, hideLoading } from '../../utils/util.js';

Page({
  data: {
    countdown: {
      hours: 2,
      minutes: 30,
      seconds: 45
    },
    flashCars: [
      {
        id: 101,
        name: '特斯拉 Model 3',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tesla%20model%203%20white%20car%20front%20view&image_size=square',
        originalPrice: 399,
        salePrice: 199,
        discount: '5折',
        stock: 3,
        sold: 12,
        tags: ['新能源', '自动驾驶'],
        startTime: '09:00',
        status: 1
      },
      {
        id: 102,
        name: '宝马 3系',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bmw%203%20series%20white%20sedan%20car&image_size=square',
        originalPrice: 499,
        salePrice: 299,
        discount: '6折',
        stock: 5,
        sold: 8,
        tags: ['豪华', '运动'],
        startTime: '12:00',
        status: 2
      },
      {
        id: 103,
        name: '奔驰 GLC',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mercedes%20glc%20white%20suv%20car&image_size=square',
        originalPrice: 699,
        salePrice: 459,
        discount: '6.6折',
        stock: 2,
        sold: 6,
        tags: ['SUV', '豪华'],
        startTime: '15:00',
        status: 2
      },
      {
        id: 104,
        name: '丰田 凯美瑞',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=toyota%20camry%20white%20sedan%20car&image_size=square',
        originalPrice: 299,
        salePrice: 149,
        discount: '5折',
        stock: 0,
        sold: 20,
        tags: ['经济', '舒适'],
        startTime: '09:00',
        status: 3
      }
    ],
    timer: null
  },

  onLoad() {
    this.startCountdown();
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  startCountdown() {
    const timer = setInterval(() => {
      let { hours, minutes, seconds } = this.data.countdown;
      
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
      if (minutes < 0) {
        minutes = 59;
        hours--;
      }
      if (hours < 0) {
        hours = 0;
        minutes = 0;
        seconds = 0;
        clearInterval(timer);
      }

      this.setData({
        countdown: { hours, minutes, seconds }
      });
    }, 1000);

    this.setData({ timer });
  },

  getStatusText(status) {
    const statusMap = {
      1: '抢购中',
      2: '即将开始',
      3: '已抢光'
    };
    return statusMap[status] || '';
  },

  goCarDetail(e) {
    const { id, status } = e.currentTarget.dataset;
    
    if (status === 2) {
      showToast('活动尚未开始');
      return;
    }
    
    if (status === 3) {
      showToast('已被抢光');
      return;
    }

    wx.navigateTo({
      url: `/pages/car-detail/car-detail?id=${id}`
    });
  },

  async grabCar(e) {
    const { id, stock } = e.currentTarget.dataset;
    
    if (stock <= 0) {
      showToast('已被抢光');
      return;
    }

    showLoading('抢购中...');

    setTimeout(() => {
      hideLoading();
      
      const success = Math.random() > 0.3;
      
      if (success) {
        showToast('抢购成功！', 'success');
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/car-detail/car-detail?id=${id}`
          });
        }, 1500);
      } else {
        showToast('手慢了，再试试！');
      }
    }, 2000);
  },

  shareCoupon() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    showToast('分享给好友一起抢');
  },

  onShareAppMessage() {
    return {
      title: '限时秒杀！特斯拉仅需199元/天',
      path: '/pages/flash-sale/flash-sale',
      imageUrl: this.data.flashCars[0].image
    };
  }
});
