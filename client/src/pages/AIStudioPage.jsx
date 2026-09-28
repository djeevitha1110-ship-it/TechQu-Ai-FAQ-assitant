import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI, categoryAPI, faqAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Wand2,
  CheckCircle2,
  Copy,
  Save,
  RotateCcw,
  SlidersHorizontal,
  Check,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function AIStudioPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState('generate'); // 'generate', 'improver', 'quality'
  const [categories, setCategories] = useState([]);
  const [existingFaqs, setExistingFaqs] = useState([]);

  // --- Tool 1: Generate FAQ ---
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('General Users');
  const [tone, setTone] = useState('Professional');
  const [category, setCategory] = useState('General');
  const [answerLength, setAnswerLength] = useState('Standard');
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState(null);

  // --- Tool 2: AI Answer Improver ---
  const [selectedFaqId, setSelectedFaqId] = useState('');
  const [improverQuestion, setImproverQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [improvementStyle, setImprovementStyle] = useState('Professional');
  const [improving, setImproving] = useState(false);
  const [improvedResult, setImprovedResult] = useState(null);

  // --- Tool 3: FAQ Quality Score ---
  const [qualityQuestion, setQualityQuestion] = useState('');
  const [qualityAnswer, setQualityAnswer] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [qualityResult, setQualityResult] = useState(null);

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.categories || [])).catch(() => {});
    faqAPI.getAll().then(r => setExistingFaqs(r.faqs || [])).catch(() => {});
  }, []);

  // Handle Tool 1: Generate FAQ
  const handleGenerateFAQ = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      showError('Please enter a topic for AI generation.');
      return;
    }
    setGenerating(true);
    setGenResult(null);

    try {
      const res = await aiAPI.generateFAQ({ topic, audience, tone, category, answerLength });
      setGenResult(res.result);
      showSuccess('AI generation completed!');
    } catch (err) {
      showError(err.message || 'Failed to generate content.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveGeneratedFAQ = async () => {
    if (!genResult) return;
    try {
      await faqAPI.create({
        question: genResult.question,
        answer: genResult.answer,
        categoryName: genResult.suggestedCategory || category,
        keywords: genResult.keywords || [],
        isAiGenerated: true
      });
      showSuccess('AI FAQ saved to Knowledge Base!');
      navigate('/knowledge');
    } catch (err) {
      showError(err.message || 'Failed to save FAQ.');
    }
  };

  // Handle Tool 2: Improve Answer
  const handleSelectFaqToImprove = (faqId) => {
    setSelectedFaqId(faqId);
    const target = existingFaqs.find(f => f.id === faqId);
    if (target) {
      setImproverQuestion(target.question);
      setCurrentAnswer(target.answer);
    }
  };

  const handleImproveAnswer = async (e) => {
    e.preventDefault();
    if (!currentAnswer.trim()) {
      showError('Please select or paste an answer to improve.');
      return;
    }
    setImproving(true);
    setImprovedResult(null);

    try {
      const res = await aiAPI.improveAnswer({
        question: improverQuestion,
        currentAnswer,
        improvementStyle
      });
      setImprovedResult(res.result);
      showSuccess('Answer improved by AI!');
    } catch (err) {
      showError(err.message || 'Failed to improve answer.');
    } finally {
      setImproving(false);
    }
  };

  const handleApplyImprovedAnswer = async () => {
    if (!selectedFaqId || !improvedResult) return;
    try {
      await faqAPI.update(selectedFaqId, {
        answer: improvedResult.improvedAnswer,
        changeSummary: `AI Improved (${improvementStyle} style)`
      });
      showSuccess('Applied improved answer to FAQ article!');
      navigate(`/knowledge/${selectedFaqId}`);
    } catch (err) {
      showError(err.message || 'Failed to update FAQ.');
    }
  };

  // Handle Tool 3: Quality Check
  const handleQualityCheck = async (e) => {
    e.preventDefault();
    if (!qualityQuestion.trim() || !qualityAnswer.trim()) {
      showError('Please enter both question and answer to analyze quality.');
      return;
    }
    setAnalyzing(true);
    setQualityResult(null);

    try {
      const res = await aiAPI.qualityCheck({ question: qualityQuestion, answer: qualityAnswer });
      setQualityResult(res.result);
      showSuccess('Quality score evaluation complete!');
    } catch (err) {
      showError(err.message || 'Quality check failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="page-body animate-fade-in">
      {/* Page Title Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={28} color="var(--accent-teal)" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>AI Studio</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Create, edit, and optimize your knowledge base with intelligent AI assistance.
        </p>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('generate')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'generate' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'generate' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'generate' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Wand2 size={18} /> Generate FAQ
        </button>
        <button
          onClick={() => setActiveTab('improver')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'improver' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'improver' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'improver' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <SlidersHorizontal size={18} /> Answer Improver
        </button>
        <button
          onClick={() => setActiveTab('quality')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'quality' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'quality' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'quality' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} /> Quality Score
        </button>
      </div>

      {/* TAB 1: GENERATE FAQ */}
      {activeTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>AI FAQ Generator</h3>
            <form onSubmit={handleGenerateFAQ}>
              <div className="form-group">
                <label className="form-label">Topic or Subject <span style={{ color: 'var(--status-error)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Setting up Webhook notifications in v2 API"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select className="form-select" value={audience} onChange={(e) => setAudience(e.target.value)}>
                    <option value="General Users">General Users</option>
                    <option value="Developers">Developers</option>
                    <option value="Enterprise Admins">Enterprise Admins</option>
                    <option value="Support Team">Support Team</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Desired Tone</label>
                  <select className="form-select" value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Technical">Technical</option>
                    <option value="Concise">Concise</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Answer Length</label>
                  <select className="form-select" value={answerLength} onChange={(e) => setAnswerLength(e.target.value)}>
                    <option value="Standard">Standard</option>
                    <option value="Detailed Step-by-Step">Detailed Step-by-Step</option>
                    <option value="Brief Summary">Brief Summary</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={generating} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.7rem' }}>
                <Wand2 size={16} />
                {generating ? 'Drafting FAQ with AI...' : 'Generate FAQ'}
              </button>
            </form>
          </div>

          {/* Result Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>Generated Output</h3>
            {generating ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Sparkles size={36} color="var(--accent-teal)" style={{ animation: 'spin 2s infinite linear', marginBottom: '1rem' }} />
                <p>Generating question & drafting structured answer...</p>
              </div>
            ) : genResult ? (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span className="badge badge-ai" style={{ marginBottom: '0.5rem' }}>
                    <Sparkles size={12} /> {genResult.suggestedCategory || category}
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.35rem' }}>
                    {genResult.question}
                  </h4>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-app)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                  border: '1px solid var(--border-color)'
                }}>
                  {genResult.answer}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={handleSaveGeneratedFAQ} className="btn btn-primary">
                    <Save size={16} /> Save & Publish
                  </button>
                  <button onClick={handleGenerateFAQ} className="btn btn-secondary">
                    <RotateCcw size={16} /> Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Fill in the topic parameters on the left and click "Generate FAQ".
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI ANSWER IMPROVER */}
      {activeTab === 'improver' && (
        <div style={{ maxWidth: '900px' }}>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>AI Answer Improver</h3>
            <form onSubmit={handleImproveAnswer}>
              <div className="form-group">
                <label className="form-label">Select Existing FAQ (Optional)</label>
                <select className="form-select" value={selectedFaqId} onChange={(e) => handleSelectFaqToImprove(e.target.value)}>
                  <option value="">-- Or paste text manually below --</option>
                  {existingFaqs.map(f => <option key={f.id} value={f.id}>{f.question}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Current Answer</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Paste existing answer text to refine..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Improvement Style</label>
                <select className="form-select" value={improvementStyle} onChange={(e) => setImprovementStyle(e.target.value)}>
                  <option value="Professional">Professional (Corporate & polished)</option>
                  <option value="Simple">Simple (Clear & easy to understand)</option>
                  <option value="Technical">Technical (Detailed & precise)</option>
                  <option value="Beginner-friendly">Beginner-friendly (Includes basic definitions)</option>
                  <option value="Concise">Concise (Short & direct)</option>
                </select>
              </div>

              <button type="submit" disabled={improving} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
                <Wand2 size={16} /> {improving ? 'Improving Answer...' : 'Improve Answer with AI'}
              </button>
            </form>
          </div>

          {/* Side-by-side Comparison */}
          {improvedResult && (
            <div className="card animate-fade-in" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Side-by-Side Comparison</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Original Answer</h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{currentAnswer}</p>
                </div>
                <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    ✨ Improved Answer ({improvementStyle})
                  </h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-main)' }}>{improvedResult.improvedAnswer}</p>
                </div>
              </div>

              {selectedFaqId ? (
                <button onClick={handleApplyImprovedAnswer} className="btn btn-primary">
                  <Check size={16} /> Apply Changes to FAQ Article
                </button>
              ) : (
                <button onClick={() => { navigator.clipboard.writeText(improvedResult.improvedAnswer); showSuccess('Improved answer copied!'); }} className="btn btn-primary">
                  <Copy size={16} /> Copy Improved Text
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUALITY SCORE */}
      {activeTab === 'quality' && (
        <div style={{ maxWidth: '900px' }}>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' }}>FAQ Quality Score Evaluator</h3>
            <form onSubmit={handleQualityCheck}>
              <div className="form-group">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. How do I reset my password?"
                  value={qualityQuestion}
                  onChange={(e) => setQualityQuestion(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Answer Content</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Paste answer content..."
                  value={qualityAnswer}
                  onChange={(e) => setQualityAnswer(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={analyzing} className="btn btn-primary">
                <CheckCircle2 size={16} /> {analyzing ? 'Evaluating Quality...' : 'Analyze Quality Score'}
              </button>
            </form>
          </div>

          {/* Quality Results */}
          {qualityResult && (
            <div className="card animate-fade-in" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: qualityResult.score >= 80 ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
                  color: qualityResult.score >= 80 ? 'var(--status-success)' : 'var(--status-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.5rem'
                }}>
                  {qualityResult.score}/100
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Quality Evaluation Score</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{qualityResult.recommendation}</p>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Checklist Suggestions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {qualityResult.checklist.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                    {item.passed ? <CheckCircle2 size={18} color="var(--status-success)" /> : <AlertCircle size={18} color="var(--status-warning)" />}
                    <span style={{ color: item.passed ? 'var(--text-main)' : 'var(--status-warning)' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
