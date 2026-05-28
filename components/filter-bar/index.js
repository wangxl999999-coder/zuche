Component({
  properties: {
    filters: {
      type: Object,
      value: {}
    }
  },

  data: {
    showFilter: false,
    carTypes: [
      { value: '', label: '全部车型' },
      { value: 'economic', label: '经济型' },
      { value: 'comfort', label: '舒适型' },
      { value: 'business', label: '商务型' },
      { value: 'suv', label: 'SUV' },
      { value: 'luxury', label: '豪华型' },
      { value: 'newenergy', label: '新能源' }
    ],
    fuelTypes: [
      { value: '', label: '全部燃油' },
      { value: 'gasoline', label: '汽油' },
      { value: 'diesel', label: '柴油' },
      { value: 'electric', label: '纯电' },
      { value: 'hybrid', label: '混动' }
    ],
    transmissionTypes: [
      { value: '', label: '全部变速箱' },
      { value: 'auto', label: '自动' },
      { value: 'manual', label: '手动' }
    ],
    seatOptions: [
      { value: '', label: '全部座位' },
      { value: '2', label: '2座' },
      { value: '4-5', label: '4-5座' },
      { value: '6-7', label: '6-7座' },
      { value: '7+', label: '7座以上' }
    ],
    priceRanges: [
      { value: '', label: '不限价格' },
      { value: '0-100', label: '100元以下' },
      { value: '100-200', label: '100-200元' },
      { value: '200-500', label: '200-500元' },
      { value: '500-1000', label: '500-1000元' },
      { value: '1000+', label: '1000元以上' }
    ],
    providerTypes: [
      { value: '', label: '全部服务商' },
      { value: 'self', label: '自营' },
      { value: 'franchise', label: '加盟' }
    ],
    localFilters: {
      carType: '',
      fuelType: '',
      transmission: '',
      seats: '',
      priceRange: '',
      provider: ''
    }
  },

  methods: {
    toggleFilter() {
      this.setData({
        showFilter: !this.data.showFilter,
        localFilters: { ...this.properties.filters }
      });
    },

    selectFilter(e) {
      const { type, value } = e.currentTarget.dataset;
      this.setData({
        [`localFilters.${type}`]: this.data.localFilters[type] === value ? '' : value
      });
    },

    resetFilter() {
      this.setData({
        localFilters: {
          carType: '',
          fuelType: '',
          transmission: '',
          seats: '',
          priceRange: '',
          provider: ''
        }
      });
    },

    confirmFilter() {
      this.setData({ showFilter: false });
      this.triggerEvent('filter', this.data.localFilters);
    },

    closeFilter() {
      this.setData({ showFilter: false });
    }
  }
});
