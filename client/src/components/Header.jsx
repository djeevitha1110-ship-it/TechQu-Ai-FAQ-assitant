import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Plus,
  Sparkles,
  Sun,
  Moon,
  Bell,
  Menu,
  User,
  LogOut,
  HelpCircle,
  Command
} from 'lucide-react';

export default function Header({ onOpenCommandPalette, onToggleMobile, onOpenHelp }) {
  const { user, logout, isCreator } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 800,
      transition: 'background-color var(--transition-normal)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleMobile}
          className="btn btn-ghost btn-icon"
          style={{ display: 'none' }} // Visible on mobile via CSS
          aria-label="Open Navigation Drawer"
        >
          <Menu size={20} />
        </button>

        {/* Global Command Palette Trigger Button */}
        <button
          onClick={onOpenCommandPalette}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            minWidth: '240px'
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <span style={{ flex: 1, textAlign: 'left' }}>Search knowledge or type command...</span>
          <kbd style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            fontWeight: 600
          }}>
            ⌘K
          </kbd>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isCreator && (
          <>
            <button
              onClick={() => navigate('/create')}
              className="btn btn-primary"
              style={{ fontSize: '0.825rem', padding: '0.45rem 0.9rem' }}
            >
              <Plus size={16} />
              Create FAQ
            </button>
            <button
              onClick={() => navigate('/ai-studio')}
              className="btn btn-secondary"
              style={{ fontSize: '0.825rem', padding: '0.45rem 0.9rem', borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)' }}
            >
              <Sparkles size={16} />
              AI Studio
            </button>
          </>
        )}

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Aqua Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={19} color="#FBBF24" /> : <Moon size={19} color="#2563EB" />}
        </button>

        {/* User Profile Dropdown Menu */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid var(--border-color)', objectFit: 'cover' }}
              />
            </button>

            {showProfileMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '220px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem 0',
                  zIndex: 1000
                }}
              >
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</p>
                </div>
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, padding: '0.5rem 1rem' }}
                >
                  <User size={16} /> Profile & Settings
                </button>
                <button
                  onClick={onOpenHelp}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, padding: '0.5rem 1rem' }}
                >
                  <HelpCircle size={16} /> Keyboard Shortcuts
                </button>
                <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />
                <button
                  onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, padding: '0.5rem 1rem', color: 'var(--status-error)' }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
