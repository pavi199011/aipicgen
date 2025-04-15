
import { useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface UserStatsProps {
  data: {
    totalUsers: number;
    growthRate: number;
    activeUsers: number;
    activeGrowthRate: number;
    dailyRegistrations: { name: string; value: number }[];
    weeklyRegistrations: { name: string; value: number }[];
    monthlyRegistrations: { name: string; value: number }[];
    yearlyRegistrations: { name: string; value: number }[];
  };
  period: string;
}

export function UserStats({ data, period }: UserStatsProps) {
  const chartData = useMemo(() => {
    switch (period) {
      case "day":
        return data.dailyRegistrations;
      case "week":
        return data.weeklyRegistrations;
      case "month":
        return data.monthlyRegistrations;
      case "year":
        return data.yearlyRegistrations;
      default:
        return data.weeklyRegistrations;
    }
  }, [data, period]);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={{ stroke: '#e2e8f0' }} 
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={{ stroke: '#e2e8f0' }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8b5cf6" 
            fillOpacity={1} 
            fill="url(#colorUsers)" 
            activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
