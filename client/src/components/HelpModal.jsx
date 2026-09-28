import React from 'react';
import { X, Command, BookOpen, Sparkles, Keyboard } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ K or Ctrl + K', description: 'Open Global Command Palette' },
    { key: '/', description: 'Quick jump to Search bar' },
    { key: 'Esc', description: 'Close modals or active popovers' }
  ];

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
          maxWidth: '540px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1.75rem',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <Keyboard size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.2rem' }}>Help & Keyboard Shortcuts</h2>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Keyboard Shortcuts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {shortcuts.map((sc, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)'
              }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{sc.description}</span>
                <kbd style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Product Documentation
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>TechQu</strong> turns customer questions into structured, searchable, and AI-optimized FAQs. Use <em>AI Studio</em> to generate new questions, improve existing phrasing, or analyze quality scores.
          </p>
        </div>
      </div>
    </div>
  );
}
