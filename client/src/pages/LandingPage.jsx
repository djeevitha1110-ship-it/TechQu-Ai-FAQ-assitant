import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Search,
  FolderKanban,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', color: 'var(--text-main)' }}>
      {/* Navbar */}
      <nav style={{
        height: '70px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        backgroundColor: 'var(--bg-card)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4F46E5, #38BDF8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#FFF'
          }}>
            TQ
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              TechQu
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Go to Workspace <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-ghost">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-primary">
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '5rem 2rem 3rem 2rem', textAlign: 'center', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.4rem 1rem',
          borderRadius: '99px',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          border: '1px solid var(--primary)'
        }}>
          <Sparkles size={16} />
          Create. Discover. Improve. — Your intelligent knowledge workspace.
        </div>

        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
          Turn questions into <span style={{ color: 'var(--primary)' }}>organized knowledge.</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 2.25rem auto', lineHeight: 1.6 }}>
          Create, manage, search and improve your FAQ knowledge base with intelligent AI assistance. Built for support teams, SaaS companies, and knowledge managers.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
            Get Started Free <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/knowledge')} className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
            Explore Knowledge Base
          </button>
        </div>

        {/* Dashboard Preview Visual */}
        <div className="card" style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          backgroundColor: 'var(--bg-card)',
          textAlign: 'left',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TechQu Workspace Dashboard</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="card" style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total FAQs</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>342</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-success)' }}>+12 this month</span>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Categories</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>8</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Structured topics</span>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI Generated</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>128</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)' }}>+18% efficiency</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <Search size={16} />
              <span>Search result for: "How do I reset my password?"</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Everything you need for knowledge management</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Designed for speed, clarity, and precision.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <Sparkles size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>AI Studio</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Generate FAQs instantly from topics, improve answer clarity, and analyze quality scores.</p>
            </div>
            <div className="card">
              <Search size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Smart Search</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Keyword & semantic search with term highlighting and unanswered query logging.</p>
            </div>
            <div className="card">
              <ShieldCheck size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Duplicate Detection</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Automatic detection of similar existing questions to prevent knowledge base duplication.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
