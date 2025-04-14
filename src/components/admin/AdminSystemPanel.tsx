
import React from 'react';

export const AdminSystemPanel = () => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">System Management</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>CPU Usage</span>
                <span className="text-green-500">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Memory Usage</span>
                <span className="text-green-500">24%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Disk Space</span>
                <span className="text-yellow-500">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>API Response Time</span>
                <span className="text-green-500">120ms</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Database Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Connection Status</span>
                <span className="text-green-500">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Tables</span>
                <span>5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Backup Status</span>
                <span className="text-green-500">Latest: Today 03:00 AM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Service Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border rounded p-3 flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
              <span>Authentication Service</span>
            </div>
            <div className="border rounded p-3 flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
              <span>Storage Service</span>
            </div>
            <div className="border rounded p-3 flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
              <span>API Gateway</span>
            </div>
            <div className="border rounded p-3 flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
              <span>Email Service</span>
            </div>
            <div className="border rounded p-3 flex items-center">
              <div className="h-3 w-3 rounded-full bg-yellow-500 mr-3"></div>
              <span>Analytics Service</span>
            </div>
            <div className="border rounded p-3 flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
              <span>Image Processing</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
