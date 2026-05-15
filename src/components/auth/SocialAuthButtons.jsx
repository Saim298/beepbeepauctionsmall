import React from 'react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

export default function SocialAuthButtons({ googleHref, facebookHref, variant = 'signin' }) {
  const verb = variant === 'signup' ? 'Sign up' : 'Sign in';
  return (
    <>
      <div className="lux-auth-divider">Or continue with</div>
      <a href={googleHref} className="lux-social-btn">
        <span className="lux-social-icon">
          <FaGoogle />
        </span>
        {verb} with Google
      </a>
      <a href={facebookHref} className="lux-social-btn">
        <span className="lux-social-icon">
          <FaFacebookF />
        </span>
        {verb} with Facebook
      </a>
    </>
  );
}
