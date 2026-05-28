Component({
  properties: {
    text: {
      type: String,
      value: '暂无数据'
    },
    image: {
      type: String,
      value: ''
    },
    showButton: {
      type: Boolean,
      value: false
    },
    buttonText: {
      type: String,
      value: '去看看'
    }
  },

  methods: {
    onButtonTap() {
      this.triggerEvent('buttontap');
    }
  }
});
