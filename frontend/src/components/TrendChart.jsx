import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendChart({ data }) {
  // Add some mock data if not provided
  const chartData = data || [
    { name: 'Jan', leads: 4000, revenue: 2400 },
    { name: 'Feb', leads: 3000, revenue: 1398 },
    { name: 'Mar', leads: 2000, revenue: 9800 },
    { name: 'Apr', leads: 2780, revenue: 3908 },
    { name: 'May', leads: 1890, revenue: 4800 },
    { name: 'Jun', leads: 2390, revenue: 3800 },
    { name: 'Jul', leads: 3490, revenue: 4300 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#151C2C] border border-slate-700 p-3 rounded-lg shadow-xl outline-none">
          <p className="text-slate-300 text-sm mb-1">{label}</p>
          <p className="text-blue-400 font-bold text-sm">Leads: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col group hover:border-slate-700 transition-all duration-300">
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-400 mb-1">Overview</p>
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center">
          Lead Engagement
        </h3>
      </div>
      <div className="flex-1 w-full relative min-h-[200px]">
        {/* Glow effect behind chart */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-blue-500/5 blur-3xl rounded-full"></div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="leads" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorLeads)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
