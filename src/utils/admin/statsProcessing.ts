
// Helper functions for processing admin dashboard statistics data

/**
 * Process registration data for different time periods
 */
export const processRegistrationData = (data: any[], period: string) => {
  if (!data) return [];

  const now = new Date();
  const result: { name: string; value: number }[] = [];

  switch (period) {
    case 'day':
      // Last 24 hours in 4-hour intervals
      for (let i = 0; i < 6; i++) {
        const hourLabel = i * 4;
        const intervalStart = new Date(now);
        intervalStart.setHours(now.getHours() - 24 + hourLabel);
        intervalStart.setMinutes(0);
        intervalStart.setSeconds(0);
        
        const intervalEnd = new Date(intervalStart);
        intervalEnd.setHours(intervalEnd.getHours() + 4);
        
        const count = data.filter(item => {
          const date = new Date(item.created_at);
          return date >= intervalStart && date < intervalEnd;
        }).length;
        
        result.push({ name: `${hourLabel}h`, value: count });
      }
      break;
    case 'week':
      // Days of the current week
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = now.getDay();
      
      for (let i = 0; i < 7; i++) {
        const dayIndex = (today - 6 + i + 7) % 7; // Calculate day index starting from a week ago
        const dayName = dayNames[dayIndex];
        
        const dayStart = new Date(now);
        dayStart.setDate(now.getDate() - 6 + i);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
        
        const count = data.filter(item => {
          const date = new Date(item.created_at);
          return date >= dayStart && date < dayEnd;
        }).length;
        
        result.push({ name: dayName, value: count });
      }
      break;
    case 'month':
      // Weeks of the current month
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 28 + (i * 7));
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        weekEnd.setHours(23, 59, 59, 999);
        
        const count = data.filter(item => {
          const date = new Date(item.created_at);
          return date >= weekStart && date < weekEnd;
        }).length;
        
        result.push({ name: `Week ${i + 1}`, value: count });
      }
      break;
    case 'year':
      // Months of the current year
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(now.getFullYear(), i, 1);
        const monthEnd = new Date(now.getFullYear(), i + 1, 0, 23, 59, 59, 999);
        
        const count = data.filter(item => {
          const date = new Date(item.created_at);
          return date >= monthStart && date <= monthEnd;
        }).length;
        
        result.push({ name: monthNames[i], value: count });
      }
      break;
    default:
      // Default to weekly if period is not recognized
      return processRegistrationData(data, 'week');
  }

  return result;
};

/**
 * Calculate growth rate between periods
 */
export const calculateGrowthRate = (data: any[], period: string) => {
  if (!data || data.length === 0) return 0;
  
  const now = new Date();
  let currentPeriodStart: Date;
  let previousPeriodStart: Date;
  
  switch (period) {
    case 'day':
      currentPeriodStart = new Date(now);
      currentPeriodStart.setHours(0, 0, 0, 0);
      previousPeriodStart = new Date(currentPeriodStart);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
      break;
    case 'week':
      currentPeriodStart = new Date(now);
      currentPeriodStart.setDate(now.getDate() - 7);
      previousPeriodStart = new Date(currentPeriodStart);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
      break;
    case 'month':
      currentPeriodStart = new Date(now);
      currentPeriodStart.setMonth(now.getMonth() - 1);
      previousPeriodStart = new Date(currentPeriodStart);
      previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
      break;
    case 'year':
      currentPeriodStart = new Date(now);
      currentPeriodStart.setFullYear(now.getFullYear() - 1);
      previousPeriodStart = new Date(currentPeriodStart);
      previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
      break;
    default:
      return 0;
  }
  
  const currentCount = data.filter(item => new Date(item.created_at) >= currentPeriodStart).length;
  const previousCount = data.filter(item => {
    const date = new Date(item.created_at);
    return date >= previousPeriodStart && date < currentPeriodStart;
  }).length;
  
  // Avoid division by zero
  if (previousCount === 0) return currentCount > 0 ? 100 : 0;
  
  return ((currentCount - previousCount) / previousCount) * 100;
};
