import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
import HelpModal from './components/HelpModal';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import DashboardPage from './pages/DashboardPage';
import KnowledgePage from './pages/KnowledgePage';
import FAQDetailPage from './pages/FAQDetailPage';
import FAQEditorPage from './pages/FAQEditorPage';
import AIStudioPage from './pages/AIStudioPage';
import AIHistoryPage from './pages/AIHistoryPage';
import SearchPage from './pages/SearchPage';
import CategoriesPage from './pages/CategoriesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UnansweredPage from './pages/UnansweredPage';
import ActivityPage from './pages/ActivityPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading application...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// App Layout Wrapper
function AppLayout() {
  const location = useLocation();
  const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
  const isPublic = publicRoutes.includes(location.pathname);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Global keyboard listener for '/' and 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isPublic) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <div className="main-content">
        <Header
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onOpenHelp={() => setHelpOpen(true)}
        />

        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/knowledge" element={<ProtectedRoute><KnowledgePage /></ProtectedRoute>} />
          <Route path="/knowledge/:id" element={<ProtectedRoute><FAQDetailPage /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute allowedRoles={['Admin', 'Content Creator']}><FAQEditorPage /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Content Creator']}><FAQEditorPage /></ProtectedRoute>} />
          <Route path="/ai-studio" element={<ProtectedRoute allowedRoles={['Admin', 'Content Creator']}><AIStudioPage /></ProtectedRoute>} />
          <Route path="/ai-history" element={<ProtectedRoute allowedRoles={['Admin', 'Content Creator']}><AIHistoryPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/unanswered" element={<ProtectedRoute><UnansweredPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><KnowledgePage favoritesOnly={true} /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={['Admin']}><UsersPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppLayout />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
