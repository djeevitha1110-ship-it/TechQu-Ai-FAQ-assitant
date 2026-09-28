import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { Clock, User, Sparkles, BookOpen, FolderKanban, Search, Trash2, Edit } from 'lucide-react';

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getActivity().then(res => {
      setActivities(res.activities || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getActionIcon = (action) => {
    if (action.includes('AI')) return <Sparkles size={16} color="var(--accent-teal)" />;
    if (action.includes('created')) return <BookOpen size={16} color="var(--status-success)" />;
    if (action.includes('updated')) return <Edit size={16} color="var(--primary)" />;
    if (action.includes('deleted')) return <Trash2 size={16} color="var(--status-error)" />;
    if (action.includes('Category')) return <FolderKanban size={16} color="var(--status-warning)" />;
    return <Search size={16} color="var(--text-muted)" />;
  };

  return (
    <div className="page-body animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Activity Timeline</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Chronological record of recent modifications, FAQ creations, AI generations, and user searches.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading activity log...</div>
      ) : activities.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No recent activity logged yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map(act => (
            <div key={act.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-color)'
              }}>
                {getActionIcon(act.action)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{act.user}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{act.action}</span>: "{act.target}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
