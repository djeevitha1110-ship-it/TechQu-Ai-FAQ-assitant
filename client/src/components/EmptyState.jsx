import React from 'react';
import { BookOpen, Sparkles, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({
  title = "No FAQs found",
  description = "Build your knowledge base by creating your first FAQ entry or using AI Studio.",
  icon: Icon = BookOpen,
  primaryActionText = "Create FAQ",
  primaryActionPath = "/create",
  secondaryActionText = "Generate with AI",
  secondaryActionPath = "/ai-studio"
}) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '560px',
        margin: '2rem auto'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <Icon size={28} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {primaryActionText && primaryActionPath && (
          <button onClick={() => navigate(primaryActionPath)} className="btn btn-primary">
            <Plus size={16} /> {primaryActionText}
          </button>
        )}
        {secondaryActionText && secondaryActionPath && (
          <button onClick={() => navigate(secondaryActionPath)} className="btn btn-secondary">
            <Sparkles size={16} /> {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
}
