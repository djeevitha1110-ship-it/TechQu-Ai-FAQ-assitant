import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Sparkles, X } from 'lucide-react';

export default function GoogleSignInButton({ text = "Sign in with Google", onSuccessRedirect = "/dashboard" }) {
  const { loginWithGoogle } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Demo Google accounts for quick zero-config 1-click sign in testing
  const demoAccounts = [
    { name: 'Alex Rivera', email: 'alex.rivera@gmail.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sarah Chen (Google Creator)', email: 'sarah.chen@google.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { name: 'David Miller (Enterprise Admin)', email: 'david.miller@techqu.io', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
  ];

  const handleGoogleAuth = async (accountData) => {
    setLoading(true);
    try {
      await loginWithGoogle(accountData);
      showSuccess(`Signed in with Google as ${accountData.name || accountData.email}!`);
      setShowPicker(false);
      navigate(onSuccessRedirect);
    } catch (err) {
      showError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMainClick = () => {
    // Show Google Account choice picker modal for instant seamless auth
    setShowPicker(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleMainClick}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '0.65rem 1.25rem',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          boxShadow: 'var(--shadow-sm)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.backgroundColor = 'var(--primary-light)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.backgroundColor = 'var(--bg-card)';
        }}
      >
        {/* SVG Google G Logo */}
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 10.03 0 12s.46 3.82 1.26 5.42l4.02-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
        </svg>
        <span>{loading ? 'Connecting Google...' : text}</span>
      </button>

      {/* Google Sign In Account Selection Modal */}
      {showPicker && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '420px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 10.03 0 12s.46 3.82 1.26 5.42l4.02-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Choose a Google Account</h3>
              </div>
              <button
                onClick={() => setShowPicker(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Select an account to continue to <strong>TechQu Workspace</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {demoAccounts.map((acc, index) => (
                <div
                  key={index}
                  onClick={() => handleGoogleAuth(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-app)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.email}
                    </div>
                  </div>
                  <UserCheck size={16} color="var(--primary)" />
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                const customEmail = e.target.elements.customEmail.value;
                if (customEmail) {
                  handleGoogleAuth({
                    email: customEmail,
                    name: customEmail.split('@')[0],
                    picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customEmail)}`
                  });
                }
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  Or use another Google email address:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    name="customEmail"
                    type="email"
                    className="form-input"
                    placeholder="user@gmail.com"
                    required
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
