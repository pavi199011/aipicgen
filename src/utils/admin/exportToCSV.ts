
/**
 * Utility function to export data as CSV
 */

/**
 * Convert data to CSV string format
 */
export const convertToCSV = (data: any[], headers: Record<string, string>) => {
  if (!data || !data.length) return '';
  
  // Extract the column names from headers object
  const headerRow = Object.values(headers).join(',');
  
  // Map the keys from headers to the actual data properties
  const rows = data.map(item => {
    return Object.keys(headers)
      .map(key => {
        // Handle special cases like nested objects, arrays, etc.
        let value = item[key];
        
        // Convert objects and arrays to JSON strings
        if (value !== null && typeof value === 'object') {
          value = JSON.stringify(value);
        }
        
        // Handle undefined or null values
        if (value === undefined || value === null) {
          value = '';
        }
        
        // Escape commas and quotes in the value
        value = String(value).replace(/"/g, '""');
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`;
        }
        
        return value;
      })
      .join(',');
  });
  
  // Combine header row and data rows
  return [headerRow, ...rows].join('\n');
};

/**
 * Download data as a CSV file
 */
export const downloadCSV = (csvString: string, filename: string) => {
  // Create a blob with the CSV data
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link element and simulate a click to download the file
  const link = document.createElement('a');
  
  // Check if browser supports download attribute
  if (link.download !== undefined) {
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export dashboard stats to CSV
 */
export const exportDashboardStats = (stats: any, period: string) => {
  if (!stats) return;
  
  // User growth data
  let registrationData;
  switch (period) {
    case 'day':
      registrationData = stats.users.dailyRegistrations;
      break;
    case 'week':
      registrationData = stats.users.weeklyRegistrations;
      break;
    case 'month':
      registrationData = stats.users.monthlyRegistrations;
      break;
    case 'year':
      registrationData = stats.users.yearlyRegistrations;
      break;
    default:
      registrationData = stats.users.weeklyRegistrations;
  }
  
  // Format user growth data for CSV
  const usersCSV = convertToCSV(registrationData, {
    name: 'Period',
    value: 'New Users'
  });
  
  // Format content types data for CSV
  const contentCSV = convertToCSV(stats.content.contentTypes, {
    name: 'Content Type',
    value: 'Count'
  });
  
  // Format activity data for CSV
  const activityCSV = convertToCSV(stats.activityData, {
    timestamp: 'Timestamp',
    type: 'Activity Type',
    action: 'Action',
    user: 'User'
  });
  
  // Download each CSV
  downloadCSV(usersCSV, `user-growth-${period}-${new Date().toISOString().split('T')[0]}.csv`);
  downloadCSV(contentCSV, `content-distribution-${new Date().toISOString().split('T')[0]}.csv`);
  downloadCSV(activityCSV, `recent-activity-${new Date().toISOString().split('T')[0]}.csv`);
};
