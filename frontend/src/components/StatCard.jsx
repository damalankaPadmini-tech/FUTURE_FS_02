import React from 'react';
import CircularProgress from './CircularProgress';

export default function StatCard({ title, value, icon, subtitle, colorClass, highlightGlow, progressParams }) {
  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
      {/* Decorative gradient glow if enabled */}
      {highlightGlow && (
        <div className={`absolute -right-10 -top-10 w-32 h-32 ${colorClass} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
      )}
      
      <div className="flex items-center justify-between relative z-10 h-full">
        <div className="flex flex-col justify-center h-full">
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          {!progressParams && (
            <>
              <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
              {subtitle && (
                <p className="text-xs font-medium mt-3 text-slate-500">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
        
        {progressParams ? (
          <CircularProgress 
            value={progressParams.value} 
            total={progressParams.total} 
            colorClass={colorClass} 
            size={100} 
            strokeWidth={8} 
          />
        ) : (
          <div className={`p-4 rounded-full bg-slate-800 ${colorClass} bg-opacity-20 flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
