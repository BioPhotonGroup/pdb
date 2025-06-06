import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../modules/login-form';
import { AuthContext } from '../../context/auth-context';
import MainLayout from '../templates/main-layout';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import AuthService from '../../services/auth-service';  // Import AuthService

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Add loading state

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated, login } = authContext;

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');  // Redirect if already logged in
    }
  }, [isAuthenticated, navigate]);  // Dependency on isAuthenticated and navigate

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);  // Set loading state to true
    try {
      const success = await AuthService.login(username, password);  // Call AuthService login
      if (success) {
        login(username, password);  // Call context login
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
    setLoading(false);  // Set loading state back to false
  };

  return (
    <MainLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h2" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <LoginForm onSubmit={handleLogin} />
        {loading && <p>Loading...</p>}  {/* Display loading state */}
      </Container>
    </MainLayout>
  );
};

export default Login;
