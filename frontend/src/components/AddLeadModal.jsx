import React, { useState } from 'react';
import { X, User, Mail, Phone, Building2, MessageSquare, Loader2, Save } from 'lucide-react';
import client from '../api/client';
import { toast } from 'react-toastify';

export default function AddLeadModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    status: 'new',
    source: 'Website Form'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/leads', { ...formData });
      toast.success('Lead added successfully!');
      setFormData({ name: '', email: '', phone: '', company: '', message: '', status: 'new', source: 'Website Form' });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-[#0B0E14]/80 backdrop-blur-sm z-[60] transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 animate-fade-in pointer-events-none">
        <div className="glass-panel w-full max-w-2xl bg-[#0F172A] rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.15)] border border-slate-700 pointer-events-auto flex flex-col max-h-full overflow-hidden relative">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center">
              Add New Lead
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 scroll-hidden">
            <form id="add-lead-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="mt-2 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      className="block w-full pl-12 pr-3 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="mt-2 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      className="block w-full pl-12 pr-3 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                  <div className="mt-2 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      className="block w-full pl-12 pr-3 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Optional"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Company</label>
                  <div className="mt-2 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      name="company"
                      className="block w-full pl-12 pr-3 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Optional"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="source" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Source</label>
                  <div className="mt-2">
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-10 py-3 text-sm bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="Website Form">Website Form</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Referral">Referral</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Cold Call">Cold Call</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 pb-2 mb-3">Initial Notes/Message</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute top-3 left-4 flex items-start pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-slate-500" />
                  </div>
                  <textarea
                    name="message"
                    rows={3}
                    className="block w-full pl-12 pr-3 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                    placeholder="Enter any initial information or requests..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 shadow-sm text-sm font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-lead-form"
              disabled={loading}
              className="px-4 py-2 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0E14] focus:ring-blue-500 transition-all flex items-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Lead
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
