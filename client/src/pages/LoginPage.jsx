import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showSuccess('Signed in successfully!');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-app)' }}>
      {/* Left Branding Column */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--bg-sidebar)',
        color: '#FFFFFF',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid var(--border-color)'
      }} className="login-left-panel">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0099FF, #00D2FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#FFFFFF'
            }}>
              TQ
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFF' }}>TechQu</h2>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '1rem', color: '#FFF' }}>
            Your intelligent knowledge workspace.
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '440px', lineHeight: 1.6 }}>
            Organize customer FAQs, leverage AI generation, and improve support documentation effortlessly.
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '0.5rem' }}>
            ⚡ Quick Demo Accounts:
          </p>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            <strong>Admin:</strong> admin@faq.ai | Admin@123<br />
            <strong>Creator:</strong> sarah@faq.ai | Creator@123
          </div>
        </div>
      </div>

      {/* Right Login Card Column */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>Sign In</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  required
                />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.7rem' }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
