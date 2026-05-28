Component({
  properties: {
    order: {
      type: Object,
      value: {}
    }
  },

  data: {
    statusMap: {
      0: { label: '待支付', color: '#ff976a' },
      1: { label: '待取车', color: '#1989fa' },
      2: { label: '待签署合同', color: '#ff976a' },
      3: { label: '待验车', color: '#ff976a' },
      4: { label: '租用中', color: '#07c160' },
      5: { label: '待还车', color: '#1989fa' },
      6: { label: '还车验车中', color: '#ff976a' },
      7: { label: '结算中', color: '#ff976a' },
      8: { label: '待评价', color: '#1989fa' },
      9: { label: '已完成', color: '#07c160' },
      10: { label: '已取消', color: '#999' },
      11: { label: '已退款', color: '#999' }
    }
  },

  methods: {
    goDetail() {
      wx.navigateTo({
        url: `/pages/order-detail/order-detail?id=${this.properties.order.id}`
      });
    }
  }
});
