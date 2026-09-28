import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { faqAPI } from '../services/api';
import FAQCard from '../components/FAQCard';
import EmptyState from '../components/EmptyState';
import { Search, Sparkles, Plus, ArrowRight, Zap, Filter } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam) {
      setQuery(qParam);
      performSearch(qParam);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await faqAPI.search(searchQuery);
      setResults(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  const recentSearches = ['password reset', 'api rate limit', 'two-factor auth', 'billing upgrade'];

  return (
    <div className="page-body animate-fade-in" style={{ maxWidth: '960px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Smart Knowledge Search</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Discover answers across your entire organization's FAQ database.
        </p>
      </div>

      {/* Large Search Input */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-md)' }}>
          <Search size={22} color="var(--primary)" />
          <input
            type="text"
            placeholder="Search your knowledge base (e.g. How do I reset my password?)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: 'var(--text-main)',
              padding: '0.5rem 0'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            Search
          </button>
        </div>
      </form>

      {/* Suggested & Recent Searches */}
      {!hasSearched && (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Popular & Recent Searches:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {recentSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => { setQuery(term); setSearchParams({ q: term }); performSearch(term); }}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Searching knowledge base...</div>
      ) : hasSearched && results.length === 0 ? (
        /* Empty State turning search failure into AI generation workflow */
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <Search size={36} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No matching answers found</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            We couldn't find an answer for "<strong>{query}</strong>". Would you like to generate an AI answer or create a new FAQ article?
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(`/ai-studio`)}
              className="btn btn-primary"
            >
              <Sparkles size={16} /> Generate AI Answer
            </button>
            <button
              onClick={() => navigate(`/create`)}
              className="btn btn-secondary"
            >
              <Plus size={16} /> Create New FAQ
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {results.map((faq) => (
            <div
              key={faq.id}
              className="card card-hover"
              onClick={() => navigate(`/knowledge/${faq.id}`)}
              style={{ cursor: 'pointer', padding: '1.25rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-blue">{faq.categoryName || 'General'}</span>
                {faq.relevanceScore && (
                  <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                    <Zap size={11} /> {faq.relevanceScore}% Match
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {faq.question}
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {faq.answer}
              </p>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Author: {faq.authorName} • Updated {new Date(faq.updatedAt || faq.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
