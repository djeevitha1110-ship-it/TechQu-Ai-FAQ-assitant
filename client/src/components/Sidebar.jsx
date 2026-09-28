import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { unansweredAPI } from '../services/api';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Search,
  FolderKanban,
  BarChart3,
  History,
  HelpCircle,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Star,
  Inbox,
  Clock,
  PlusCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, onOpenHelp }) {
  const { user, logout, isAdmin, isCreator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unansweredCount, setUnansweredCount] = useState(0);

  // Fetch real-time unanswered count for badge
  useEffect(() => {
    if (user) {
      unansweredAPI.getAll()
        .then(res => {
          if (res.unanswered) {
            setUnansweredCount(res.unanswered.length);
          }
        })
        .catch(() => setUnansweredCount(0));
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Grouped Navigation Sections
  const navSections = [
    {
      title: 'MAIN WORKSPACE',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
        { name: 'Search', path: '/search', icon: Search },
        { name: 'Categories', path: '/categories', icon: FolderKanban }
      ]
    },
    {
      title: 'AI & INTELLIGENCE',
      items: [
        { name: 'AI Studio', path: '/ai-studio', icon: Sparkles, highlight: true, badge: 'PRO', creatorOnly: true },
        { name: 'AI Generation History', path: '/ai-history', icon: History, creatorOnly: true },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'COMMUNITY & INBOX',
      items: [
        { name: 'Unanswered Questions', path: '/unanswered', icon: Inbox, countBadge: unansweredCount },
        { name: 'Favorite FAQs', path: '/favorites', icon: Star, countBadge: user?.favorites?.length || 0 },
        { name: 'Activity Log', path: '/activity', icon: Clock }
      ]
    },
    ...(isAdmin ? [{
      title: 'ADMINISTRATION',
      items: [
        { name: 'User Management', path: '/users', icon: Users, badge: 'ADMIN' }
      ]
    }] : []),
    {
      title: 'PREFERENCES',
      items: [
        { name: 'Settings & Theme', path: '/settings', icon: Settings }
      ]
    }
  ];

  // Helper for role badge colors
  const getRoleBadgeStyle = (role) => {
    if (role === 'Admin') {
      return { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.3)' };
    }
    if (role === 'Content Creator') {
      return { backgroundColor: 'rgba(0, 210, 255, 0.15)', color: '#00D2FF', border: '1px solid rgba(0, 210, 255, 0.3)' };
    }
    return { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' };
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 900
          }}
        />
      )}

      <aside
        style={{
          width: collapsed ? '74px' : '260px',
          backgroundColor: 'var(--bg-sidebar)',
          color: 'var(--text-on-dark)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 950,
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          borderRight: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Sidebar Header & Brand */}
        <div style={{
          padding: '1.1rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-color)',
          minHeight: '65px'
        }}>
          {!collapsed ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #0099FF, #00D2FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#FFF',
                fontSize: '1.15rem',
                boxShadow: '0 2px 8px rgba(0, 153, 255, 0.3)'
              }}>
                TQ
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  TechQu
                </h2>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Intelligent Workspace
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setCollapsed(false)}
              title="Click to expand sidebar"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #0099FF, #00D2FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#FFF',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 153, 255, 0.3)'
              }}
            >
              TQ
            </div>
          )}

          {/* Flexible Toggle Expand/Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '7px',
              color: 'var(--text-muted)',
              padding: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = '#FFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Quick CTA Action (Create FAQ Button for Creators/Admin) */}
        {!collapsed && isCreator && (
          <div style={{ padding: '0.85rem 1rem 0.25rem 1rem' }}>
            <button
              onClick={() => navigate('/create')}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.55rem',
                fontSize: '0.825rem',
                boxShadow: '0 4px 12px rgba(0, 153, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <PlusCircle size={16} /> Create New FAQ
            </button>
          </div>
        )}

        {/* Dynamic Navigation Items */}
        <div style={{ flex: 1, padding: '0.75rem 0.6rem', overflowY: 'auto' }}>
          {navSections.map((section, sIdx) => {
            const visibleItems = section.items.filter(item => !item.creatorOnly || isCreator);
            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} style={{ marginBottom: '1.25rem' }}>
                {!collapsed && (
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    padding: '0.25rem 0.75rem 0.4rem 0.75rem',
                    textTransform: 'uppercase'
                  }}>
                    {section.title}
                  </div>
                )}

                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? `${item.name}${item.countBadge !== undefined ? ` (${item.countBadge})` : ''}` : undefined}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '0.7rem 0.9rem' : '0.6rem 0.85rem',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        marginBottom: '3px',
                        borderRadius: 'var(--radius-sm)',
                        color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                        backgroundColor: isActive ? 'var(--primary)' : item.highlight ? 'rgba(0, 210, 255, 0.08)' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        transition: 'all 150ms ease',
                        position: 'relative'
                      })}
                    >
                      <Icon size={19} style={{ minWidth: '19px' }} />

                      {!collapsed && (
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </span>
                      )}

                      {/* Text Badge (e.g. PRO / ADMIN) */}
                      {!collapsed && item.badge && (
                        <span style={{
                          fontSize: '0.625rem',
                          backgroundColor: item.badge === 'ADMIN' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(0, 210, 255, 0.2)',
                          color: item.badge === 'ADMIN' ? '#C084FC' : '#00D2FF',
                          padding: '2px 6px',
                          borderRadius: '99px',
                          fontWeight: 700,
                          letterSpacing: '0.04em'
                        }}>
                          {item.badge}
                        </span>
                      )}

                      {/* Real Dynamic Count Badge (Unanswered or Favorites) */}
                      {item.countBadge > 0 && (
                        <span style={{
                          fontSize: '0.7rem',
                          backgroundColor: item.path === '/unanswered' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: item.path === '/unanswered' ? '#EF4444' : '#F59E0B',
                          padding: '1px 7px',
                          borderRadius: '99px',
                          fontWeight: 700,
                          border: item.path === '/unanswered' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                        }}>
                          {item.countBadge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Help & Authenticated User Profile */}
        <div style={{ borderTop: '1px solid var(--border-color)', padding: '0.75rem 0.6rem' }}>
          <button
            onClick={onOpenHelp}
            title={collapsed ? "Help & Keyboard Shortcuts" : undefined}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              marginBottom: '8px',
              transition: 'all 150ms ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <HelpCircle size={19} style={{ minWidth: '19px' }} />
            {!collapsed && <span>Help & Shortcuts</span>}
          </button>

          {/* Real User Profile Box */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid var(--primary)' }}
                />
                {!collapsed && (
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{
                        fontSize: '0.625rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        ...getRoleBadgeStyle(user.role)
                      }}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!collapsed && (
                <button
                  onClick={handleLogout}
                  title="Sign Out of TechQu"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '5px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#EF4444';
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut size={17} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
