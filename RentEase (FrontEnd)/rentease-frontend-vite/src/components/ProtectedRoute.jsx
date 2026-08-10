import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { isLoggedIn, isOwner, isRenter, isAdmin } = useAuth();
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (role === 'OWNER'  && !isOwner())  return <Navigate to="/" replace />;
  if (role === 'RENTER' && !isRenter()) return <Navigate to="/" replace />;
  if (role === 'ADMIN'  && !isAdmin())  return <Navigate to="/" replace />;
  return children;
}
