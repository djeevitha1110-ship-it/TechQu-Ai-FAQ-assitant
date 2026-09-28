import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Users, Shield, UserCheck, UserX, Trash2, Edit2 } from 'lucide-react';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.users || []);
    } catch (err) {
      showError(err.message || 'Failed to load user list.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      showSuccess('User role updated!');
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Failed to update role.');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    try {
      await userAPI.toggleStatus(userId, newStatus);
      showSuccess(`User status changed to ${newStatus}.`);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userAPI.delete(userId);
      showSuccess('User deleted.');
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="page-body animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>User Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Admin panel to assign roles, manage user permissions, and control workspace access.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading users...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>User</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Role</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>FAQs Created</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        alt={u.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={u.id === currentUser?.id}
                      className="form-select"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem', width: 'auto' }}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Content Creator">Content Creator</option>
                      <option value="Authenticated User">Authenticated User</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                    {u.faqCount || 0} FAQs
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {u.id !== currentUser?.id && (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="btn btn-ghost btn-icon"
                          style={{ color: 'var(--status-error)' }}
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
