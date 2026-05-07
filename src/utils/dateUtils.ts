export const getNextPaymentDate = (joinDateString: string): Date => {
  const joinDate = new Date(joinDateString);
  const now = new Date();
  
  // Target payment day of the current month
  let nextDate = new Date(now.getFullYear(), now.getMonth(), joinDate.getDate());
  
  // If today is past the payment day of this month, target next month
  if (now.getDate() > joinDate.getDate()) {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  // If it's a Friday (5), move to Saturday (6)
  if (nextDate.getDay() === 5) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  
  return nextDate;
};
