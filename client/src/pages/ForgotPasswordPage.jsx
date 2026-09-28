import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showSuccess } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showSuccess('Password reset link sent to your email.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.25rem' }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        {!submitted ? (
          <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>Forgot Password</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Enter your email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.7rem' }}>
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 size={48} color="var(--status-success)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Check your email</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              We have sent password recovery instructions to <strong>{email}</strong>.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
              Resend link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
