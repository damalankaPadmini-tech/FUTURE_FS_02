import React, { useState } from 'react';
import client from '../api/client';
import { toast } from 'react-toastify';
import { Send, User, Mail, Phone, Building2, MessageSquare, Loader2, Hexagon } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/leads', { ...formData, source: 'website' });
      toast.success("Connection Established. We will be in touch shortly.");
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Transmission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.15),rgba(255,255,255,0))] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 flex flex-col items-center">
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-purple-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative h-16 w-16 bg-[#0F172A] border border-purple-500/30 rounded-2xl flex items-center justify-center">
            <Hexagon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Initiate Contact
          </h2>
          <p className="mt-4 text-sm text-slate-400 font-bold uppercase tracking-widest">
            Transmit your inquiry to our systems
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="glass-panel py-8 px-4 border border-slate-800 sm:rounded-3xl sm:px-10 animate-fade-in relative overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.1)]">
          
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
          
          <form className="space-y-6 relative z-10 p-2" onSubmit={handleSubmit}>
            
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
                    id="name"
                    required
                    className="block w-full pl-12 pr-3 py-3.5 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all shadow-inner"
                    placeholder="John Doe"
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
                    id="email"
                    required
                    className="block w-full pl-12 pr-3 py-3.5 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all shadow-inner"
                    placeholder="entity@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number <span className="text-slate-600 font-normal lowercase">(optional)</span></label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="block w-full pl-12 pr-3 py-3.5 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all shadow-inner"
                    placeholder="[Optional]"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Company <span className="text-slate-600 font-normal lowercase">(optional)</span></label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    className="block w-full pl-12 pr-3 py-3.5 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all shadow-inner"
                    placeholder="[Optional]"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Payload Data</label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-slate-500" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="block w-full pl-12 pr-3 py-3.5 bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 sm:text-sm resize-none transition-all shadow-inner"
                  placeholder="Enter transmission data..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] text-sm font-bold uppercase tracking-widest text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0E14] focus:ring-purple-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  <Send className="h-5 w-5 mr-3" />
                )}
                Transmit Query
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
