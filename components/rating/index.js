Component({
  properties: {
    value: {
      type: Number,
      value: 5
    },
    max: {
      type: Number,
      value: 5
    },
    readonly: {
      type: Boolean,
      value: true
    },
    size: {
      type: String,
      value: '32rpx'
    },
    color: {
      type: String,
      value: '#ff976a'
    },
    voidColor: {
      type: String,
      value: '#eee'
    }
  },

  data: {
    stars: []
  },

  lifetimes: {
    attached() {
      this.initStars();
    }
  },

  observers: {
    'value': function() {
      this.initStars();
    }
  },

  methods: {
    initStars() {
      const stars = [];
      for (let i = 1; i <= this.properties.max; i++) {
        stars.push({
          index: i,
          active: i <= this.properties.value
        });
      }
      this.setData({ stars });
    },

    selectStar(e) {
      if (this.properties.readonly) return;
      const index = e.currentTarget.dataset.index;
      this.setData({ value: index });
      this.initStars();
      this.triggerEvent('change', { value: index });
    }
  }
});
