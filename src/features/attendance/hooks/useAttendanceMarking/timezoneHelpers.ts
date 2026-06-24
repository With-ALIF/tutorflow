// Timezone & past dates helpers
export const getGmt6Basis = (): Date => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  // Add 6 hours for Bangladesh Standard Time (GMT+6)
  return new Date(utc + (3600000 * 6));
};

export const getPastDatesList = () => {
  const base = getGmt6Basis();
  const list = [];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let i = 1; i <= 3; i++) {
    const past = new Date(base.getTime() - i * 24 * 60 * 60 * 1000);
    const dStr = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, '0')}-${String(past.getDate()).padStart(2, '0')}`;
    const dName = daysOfWeek[past.getDay()];
    list.push({ date: dStr, dayName: dName });
  }
  return list;
};
