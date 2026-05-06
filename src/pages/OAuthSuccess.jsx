import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveAuthToken, apiRequest } from "../api/client";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      const token = searchParams.get('token');
      console.log('OAuth Success - Token:', token ? 'Present' : 'Missing');
      console.log('OAuth Success - All URL params:', Object.fromEntries(searchParams.entries()));
      console.log('OAuth Success - Current URL:', window.location.href);
      
      // Try to get token from URL first, then from localStorage as fallback
      let authToken = token;
      if (!authToken) {
        console.log('No token in URL, checking localStorage...');
        authToken = localStorage.getItem('auth_token');
        console.log('Token from localStorage:', authToken ? 'Present' : 'Missing');
      }
      
      if (authToken) {
        if (!token) {
          // Token was from localStorage, save it again to ensure it's fresh
          saveAuthToken(authToken);
          console.log('Token from localStorage saved again');
        } else {
          saveAuthToken(authToken);
          console.log('Token from URL saved to localStorage');
        }
        
        try {
          // Check user profile to see if role is confirmed
          console.log('Fetching user profile...');
          const userData = await apiRequest('/api/auth/me', {
            method: 'GET',
            token: authToken
          });
          
          console.log('User data:', userData);
          console.log('Role confirmed:', userData.user.roleConfirmed);
          
          // For OAuth users, if they have a role set, assume they can access dashboard
          // Only redirect to role selection if they explicitly need to confirm their role
          if (userData.user.roleConfirmed === false && userData.user.role === 'buyer') {
            console.log('New OAuth user with buyer role, redirecting to role selection...');
            navigate('/select-role', { replace: true });
          } else {
            console.log('User has confirmed role or existing role, redirecting to dashboard...');
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          console.log('Fallback: Redirecting to dashboard...');
          // Fallback to dashboard if we can't determine role status
          // Since user can access dashboard via URL, they should be able to access it
          navigate('/dashboard', { replace: true });
        }
        
        // Clean up the URL by removing the token parameter
        if (token) {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.toString());
          } catch (_) {}
        }
      } else {
        console.log('No token found in URL or localStorage, redirecting to signin...');
        // If no token, redirect to signin
        navigate('/signin', { replace: true });
      }
      setLoading(false);
    };

    handleOAuthSuccess();
  }, [navigate, searchParams]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;