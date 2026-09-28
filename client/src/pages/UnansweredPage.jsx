import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { unansweredAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Inbox, Sparkles, Plus, Trash2, Clock, Search } from 'lucide-react';

export default function UnansweredPage() {
  const [unanswered, setUnanswered] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isCreator } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUnanswered();
  }, []);

  const fetchUnanswered = async () => {
    try {
      const res = await unansweredAPI.getAll();
      setUnanswered(res.unanswered || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWithAI = (queryText) => {
    navigate('/ai-studio');
  };

  const handleCreateFAQ = (queryText) => {
    navigate('/create');
  };

  const handleDismiss = async (id) => {
    try {
      await unansweredAPI.dismiss(id);
      showSuccess('Query dismissed from inbox.');
      setUnanswered(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      showError('Failed to dismiss question.');
    }
  };

  return (
    <div className="page-body animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Unanswered Question Inbox
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real search queries performed by users that didn't yield an existing FAQ answer. Turn demand into knowledge!
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading unanswered questions...</div>
      ) : unanswered.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Inbox size={40} style={{ marginBottom: '1rem' }} />
          <h3>All caught up! No unanswered search queries right now.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {unanswered.map(item => (
            <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                    <span className="badge badge-amber">
                      <Search size={12} /> {item.count || 1} User Searches
                    </span>
                    <span className="badge badge-blue">
                      {item.category || 'General'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    "{item.query}"
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Last searched: {new Date(item.lastSearched).toLocaleString()}
                  </div>
                </div>

                {isCreator && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleGenerateWithAI(item.query)} className="btn btn-secondary" style={{ fontSize: '0.8rem', borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)' }}>
                      <Sparkles size={14} /> Generate with AI
                    </button>
                    <button onClick={() => handleCreateFAQ(item.query)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                      <Plus size={14} /> Create FAQ
                    </button>
                    <button onClick={() => handleDismiss(item.id)} className="btn btn-ghost" style={{ color: 'var(--status-error)', fontSize: '0.8rem' }}>
                      <Trash2 size={14} /> Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
