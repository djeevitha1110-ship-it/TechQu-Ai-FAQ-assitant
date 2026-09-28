import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FolderKanban, Plus, Edit, Trash2, BookOpen, X } from 'lucide-react';

export default function CategoriesPage() {
  const { isCreator, isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563EB');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setColor('#2563EB');
    setShowModal(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setColor(cat.color || '#2563EB');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showError('Category name is required.');
      return;
    }

    try {
      if (editId) {
        await categoryAPI.update(editId, { name, description, color });
        showSuccess('Category updated successfully.');
      } else {
        await categoryAPI.create({ name, description, color });
        showSuccess('Category created successfully.');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      showError(err.message || 'Failed to save category.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      showSuccess('Category deleted.');
      fetchCategories();
    } catch (err) {
      showError(err.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="page-body animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Category Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Organize knowledge base articles into domain-specific categories.
          </p>
        </div>

        {isCreator && (
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <Plus size={18} /> Create Custom Category
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading categories...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {categories.map(cat => (
            <div key={cat.id} className="card card-hover" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color || '#2563EB' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{cat.name}</h3>
                </div>

                {isCreator && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleOpenEditModal(cat)} className="btn btn-ghost btn-icon" title="Edit">
                      <Edit size={15} />
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(cat.id)} className="btn btn-ghost btn-icon" style={{ color: 'var(--status-error)' }} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '38px', lineHeight: 1.4 }}>
                {cat.description || 'No description provided.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                <BookOpen size={14} /> {cat.faqCount || 0} Articles
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                {editId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Integrations & API"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Short explanation of topics included..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Badge Color Accent</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
