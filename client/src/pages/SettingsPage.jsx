import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';
import { User, Lock, Moon, Sun, Sparkles, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Security form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // AI Preferences
  const [defaultTone, setDefaultTone] = useState('Professional');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateProfile({ name, avatar });
      updateUserProfile(res.user);
      showSuccess('Profile updated successfully.');
    } catch (err) {
      showError(err.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showError('New passwords do not match.');
      return;
    }
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      showSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      showError(err.message || 'Failed to change password.');
    }
  };

  return (
    <div className="page-body animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your account profile, security credentials, appearance, and AI preferences.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'profile' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <User size={18} /> Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'security' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'security' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Lock size={18} /> Security
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'appearance' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'appearance' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'appearance' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Moon size={18} /> Appearance
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>Personal Information</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                readOnly
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar Image URL</label>
              <input
                type="text"
                className="form-input"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Save size={16} /> Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Theme Settings</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Choose your workspace visual experience.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div
              onClick={() => theme !== 'light' && toggleTheme()}
              className="card card-hover"
              style={{
                cursor: 'pointer',
                borderColor: theme === 'light' ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                padding: '1.25rem',
                borderWidth: theme === 'light' ? '2px' : '1px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Sun size={20} color="#2563EB" />
                <span style={{ fontWeight: 600 }}>Professional White Theme</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Ultra-clean white background with sharp slate typography</p>
            </div>

            <div
              onClick={() => theme !== 'dark' && toggleTheme()}
              className="card card-hover"
              style={{
                cursor: 'pointer',
                borderColor: theme === 'dark' ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: '#030712',
                color: '#F8FAFC',
                padding: '1.25rem',
                borderWidth: theme === 'dark' ? '2px' : '1px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Moon size={20} color="#00D2FF" />
                <span style={{ fontWeight: 600 }}>CyberBlue & Black Theme</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Deep pitch-black background with electric CyberBlue accents</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
