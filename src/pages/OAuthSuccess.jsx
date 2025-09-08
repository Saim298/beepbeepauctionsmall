import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveAuthToken } from "../api/client";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Save the token
      saveAuthToken(token);
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // If no token, redirect to signin
      navigate('/signin', { replace: true });
    }
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