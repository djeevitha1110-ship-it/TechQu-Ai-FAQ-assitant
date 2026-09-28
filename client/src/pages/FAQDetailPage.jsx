import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { faqAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ShareModal from '../components/ShareModal';
import VersionHistoryModal from '../components/VersionHistoryModal';
import {
  ArrowLeft,
  Sparkles,
  User,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Share2,
  History,
  Edit,
  Trash2,
  BookOpen
} from 'lucide-react';

export default function FAQDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCreator } = useAuth();
  const { showSuccess, showError } = useToast();

  const [faq, setFaq] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    fetchFAQDetail();
  }, [id]);

  const fetchFAQDetail = async () => {
    setLoading(true);
    try {
      const res = await faqAPI.getById(id);
      setFaq(res.faq);
      setRelated(res.related || []);
    } catch (err) {
      showError(err.message || 'FAQ article not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnswer = () => {
    if (!faq) return;
    navigator.clipboard.writeText(`${faq.question}\n\n${faq.answer}`);
    setCopied(true);
    showSuccess('Answer copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHelpfulVote = async (vote) => {
    if (hasVoted) return;
    try {
      const res = await faqAPI.voteHelpful(id, vote);
      setFaq(prev => ({ ...prev, helpfulYes: res.helpfulYes, helpfulNo: res.helpfulNo }));
      setHasVoted(true);
      showSuccess('Thank you for your feedback!');
    } catch (err) {
      showError('Failed to record feedback.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await faqAPI.delete(id);
      showSuccess('FAQ deleted.');
      navigate('/knowledge');
    } catch (err) {
      showError(err.message || 'Failed to delete FAQ.');
    }
  };

  if (loading) {
    return (
      <div className="page-body">
        <div className="skeleton" style={{ width: '120px', height: '24px', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ width: '70%', height: '36px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ width: '100%', height: '200px' }} />
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="page-body" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>FAQ Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>The requested article does not exist or was deleted.</p>
        <button onClick={() => navigate('/knowledge')} className="btn btn-primary">
          Return to Knowledge Base
        </button>
      </div>
    );
  }

  return (
    <div className="page-body animate-fade-in" style={{ maxWidth: '900px' }}>
      {/* Back Link */}
      <Link to="/knowledge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Knowledge Base
      </Link>

      {/* Main FAQ Reading Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* Category & AI Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
              {faq.categoryName || 'General'}
            </span>
            {faq.isAiGenerated && (
              <span className="badge badge-ai" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                <Sparkles size={13} /> AI Generated
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleCopyAnswer} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Answer'}
            </button>
            <button onClick={() => setShowShareModal(true)} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              <Share2 size={14} /> Share
            </button>
            <button onClick={() => setShowHistoryModal(true)} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              <History size={14} /> Revisions ({faq.versions?.length || 1})
            </button>
            {isCreator && (
              <>
                <button onClick={() => navigate(`/edit/${faq.id}`)} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  <Edit size={14} /> Edit
                </button>
                <button onClick={handleDelete} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  <Trash2 size={14} /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Question Heading */}
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
          {faq.question}
        </h1>

        {/* Metadata Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <User size={14} /> Author: <strong>{faq.authorName}</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} /> Last updated: {new Date(faq.updatedAt || faq.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Formatted Answer Body */}
        <div style={{
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'var(--text-main)',
          whiteSpace: 'pre-wrap',
          marginBottom: '2rem'
        }}>
          {faq.answer}
        </div>

        {/* Keywords / Tags */}
        {faq.keywords && faq.keywords.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {faq.keywords.map((tag, idx) => (
              <span key={idx} style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-secondary)',
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)'
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Was this answer helpful? */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }}>
            Was this answer helpful?
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleHelpfulVote('yes')}
              disabled={hasVoted}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <ThumbsUp size={16} color="var(--status-success)" /> Yes ({faq.helpfulYes || 0})
            </button>
            <button
              onClick={() => handleHelpfulVote('no')}
              disabled={hasVoted}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <ThumbsDown size={16} color="var(--status-error)" /> No ({faq.helpfulNo || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Related FAQs "You May Also Need" */}
      {related.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
            You may also need
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {related.map(rel => (
              <div
                key={rel.id}
                className="card card-hover"
                onClick={() => navigate(`/knowledge/${rel.id}`)}
                style={{ cursor: 'pointer', padding: '1rem' }}
              >
                <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
                  {rel.categoryName || 'General'}
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{rel.question}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} faq={faq} />
      <VersionHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} faq={faq} onVersionRestored={fetchFAQDetail} />
    </div>
  );
}
