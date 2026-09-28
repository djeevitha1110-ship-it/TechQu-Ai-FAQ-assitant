import React from 'react';
import { X, History, RotateCcw, Clock, User } from 'lucide-react';
import { faqAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function VersionHistoryModal({ isOpen, onClose, faq, onVersionRestored }) {
  const { showSuccess, showError } = useToast();

  if (!isOpen || !faq) return null;

  const versions = faq.versions || [];

  const handleRestore = async (versionNumber) => {
    try {
      const res = await faqAPI.restoreVersion(faq.id, versionNumber);
      showSuccess(res.message || `Restored version v${versionNumber}!`);
      onVersionRestored && onVersionRestored(res.faq);
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to restore version.');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1.5rem',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem' }}>Revision History</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Showing past answer revisions for: <strong>{faq.question}</strong>
        </p>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {versions.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No previous revisions recorded for this FAQ.
            </div>
          ) : (
            versions.slice().reverse().map((ver, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-blue">v{ver.version}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {ver.updatedBy || 'Contributor'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {new Date(ver.date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleRestore(ver.version)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <RotateCcw size={12} /> Restore
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  "{ver.summary || 'Answer updated'}"
                </p>
                <div style={{
                  fontSize: '0.825rem',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {ver.answer}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
