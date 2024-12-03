import Analytics from '../components/Analytics';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function AnalyticsPage() {
  const { user } = useAuth();

  // Only allow admin access
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="p-6">
      <Analytics />
    </div>
  );
}

export default AnalyticsPage; 