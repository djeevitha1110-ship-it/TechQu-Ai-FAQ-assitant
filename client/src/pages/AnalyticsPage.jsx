import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { StatCardSkeleton } from '../components/Skeleton';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Search,
  FolderKanban,
  Sparkles,
  PieChart,
  Eye
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsAPI.getOverview();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Knowledge Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Insights into FAQ distribution, search volume, top topics, and knowledge base performance.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="card">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total FAQs</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.25rem 0' }}>{data?.stats?.totalFaqs || 0}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-success)' }}>Published Knowledge</span>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Searches</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.25rem 0' }}>{data?.stats?.totalSearches || 0}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-info)' }}>Search Query Queries</span>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>AI Generations</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.25rem 0' }}>{data?.stats?.totalAiGenerated || 0}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)' }}>AI Assisted Content</span>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Unanswered Queries</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.25rem 0' }}>{data?.stats?.unansweredCount || 0}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-warning)' }}>Action Needed</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Category Distribution Bar Visual */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <FolderKanban size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Category Breakdown</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data?.categoryDist?.map((cat, idx) => {
                  const maxCount = Math.max(...data.categoryDist.map(c => c.count), 1);
                  const percentage = Math.round((cat.count / maxCount) * 100);
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 500 }}>{cat.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{cat.count} FAQs</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: cat.color || 'var(--primary)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top FAQs by Views */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Eye size={20} color="var(--accent-teal)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Most Viewed Articles</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {data?.topFaqs?.map((faq, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: idx !== data.topFaqs.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div style={{ flex: 1, paddingRight: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>{faq.question}</p>
                    </div>
                    <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                      <Eye size={12} /> {faq.views} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
