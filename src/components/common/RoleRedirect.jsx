import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (user?.role) {
        navigate(`/${user.role}/dashboard`);
      } else {
        navigate('/login');
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  return <LoadingSpinner />;
};

export default RoleRedirect;