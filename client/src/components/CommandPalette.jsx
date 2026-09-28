import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Plus,
  FolderKanban,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Star,
  Inbox,
  Users,
  X
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null; // handeled globally in App.jsx
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { title: 'Search Knowledge Base', category: 'Navigation', icon: Search, action: () => navigate('/search') },
    { title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/dashboard') },
    { title: 'Browse Knowledge Base', category: 'Navigation', icon: BookOpen, action: () => navigate('/knowledge') },
    { title: 'Open AI Studio', category: 'AI Tools', icon: Sparkles, action: () => navigate('/ai-studio') },
    { title: 'Create New FAQ', category: 'Actions', icon: Plus, action: () => navigate('/create') },
    { title: 'Manage Categories', category: 'Navigation', icon: FolderKanban, action: () => navigate('/categories') },
    { title: 'View Analytics', category: 'Navigation', icon: BarChart3, action: () => navigate('/analytics') },
    { title: 'Unanswered Questions Inbox', category: 'Actions', icon: Inbox, action: () => navigate('/unanswered') },
    { title: 'View Favorite FAQs', category: 'Navigation', icon: Star, action: () => navigate('/favorites') },
    { title: 'User Management', category: 'Admin', icon: Users, action: () => navigate('/users') },
    { title: 'Open Settings', category: 'Preferences', icon: Settings, action: () => navigate('/settings') },
    { title: `Toggle Theme (${theme === 'dark' ? 'Light Mode' : 'Dark Mode'})`, category: 'Preferences', icon: theme === 'dark' ? Sun : Moon, action: toggleTheme }
  ];

  const filtered = commands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'fadeIn 150ms ease-out'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.95rem'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => { item.action(); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background-color 100ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} color="var(--primary)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
