import { showToast, copyText } from '../../utils/util.js';

Page({
  data: {
    inviteCode: 'ZC888888',
    inviteCount: 5,
    rewardAmount: 250,
    rules: [
      '每成功邀请1位好友注册并完成首次租车，您可获得50元优惠券',
      '被邀请好友注册即可获得100元新人礼包',
      '邀请人数越多，奖励越多，上不封顶',
      '优惠券有效期30天，请及时使用'
    ],
    myRewards: [
      { id: 1, name: '邀新奖励券', value: 50, status: 1, expireTime: '2024-07-15' },
      { id: 2, name: '邀新奖励券', value: 50, status: 1, expireTime: '2024-07-10' },
      { id: 3, name: '邀新奖励券', value: 50, status: 2, expireTime: '2024-06-20' },
      { id: 4, name: '邀新奖励券', value: 50, status: 2, expireTime: '2024-06-15' },
      { id: 5, name: '邀新奖励券', value: 50, status: 2, expireTime: '2024-06-10' }
    ],
    inviteRecords: [
      { id: 1, name: '张**', phone: '138****8888', reward: 50, time: '2024-06-01' },
      { id: 2, name: '李**', phone: '139****6666', reward: 50, time: '2024-05-28' },
      { id: 3, name: '王**', phone: '137****5555', reward: 50, time: '2024-05-20' },
      { id: 4, name: '赵**', phone: '136****4444', reward: 50, time: '2024-05-15' },
      { id: 5, name: '孙**', phone: '135****3333', reward: 50, time: '2024-05-10' }
    ]
  },

  onLoad() {
    this.generateInviteCode();
  },

  generateInviteCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 6; i > 0; --i) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    this.setData({ inviteCode: 'ZC' + code });
  },

  copyInviteCode() {
    copyText(this.data.inviteCode);
  },

  shareToFriend() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    showToast('选择好友分享');
  },

  sharePoster() {
    showToast('海报生成中...');
    
    setTimeout(() => {
      wx.previewImage({
        urls: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=car%20rental%20invitation%20poster%20with%20QR%20code&image_size=square'],
        current: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=car%20rental%20invitation%20poster%20with%20QR%20code&image_size=square'
      });
    }, 1000);
  },

  onShareAppMessage() {
    return {
      title: '租车出行，邀您来领100元新人礼包！',
      path: `/pages/index/index?inviteCode=${this.data.inviteCode}`,
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=car%20rental%20share%20image%20discount%20coupon&image_size=square'
    };
  },

  onShareTimeline() {
    return {
      title: '我用租车出行，邀请你一起来领100元新人礼包！',
      query: `inviteCode=${this.data.inviteCode}`,
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=car%20rental%20share%20image%20discount%20coupon&image_size=square'
    };
  }
});
