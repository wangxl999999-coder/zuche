export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
};

export const formatDateTime = (date) => {
  return formatDate(date, 'YYYY-MM-DD HH:mm');
};

export const getDaysDiff = (start, end) => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diff = endTime - startTime;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getHoursDiff = (start, end) => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diff = endTime - startTime;
  return Math.ceil(diff / (1000 * 60 * 60));
};

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const getWeekDay = (date) => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const d = new Date(date);
  return days[d.getDay()];
};

export const getTimeSlots = (startHour = 0, endHour = 24, interval = 1) => {
  const slots = [];
  for (let i = startHour; i < endHour; i += interval) {
    slots.push(`${String(i).padStart(2, '0')}:00`);
  }
  return slots;
};

export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return today.toDateString() === d.toDateString();
};

export const isTomorrow = (date) => {
  const tomorrow = addDays(new Date(), 1);
  const d = new Date(date);
  return tomorrow.toDateString() === d.toDateString();
};
