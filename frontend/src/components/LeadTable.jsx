import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import StatusBadge from './StatusBadge';
import { ChevronRight, Database, ArrowUp, ArrowDown } from 'lucide-react';

export default function LeadTable({ leads, onRowClick, loading }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = React.useMemo(() => {
    if (!leads) return [];
    let sortableLeads = [...leads];
    if (sortConfig.key !== null) {
      sortableLeads.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle nested or complex comparisons
        if (sortConfig.key === 'created_at') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLeads;
  }, [leads, sortConfig]);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4 w-full max-w-lg">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-slate-800 rounded col-span-2"></div>
                <div className="h-4 bg-slate-800 rounded col-span-1"></div>
              </div>
              <div className="h-4 bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center h-64 border border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-full mb-4 border border-slate-700">
          <Database className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No leads found</h3>
        <p className="text-slate-400 text-sm">
          Try expanding your search or wait for new inquiries.
        </p>
      </div>
    );
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline-block" /> : <ArrowDown className="h-3 w-3 ml-1 inline-block" />;
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
      <div className="overflow-x-auto scroll-hidden">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-[#0B0E14]/80">
            <tr>
              <th scope="col" onClick={() => handleSort('name')} className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors">
                Name / Email <SortIcon columnKey="name" />
              </th>
              <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Company
              </th>
              <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Source
              </th>
              <th scope="col" onClick={() => handleSort('status')} className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors">
                Status <SortIcon columnKey="status" />
              </th>
              <th scope="col" onClick={() => handleSort('created_at')} className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors">
                Received <SortIcon columnKey="created_at" />
              </th>
              <th scope="col" className="relative px-6 py-5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-[#0F172A]/40">
            {sortedLeads.map((lead) => (
              <tr 
                key={lead.id} 
                onClick={() => onRowClick(lead)}
                className="hover:bg-slate-800/40 cursor-pointer transition-all duration-200 group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-sm">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{lead.name}</div>
                      <div className="text-sm text-slate-500">{lead.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{lead.company || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
                    {lead.source || 'Website'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-blue-500/10 ml-auto transition-colors">
                    <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
