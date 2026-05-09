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

      if (token) {
        saveAuthToken(token);
        console.log('Token from URL saved to localStorage');
      }

      try {
        // Always try to resolve session from server (cookie or token).
        console.log('Fetching user profile...');
        const userData = await apiRequest('/api/auth/me', {
          method: 'GET',
          ...(token ? { token } : {})
        });

        console.log('User data:', userData);
        console.log('Role confirmed:', userData.user.roleConfirmed);

        if (userData.user.roleConfirmed === false && userData.user.role === 'buyer') {
          console.log('New OAuth user with buyer role, redirecting to role selection...');
          navigate('/select-role', { replace: true });
        } else {
          console.log('User has confirmed role or existing role, redirecting to dashboard...');
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/signin', { replace: true });
      } finally {
        // Clean up the URL by removing the token parameter
        if (token) {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.toString());
          } catch (_) {}
        }
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