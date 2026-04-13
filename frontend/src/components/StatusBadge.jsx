import React from 'react';

const statusConfig = {
  new: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.2)]', label: 'New' },
  contacted: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_8px_rgba(234,179,8,0.2)]', label: 'Contacted' },
  qualified: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.2)]', label: 'Qualified' },
  converted: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]', label: 'Converted' },
  lost: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', label: 'Lost' }
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.new;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${config.color} transition-all`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.color.includes('blue') ? 'bg-blue-400' : config.color.includes('yellow') ? 'bg-yellow-400' : config.color.includes('purple') ? 'bg-purple-400' : config.color.includes('emerald') ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
      {config.label}
    </span>
  );
}
