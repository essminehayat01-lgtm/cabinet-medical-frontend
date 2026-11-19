import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ roles }) {
  const { user } = useAuth();

  
  if (!user) return <Navigate to="/login" />;

  
  if (roles && !roles.includes(user.role)) return <Navigate to="/patients" />;

  return <Outlet />;
}

export default ProtectedRoute;