import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

const AuthGuard: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // Handle the case where authContext is undefined
    return <Navigate to="/login" />;
  }

  const { isAuthenticated } = authContext;

  // Redirect to login page if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGuard;