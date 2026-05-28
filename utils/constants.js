export const CAR_TYPES = [
  { value: 'economic', label: '经济型' },
  { value: 'comfort', label: '舒适型' },
  { value: 'business', label: '商务型' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: '豪华型' },
  { value: 'newenergy', label: '新能源' }
];

export const FUEL_TYPES = [
  { value: 'gasoline', label: '汽油' },
  { value: 'diesel', label: '柴油' },
  { value: 'electric', label: '纯电' },
  { value: 'hybrid', label: '混动' }
];

export const TRANSMISSION_TYPES = [
  { value: 'auto', label: '自动' },
  { value: 'manual', label: '手动' }
];

export const SEAT_OPTIONS = [
  { value: '2', label: '2座' },
  { value: '4-5', label: '4-5座' },
  { value: '6-7', label: '6-7座' },
  { value: '7+', label: '7座以上' }
];

export const PRICE_RANGES = [
  { value: '0-100', label: '100元以下' },
  { value: '100-200', label: '100-200元' },
  { value: '200-500', label: '200-500元' },
  { value: '500-1000', label: '500-1000元' },
  { value: '1000+', label: '1000元以上' }
];

export const PROVIDER_TYPES = [
  { value: 'self', label: '自营' },
  { value: 'franchise', label: '加盟' }
];

export const ORDER_STATUS = {
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
};

export const PICKUP_METHODS = [
  { value: 'self', label: '门店自取' },
  { value: 'delivery', label: '送车上门' }
];

export const ADDITIONAL_SERVICES = [
  { id: 1, name: '基础保险', price: 50, unit: '/天', selected: true, desc: '车辆损失险、第三者责任险' },
  { id: 2, name: '全车盗抢险', price: 30, unit: '/天', selected: false, desc: '车辆被盗被抢保障' },
  { id: 3, name: '司机服务', price: 300, unit: '/天', selected: false, desc: '专业司机代驾服务' },
  { id: 4, name: 'GPS导航', price: 20, unit: '/天', selected: false, desc: '车载GPS导航设备' },
  { id: 5, name: '儿童座椅', price: 30, unit: '/天', selected: false, desc: '安全儿童座椅' },
  { id: 6, name: '道路救援', price: 15, unit: '/天', selected: true, desc: '24小时道路救援服务' }
];

export const COUPON_TYPES = {
  discount: { label: '折扣券', color: '#ff976a' },
  cash: { label: '代金券', color: '#ee0a24' },
  free: { label: '免租券', color: '#07c160' }
};

export const RENTAL_RULES = [
  '取车时需携带本人有效身份证、驾驶证',
  '驾驶证需满1年且在有效期内',
  '取车时需缴纳押金，还车后退还',
  '每日限驶200公里，超出部分按1元/公里计费',
  '请在预订时间内取还车，超时费用按小时计算',
  '严禁酒后驾驶、无证驾驶',
  '车辆仅限本人驾驶，不得转借他人',
  '如遇事故请第一时间联系客服'
];
