import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconShirt } from './Icons';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--primary)' }}><IconShirt size={48} /></div>
          <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Loading Jay Kuldevi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
