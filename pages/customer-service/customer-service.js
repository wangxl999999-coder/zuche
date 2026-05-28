import { makePhoneCall, copyText } from '../../utils/util.js';

Page({
  data: {
    phone: '400-888-8888',
    workTime: '09:00 - 21:00',
    wechat: 'zuchekefu001',
    faqs: [
      {
        question: '如何取车？',
        answer: '您可以选择门店自取或送车上门。门店自取需携带本人身份证和驾驶证到指定门店；送车上门我们会将车辆送到您指定的地址。',
        expanded: false
      },
      {
        question: '押金如何退还？',
        answer: '还车验车完成后，押金将在7个工作日内原路退还。如有违章或车辆损坏，会扣除相应费用后退还剩余部分。',
        expanded: false
      },
      {
        question: '可以提前还车吗？',
        answer: '可以提前还车，但已支付的租金不予退还。建议您根据实际需求选择合适的租期。',
        expanded: false
      },
      {
        question: '超时还车如何收费？',
        answer: '超时1小时内不收费；超时1-4小时按小时计费；超时4小时以上按1天计费。具体费用以车型为准。',
        expanded: false
      },
      {
        question: '车辆出现故障怎么办？',
        answer: '请第一时间联系客服400-888-8888，我们会安排救援服务。如因车辆本身问题，救援费用由我们承担。',
        expanded: false
      },
      {
        question: '可以异地还车吗？',
        answer: '目前支持同城内不同门店还车，异地还车服务暂未开通，敬请期待。',
        expanded: false
      }
    ]
  },

  callPhone() {
    makePhoneCall(this.data.phone);
  },

  copyWechat() {
    copyText(this.data.wechat);
  },

  copyPhone() {
    copyText(this.data.phone);
  },

  toggleFaq(e) {
    const { index } = e.currentTarget.dataset;
    const faqs = [...this.data.faqs];
    faqs[index].expanded = !faqs[index].expanded;
    this.setData({ faqs });
  },

  goRepair() {
    wx.navigateTo({
      url: '/pages/repair/repair'
    });
  }
});
