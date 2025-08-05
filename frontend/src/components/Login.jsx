import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { saveLoginData } from '../utils/localStorage';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  width: '100%',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: 16,
}));

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Google OAuth Client ID - replace with your actual client ID
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = window.location.origin;

  useEffect(() => {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setGoogleLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Google API script');
      setGoogleLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const checkUserExists = async (email) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      
      // Check if the email exists in the users array
      const userExists = users.some(user => user.email === email);
      return userExists;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check if Google API is available
      if (typeof window !== 'undefined' && window.google && window.google.accounts && googleLoaded) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'openid email profile',
          callback: async (response) => {
            if (response.access_token) {
              try {
                // Get user info using the access token
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                  headers: {
                    'Authorization': `Bearer ${response.access_token}`
                  }
                });
                
                const userInfo = await userInfoResponse.json();
                
                // Check if user exists in database
                const userExists = await checkUserExists(userInfo.email);
                
                if (!userExists) {
                  setError('Access denied. Your email is not authorized to access this dashboard.');
                  setLoading(false);
                  return;
                }

                const userData = {
                  username: userInfo.email,
                  email: userInfo.email,
                  name: userInfo.name,
                  role: 'admin',
                  provider: 'google',
                  accessToken: response.access_token
                };
                
                // Use the new localStorage utility
                const loginSuccess = onLogin(userData, response.access_token);
                
                if (!loginSuccess) {
                  setError('Failed to save user information');
                }
                
                setLoading(false);
              } catch (err) {
                setError('Failed to get user information');
                setLoading(false);
              }
            } else {
              setError('Google authentication failed');
              setLoading(false);
            }
          },
          error_callback: (error) => {
            setError('Google authentication failed: ' + error.message);
            setLoading(false);
          }
        });

        client.requestAccessToken();
      } else {
        // Fallback for demo purposes when Google API is not available
        console.log('Google API not available, using demo mode');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo, check if demo email exists in database
        const userExists = await checkUserExists('user@google.com');
        
        if (!userExists) {
          setError('Access denied. Your email is not authorized to access this dashboard.');
          setLoading(false);
          return;
        }

        const userData = {
          username: 'user@google.com',
          role: 'admin',
          provider: 'google'
        };
        
        localStorage.setItem('authToken', 'google-demo-token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        onLogin(userData);
        setLoading(false);
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Box
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              p: 1,
              mb: 2
            }}
          >
            <Google sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            GVC Vending Dashboard Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Google />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: '#4285f4',
              '&:hover': {
                backgroundColor: '#357ae8'
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Click to sign in with your Google account
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login; 