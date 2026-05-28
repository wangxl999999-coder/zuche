Component({
  properties: {
    car: {
      type: Object,
      value: {}
    },
    showDistance: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    goDetail() {
      wx.navigateTo({
        url: `/pages/car-detail/car-detail?id=${this.properties.car.id}`
      });
    }
  }
});
