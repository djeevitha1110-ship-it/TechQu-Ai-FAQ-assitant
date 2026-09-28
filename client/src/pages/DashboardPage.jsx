import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, faqAPI } from '../services/api';
import { StatCardSkeleton, TableRowSkeleton } from '../components/Skeleton';
import {
  BookOpen,
  FolderKanban,
  Sparkles,
  Search,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Inbox,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const { user, isCreator } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [stats, setStats] = useState(null);
  const [recentFaqs, setRecentFaqs] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, faqsRes, healthRes] = await Promise.all([
        analyticsAPI.getOverview().catch(() => ({ stats: { totalFaqs: 0, publishedFaqs: 0, totalCategories: 0, totalAiGenerated: 0, totalSearches: 0 } })),
        faqAPI.getAll({ sort: 'newest' }).catch(() => ({ faqs: [] })),
        analyticsAPI.getHealth().catch(() => ({ healthScore: 100, issues: { duplicates: 0, outdated: 0, shortAnswers: 0, unanswered: 0 } }))
      ]);

      setStats(analyticsRes.stats);
      setRecentFaqs((faqsRes.faqs || []).slice(0, 5));
      setHealth(healthRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await faqAPI.delete(id);
      showSuccess('FAQ deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      showError(err.message || 'Failed to delete FAQ.');
    }
  };

  const quickActions = [
    { title: 'Create FAQ', desc: 'Add a new manual FAQ item', icon: Plus, path: '/create', creatorOnly: true },
    { title: 'Generate with AI', desc: 'Create instantly from topic', icon: Sparkles, path: '/ai-studio', creatorOnly: true },
    { title: 'Search Knowledge', desc: 'Find answers with smart search', icon: Search, path: '/search' },
    { title: 'Manage Categories', desc: 'Organize topics and badges', icon: FolderKanban, path: '/categories' }
  ];

  return (
    <div className="page-body animate-fade-in">
      {/* Header Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Good morning, {user?.name || 'Workspace User'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Here’s what’s happening with your knowledge base today.
          </p>
        </div>

        {isCreator && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/create')} className="btn btn-primary">
              <Plus size={18} /> Create FAQ
            </button>
            <button onClick={() => navigate('/ai-studio')} className="btn btn-secondary" style={{ borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)' }}>
              <Sparkles size={18} /> AI Generate
            </button>
          </div>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total FAQs</span>
                <BookOpen size={20} color="var(--primary)" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.35rem' }}>{stats?.totalFaqs || 0}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--status-success)' }}>
                <TrendingUp size={14} /> {stats?.publishedFaqs || 0} Published
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Categories</span>
                <FolderKanban size={20} color="var(--status-warning)" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.35rem' }}>{stats?.totalCategories || 0}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active knowledge domains</span>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>AI Generated</span>
                <Sparkles size={20} color="var(--accent-teal)" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.35rem' }}>{stats?.totalAiGenerated || 0}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)' }}>Smart assistance generated</span>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Searches Performed</span>
                <Search size={20} color="var(--status-info)" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.35rem' }}>{stats?.totalSearches || 0}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-info)' }}>Live search queries</span>
            </div>
          </>
        )}
      </div>

      {/* Knowledge Health Banner */}
      {health && (
        <div className="card" style={{
          marginBottom: '2rem',
          backgroundColor: 'var(--primary-light)',
          border: '1px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              {health.healthScore}%
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>Knowledge Health Score</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {health.issues.unanswered > 0
                  ? `${health.issues.unanswered} unanswered search queries require your attention.`
                  : 'Your FAQ knowledge base is well optimized and up to date.'}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/unanswered')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Review Issues ({health.issues.unanswered})
          </button>
        </div>
      )}

      {/* Quick Actions Grid */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {quickActions.map((action, idx) => {
          if (action.creatorOnly && !isCreator) return null;
          const Icon = action.icon;
          return (
            <div
              key={idx}
              className="card card-hover"
              onClick={() => navigate(action.path)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}
            >
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)'
              }}>
                <Icon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem' }}>{action.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{action.desc}</p>
              </div>
              <ArrowUpRight size={18} color="var(--text-muted)" />
            </div>
          );
        })}
      </div>

      {/* Recent FAQs Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Recently Updated FAQs</h2>
        <button onClick={() => navigate('/knowledge')} className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
          View All Knowledge →
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1.25rem' }}>Question</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Author</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Updated</th>
              <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : recentFaqs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No FAQs created yet. Click "+ Create FAQ" to get started.
                </td>
              </tr>
            ) : (
              recentFaqs.map((faq) => (
                <tr key={faq.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    <span
                      onClick={() => navigate(`/knowledge/${faq.id}`)}
                      style={{ cursor: 'pointer', hover: { color: 'var(--primary)' } }}
                    >
                      {faq.question}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className="badge badge-blue">{faq.categoryName || 'General'}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                    {faq.authorName || 'Admin'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(faq.updatedAt || faq.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button onClick={() => navigate(`/knowledge/${faq.id}`)} className="btn btn-ghost btn-icon" title="View">
                        <Eye size={16} />
                      </button>
                      {isCreator && (
                        <>
                          <button onClick={() => navigate(`/edit/${faq.id}`)} className="btn btn-ghost btn-icon" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteFaq(faq.id)} className="btn btn-ghost btn-icon" style={{ color: 'var(--status-error)' }} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
