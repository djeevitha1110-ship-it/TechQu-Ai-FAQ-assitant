import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faqAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import FAQCard from '../components/FAQCard';
import ShareModal from '../components/ShareModal';
import VersionHistoryModal from '../components/VersionHistoryModal';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/Skeleton';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  Star
} from 'lucide-react';

export default function KnowledgePage({ favoritesOnly = false }) {
  const { isCreator, user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Modals
  const [shareFaq, setShareFaq] = useState(null);
  const [historyFaq, setHistoryFaq] = useState(null);

  const [favorites, setFavorites] = useState(user?.favorites || []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [search, selectedCategory, selectedStatus, sortBy, favoritesOnly]);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        status: selectedStatus,
        search,
        sort: sortBy
      };
      const res = await faqAPI.getAll(params);
      let list = res.faqs || [];

      if (favoritesOnly) {
        list = list.filter(f => favorites.includes(f.id));
      }

      setFaqs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (faqId) => {
    try {
      const res = await faqAPI.toggleFavorite(faqId);
      setFavorites(res.favorites || []);
      if (favoritesOnly) {
        setFaqs(prev => prev.filter(f => f.id !== faqId));
      }
      showSuccess(res.isFavorite ? 'FAQ bookmarked!' : 'Bookmark removed.');
    } catch (err) {
      showError('Failed to update bookmark.');
    }
  };

  const handleDeleteFaq = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await faqAPI.delete(faqId);
      showSuccess('FAQ deleted successfully.');
      setFaqs(prev => prev.filter(f => f.id !== faqId));
    } catch (err) {
      showError(err.message || 'Failed to delete FAQ.');
    }
  };

  return (
    <div className="page-body animate-fade-in">
      {/* Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {favoritesOnly ? 'Bookmarked FAQs' : 'Knowledge Base'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {favoritesOnly ? 'Quick access to your saved FAQ articles.' : 'Manage and discover your organization’s frequently asked questions.'}
          </p>
        </div>

        {isCreator && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/create')} className="btn btn-primary">
              <Plus size={18} /> Create FAQ
            </button>
            <button onClick={() => navigate('/ai-studio')} className="btn btn-secondary">
              <Sparkles size={18} /> AI Studio
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Field */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search FAQs by question, answer, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.45rem 0.75rem',
                border: 'none',
                background: viewMode === 'grid' ? 'var(--primary)' : 'var(--bg-card)',
                color: viewMode === 'grid' ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.45rem 0.75rem',
                border: 'none',
                background: viewMode === 'list' ? 'var(--primary)' : 'var(--bg-card)',
                color: viewMode === 'list' ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Render */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : faqs.length === 0 ? (
        <EmptyState
          title={favoritesOnly ? "No bookmarked FAQs" : "No matching FAQs found"}
          description={favoritesOnly ? "Click the star icon on any FAQ card to bookmark it here." : "Try adjusting your search terms or filters."}
          icon={favoritesOnly ? Star : BookOpen}
        />
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {faqs.map(faq => (
            <FAQCard
              key={faq.id}
              faq={faq}
              isFavorite={favorites.includes(faq.id)}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteFaq}
              onOpenShare={setShareFaq}
              onOpenHistory={setHistoryFaq}
              isCreator={isCreator}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
              {faqs.map(faq => (
                <tr key={faq.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 500, color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => navigate(`/knowledge/${faq.id}`)}>
                    {faq.question}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className="badge badge-blue">{faq.categoryName || 'General'}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>{faq.authorName}</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(faq.updatedAt || faq.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button onClick={() => navigate(`/knowledge/${faq.id}`)} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <ShareModal isOpen={!!shareFaq} onClose={() => setShareFaq(null)} faq={shareFaq} />
      <VersionHistoryModal isOpen={!!historyFaq} onClose={() => setHistoryFaq(null)} faq={historyFaq} onVersionRestored={fetchFaqs} />
    </div>
  );
}
