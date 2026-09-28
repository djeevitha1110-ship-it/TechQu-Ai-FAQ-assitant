import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ShareModal({ isOpen, onClose, faq }) {
  const [copied, setCopied] = useState(false);
  const { showSuccess } = useToast();

  if (!isOpen || !faq) return null;

  const shareUrl = `${window.location.origin}/knowledge/${faq.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showSuccess('Public FAQ link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
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
          maxWidth: '480px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Share2 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem' }}>Share FAQ</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Share this FAQ with users or team members. Anyone with this link can view the answer.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-app)',
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem'
        }}>
          <Globe size={16} color="var(--text-muted)" />
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }}
          />
          <button onClick={handleCopy} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
