import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, MapPin, Calendar, MessageSquare, Trash2, Save, Loader2, Play } from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

export default function LeadDetail({ lead, isOpen, onClose, onUpdate, onDelete }) {
  const [internalLead, setInternalLead] = useState(lead);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [parsedNotes, setParsedNotes] = useState([]);

  useEffect(() => {
    setInternalLead(lead);
    setNewNote('');
    if (lead?.notes) {
      try {
        const parsed = JSON.parse(lead.notes);
        setParsedNotes(Array.isArray(parsed) ? parsed : [{ text: lead.notes, createdAt: lead.created_at }]);
      } catch (e) {
        setParsedNotes([{ text: lead.notes, createdAt: lead.created_at }]);
      }
    } else {
      setParsedNotes([]);
    }
  }, [lead]);

  if (!isOpen || !internalLead) return null;

  const handleChange = (e) => {
    setInternalLead(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setNoteLoading(true);
    try {
      const response = await client.patch(`/leads/${internalLead.id}/notes`, { text: newNote });
      setInternalLead(response.data);
      // Let the main table update it too
      onUpdate(internalLead.id, { notes: response.data.notes, status: internalLead.status });
      setNewNote('');
      toast.success('Note added to timeline');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setNoteLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(internalLead.id, { 
        status: internalLead.status, 
        notes: internalLead.notes 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      setDeleteLoading(true);
      try {
        await onDelete(internalLead.id);
        onClose();
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-[#0B0E14]/70 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#0F172A] shadow-2xl shadow-blue-900/20 z-50 flex flex-col animate-slide-in border-l border-slate-800">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold rounded-xl flex items-center justify-center text-lg shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              {internalLead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{internalLead.name}</h2>
              <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mt-0.5">Lead Details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-hidden">
          
          {/* Status Control */}
          <div className="glass-panel p-5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Status</label>
              <StatusBadge status={internalLead.status} />
            </div>
            <select
              name="status"
              value={internalLead.status}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2.5 text-sm bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Contact Info */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Contact Profiling
            </h3>
            <div className="space-y-5">
              <div className="flex items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                <Mail className="h-5 w-5 text-slate-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                  <a href={`mailto:${internalLead.email}`} className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    {internalLead.email}
                  </a>
                </div>
              </div>
              
              {internalLead.phone && (
                <div className="flex items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                  <Phone className="h-5 w-5 text-slate-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Phone</p>
                    <a href={`tel:${internalLead.phone}`} className="text-sm text-white hover:text-blue-300 transition-colors">
                      {internalLead.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {internalLead.company && (
                <div className="flex items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                  <Building2 className="h-5 w-5 text-slate-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Company</p>
                    <p className="text-sm text-white font-medium">{internalLead.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                <Calendar className="h-5 w-5 text-slate-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Inquiry Date</p>
                  <p className="text-sm text-white font-medium">
                    {format(new Date(internalLead.created_at), 'PPP ')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Original Message */}
          {internalLead.message && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" /> Initial Payload
              </h3>
              <div className="bg-slate-900 p-4 rounded-xl text-sm text-slate-300 italic border border-slate-800 shadow-inner">
                "{internalLead.message}"
              </div>
            </div>
          )}

          {/* Internal Notes Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Activity & Notes</h3>
            
            {/* Input Note */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 mb-4">
              <textarea
                name="newNote"
                rows={2}
                className="block w-full bg-transparent text-white placeholder-slate-600 focus:ring-0 focus:outline-none sm:text-sm resize-none mb-2"
                placeholder="Type a new update..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={noteLoading || !newNote.trim()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all flex items-center disabled:opacity-50"
                >
                  {noteLoading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                  Add Note
                </button>
              </div>
            </div>

            {/* List Notes */}
            <div className="space-y-3">
              {parsedNotes.length > 0 ? (
                parsedNotes.slice().reverse().map((n, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 border-l-2 border-l-blue-500 relative">
                    <p className="text-xs text-slate-500 mb-1">{format(new Date(n.createdAt), 'MMM d, yyyy h:mm a')}</p>
                    <p className="text-sm text-slate-300">{n.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-900/30 rounded-lg border border-slate-800/50 border-dashed">No notes added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="flex items-center text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-wider transition-colors py-2 px-3 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 disabled:opacity-50"
          >
            {deleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Purge
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 shadow-sm text-sm font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all flex items-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
