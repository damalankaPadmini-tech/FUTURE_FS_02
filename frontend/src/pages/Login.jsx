import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { toast } from 'react-toastify';
import { KeyRound, Mail, Loader2, Hexagon } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await client.post('/auth/login', { email, password });
      localStorage.setItem('jwt_token', response.data.token);
      toast.success('Authentication Authorized.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-3xl border border-slate-800 shadow-[0_0_50px_rgba(59,130,246,0.1)] animate-fade-in relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative group mb-6">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative h-16 w-16 bg-[#0F172A] border border-blue-500/30 rounded-2xl flex items-center justify-center">
              <Hexagon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Delta<span className="text-blue-500">X</span> Access
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400 uppercase tracking-widest font-bold">
            Secure Administrator Portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-12 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all shadow-inner"
                placeholder="Secure Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-12 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all shadow-inner"
                placeholder="Access Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border-none text-sm font-bold uppercase tracking-wider rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0E14] focus:ring-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Establish Connection'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
