import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { faqAPI, categoryAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Save, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react';

export default function FAQEditorPage() {
  const { id } = useParams(); // If present, Edit Mode
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [status, setStatus] = useState('Published');
  const [changeSummary, setChangeSummary] = useState('');

  const [categories, setCategories] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchFAQToEdit();
    }
  }, [id]);

  // Live duplicate detection as user types question
  useEffect(() => {
    if (isEditMode || !question || question.trim().length < 6) {
      setDuplicates([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await faqAPI.duplicateCheck(question);
        setDuplicates(res.matches || []);
      } catch (err) {
        // silent catch
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [question, isEditMode]);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.categories || []);
      if (res.categories?.length > 0 && !categoryId) {
        setCategoryId(res.categories[0].id);
        setCategoryName(res.categories[0].name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFAQToEdit = async () => {
    try {
      const res = await faqAPI.getById(id);
      const f = res.faq;
      setQuestion(f.question);
      setAnswer(f.answer);
      setCategoryId(f.categoryId);
      setCategoryName(f.categoryName);
      setKeywords(Array.isArray(f.keywords) ? f.keywords.join(', ') : f.keywords || '');
      setStatus(f.status || 'Published');
    } catch (err) {
      showError('Failed to load FAQ for editing.');
    }
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setCategoryId(selectedId);
    const catObj = categories.find(c => c.id === selectedId);
    if (catObj) setCategoryName(catObj.name);
  };

  const validate = () => {
    const errs = {};
    if (!question.trim()) errs.question = 'Question is required.';
    else if (question.trim().length < 8) errs.question = 'Question should be at least 8 characters long.';

    if (!answer.trim()) errs.answer = 'Answer is required.';
    else if (answer.trim().length < 15) errs.answer = 'Answer should provide clear information (at least 15 characters).';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        categoryId,
        categoryName,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        status,
        changeSummary: isEditMode ? changeSummary : undefined
      };

      if (isEditMode) {
        await faqAPI.update(id, payload);
        showSuccess('FAQ updated successfully!');
      } else {
        await faqAPI.create(payload);
        showSuccess('FAQ created and published successfully!');
      }
      navigate('/knowledge');
    } catch (err) {
      showError(err.message || 'Failed to save FAQ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body animate-fade-in" style={{ maxWidth: '820px' }}>
      <Link to="/knowledge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Knowledge Base
      </Link>

      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {isEditMode ? 'Edit FAQ Article' : 'Create New FAQ'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
          Fill in the details below to add or update content in your knowledge workspace.
        </p>

        {/* Live Duplicate Warning Banner */}
        {duplicates.length > 0 && (
          <div style={{
            backgroundColor: 'var(--status-warning-bg)',
            border: '1px solid var(--status-warning)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-warning)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} />
              Similar FAQs already exist ({duplicates.length} match)
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              To prevent knowledge duplication, review these existing articles before creating a new entry:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {duplicates.map(({ faq, score }) => (
                <div key={faq.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', padding: '6px 10px', borderRadius: '4px' }}>
                  <span>{faq.question} ({score}% match)</span>
                  <a href={`/knowledge/${faq.id}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 500 }}>
                    View <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Question Input */}
          <div className="form-group">
            <label className="form-label">Question <span style={{ color: 'var(--status-error)' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. How do I enable two-factor authentication?"
              value={question}
              onChange={(e) => { setQuestion(e.target.value); setErrors(prev => ({ ...prev, question: null })); }}
            />
            {errors.question && <span className="form-error">{errors.question}</span>}
          </div>

          {/* Category & Status Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={categoryId} onChange={handleCategoryChange}>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Answer Textarea */}
          <div className="form-group">
            <label className="form-label">Answer Content <span style={{ color: 'var(--status-error)' }}>*</span></label>
            <textarea
              className="form-textarea"
              rows={8}
              placeholder="Provide a clear, step-by-step resolution..."
              value={answer}
              onChange={(e) => { setAnswer(e.target.value); setErrors(prev => ({ ...prev, answer: null })); }}
            />
            {errors.answer && <span className="form-error">{errors.answer}</span>}
          </div>

          {/* Keywords / Tags Input */}
          <div className="form-group">
            <label className="form-label">Keywords / Tags (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="security, auth, 2fa, login, account"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          {/* Change Summary if Edit Mode */}
          {isEditMode && (
            <div className="form-group">
              <label className="form-label">Revision Summary (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Updated instructions for 2026 UI overhaul"
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate('/knowledge')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} />
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save & Publish FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
