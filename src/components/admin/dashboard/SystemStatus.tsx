
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SystemStatus = () => {
  const statusMetrics = [
    { name: "CPU Usage", value: 28, color: "bg-blue-500" },
    { name: "Memory Usage", value: 42, color: "bg-green-500" },
    { name: "Storage Usage", value: 78, color: "bg-amber-500" },
    { name: "API Response Time", value: 156, unit: "ms", displayValue: "156ms", barWidth: 15, color: "bg-purple-500" }
  ];

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusMetrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{metric.name}</span>
                <span className="text-sm font-medium">
                  {metric.displayValue || `${metric.value}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${metric.color} h-2 rounded-full`} 
                  style={{ width: `${metric.barWidth || metric.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
