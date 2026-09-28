import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Star,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Share2,
  History,
  ThumbsUp,
  User,
  Clock
} from 'lucide-react';

export default function FAQCard({ faq, isFavorite, onToggleFavorite, onDelete, onOpenShare, onOpenHistory, isCreator }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = faq.updatedAt
    ? new Date(faq.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  return (
    <div
      className="card card-hover"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        cursor: 'pointer'
      }}
      onClick={() => navigate(`/knowledge/${faq.id}`)}
    >
      <div>
        {/* Top Badges & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span className="badge badge-blue">
              {faq.categoryName || 'General'}
            </span>
            {faq.isAiGenerated && (
              <span className="badge badge-ai">
                <Sparkles size={11} /> AI
              </span>
            )}
            {faq.status === 'Draft' && (
              <span className="badge badge-amber">Draft</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleFavorite && onToggleFavorite(faq.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: isFavorite ? '#F59E0B' : 'var(--text-muted)' }}
              title={isFavorite ? 'Remove bookmark' : 'Bookmark FAQ'}
            >
              <Star size={17} fill={isFavorite ? '#F59E0B' : 'none'} />
            </button>

            {/* 3-Dot Dropdown Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)' }}
              >
                <MoreVertical size={17} />
              </button>

              {showMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '160px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 200,
                    padding: '4px 0'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setShowMenu(false); navigate(`/knowledge/${faq.id}`); }}
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, fontSize: '0.8rem' }}
                  >
                    <Eye size={14} /> View Details
                  </button>
                  {isCreator && (
                    <button
                      onClick={() => { setShowMenu(false); navigate(`/edit/${faq.id}`); }}
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, fontSize: '0.8rem' }}
                    >
                      <Edit size={14} /> Edit FAQ
                    </button>
                  )}
                  <button
                    onClick={() => { setShowMenu(false); onOpenShare && onOpenShare(faq); }}
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, fontSize: '0.8rem' }}
                  >
                    <Share2 size={14} /> Share FAQ
                  </button>
                  {onOpenHistory && (
                    <button
                      onClick={() => { setShowMenu(false); onOpenHistory(faq); }}
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, fontSize: '0.8rem' }}
                    >
                      <History size={14} /> Revisions ({faq.versions?.length || 1})
                    </button>
                  )}
                  {isCreator && onDelete && (
                    <>
                      <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                      <button
                        onClick={() => { setShowMenu(false); onDelete(faq.id); }}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, fontSize: '0.8rem', color: 'var(--status-error)' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Title */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.35, color: 'var(--text-main)' }}>
          {faq.question}
        </h3>

        {/* Answer Snippet */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '1rem',
          lineHeight: 1.5
        }}>
          {faq.answer}
        </p>
      </div>

      {/* Footer Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '0.75rem',
        marginTop: '0.5rem'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <User size={13} /> {faq.authorName || 'Knowledge Base'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {faq.helpfulYes > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--status-success)' }}>
              <ThumbsUp size={12} /> {faq.helpfulYes}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} /> {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
