import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, saveAuthToken } from "../api/client";
import logo from "../image/logo.png"

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [serverMfaToken, setServerMfaToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      if (data.mfaRequired) {
        setServerMfaToken(data.mfaToken);
      } else {
        saveAuthToken(data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/api/auth/mfa/verify-login", {
        method: "POST",
        token: serverMfaToken,
        body: { token: mfaToken },
      });
      saveAuthToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";
  
  // Create state parameter for OAuth to remember current client URL
  const createOAuthUrl = (provider) => {
    const clientUrl = window.location.origin;
    const state = btoa(JSON.stringify({ clientUrl }));
    return `${apiBase}/api/auth/${provider}?state=${encodeURIComponent(state)}`;
  };

  return (
    <div>
      {/* <!-- Authentication start--> */}
      <section class="authentication banner-section mx-2 mx-md-4 mx-xl-6 my-2 my-md-4 my-xl-6">
        <div class="container-fluid d-block d-lg-grid px-3 px-xl-0 position-relative">
          <div class="row g-9 g-lg-0 align-items-center justify-content-center">
            <div class="col-md-7 col-xl-6 h-100">
              <div class="row justify-content-center h-100">
                <div class="col-xl-11 col-xxl-9 py-4 pe-2 pe-lg-10">
                  <div class="d-flex flex-column justify-content-between gap-4 gap-md-6 h-100">
                    <div class="logo-area">
                      <Link to="/"
                        class="nav-brand align-items-center gap-2"
                      >
                        <img src={logo} alt="logo" style={{width: "100px"}} />
                      </Link>
                    </div>
                    <div class="mid-area py-10 d-grid gap-6 gap-md-10">
                    
                      <div class="head-area d-grid gap-3 gap-md-5">
                        <h2 class="n4-color">Welcome Back!</h2>
                        <p class="n4-color fs-six">
                          Sign in to your account and join us
                        </p>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div class="row gy-6 gy-md-10">
                          <div class="col-md-12 d-grid gap-2">
                            <label
                              for="auth-email"
                              class="n4-color text-capitalize"
                            >
                              Enter Your Email ID
                            </label>
                            <div class="input-area second n4-3rd-bg-color rounded-4 d-center gap-2 transition px-5 px-md-8 py-3 py-lg-5">
                              <div class="input-item w-100">
                                <input type="email" id="auth-email" class="w-100 n4-color" placeholder="Write your email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-12 d-grid gap-2">
                            <label
                              for="auth-password"
                              class="n4-color text-capitalize"
                            >
                              Enter Your Password
                            </label>
                            <div class="input-area second n4-3rd-bg-color rounded-4 d-center gap-2 transition px-5 px-md-8 py-3 py-lg-5">
                              <div class="input-item w-100">
                                <input type="password" id="auth-password" class="w-100 n4-color" placeholder="Write your password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 d-flex">
                            <button
                              type="submit"
                              aria-label="Submit Button"
                              class="box-style style-two rounded-pill p1-bg-color d-center justify-content-start transition py-3 py-md-4 px-3 px-md-6 px-xl-12"
                            >
                              <span class="fs-eight n1-color transition text-uppercase fw-semibold">
                                Submit
                              </span>
                            </button>
                          </div>
                          <div class="col-sm-12 d-center flex-wrap justify-content-between gap-3 gap-sm-0">
                            <div class="d-grid gap-6 gap-md-10">
                              <p class="n4-color">
                                Don’t have an account?{" "}
                                <Link to="/signup" class="p1-color">
                                  Sign Up
                                </Link>
                              </p>
                            </div>
                            <div class="d-flex justify-content-end">
                              <a href="javascript:void(0)" class="n4-color">
                                Forget password
                              </a>
                            </div>
                          </div>
                        </div>
                        {serverMfaToken && (
                          <div class="mt-3">
                            <label class="n4-color">Enter 6-digit code</label>
                            <div class="input-area second n4-3rd-bg-color rounded-4 d-center gap-2 transition px-5 px-md-8 py-3 py-lg-5">
                              <div class="input-item w-100">
                                <input type="text" class="w-100 n4-color" placeholder="000000" value={mfaToken} onChange={(e)=>setMfaToken(e.target.value)} />
                              </div>
                            </div>
                            <button onClick={handleVerifyMfa} class="box-style style-two rounded-pill p1-bg-color d-center justify-content-start transition py-3 py-md-4 px-3 px-md-6 px-xl-12 mt-2">
                              <span class="fs-eight n1-color transition text-uppercase fw-semibold">Verify MFA</span>
                            </button>
                          </div>
                        )}

                        {error && <p class="p1-color mt-2">{error}</p>}

                        <div class="d-flex gap-2 mt-3">
                          <a href={createOAuthUrl('google')} class="box-style style-two rounded-pill p1-bg-color d-center justify-content-start transition py-3 py-md-4 px-3 px-md-6 px-xl-12">
                            <span class="fs-eight n1-color transition text-uppercase fw-semibold">Sign in with Google</span>
                          </a>
                          <a href={createOAuthUrl('facebook')} class="box-style style-two rounded-pill p1-bg-color d-center justify-content-start transition py-3 py-md-4 px-3 px-md-6 px-xl-12">
                            <span class="fs-eight n1-color transition text-uppercase fw-semibold">Sign in with Facebook</span>
                          </a>
                        </div>
                      </form>
                    </div>
                    <div class="end-area d-center">
                      <p class="n4-color">
                        By creating account you agree with our{" "}
                        <a href="terms-conditions.html" class="p1-color">
                          Terms of services
                        </a>{" "}
                        and{" "}
                        <a href="privacy-policy.html" class="p1-color">
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-7 col-md-5 col-xl-6 d-center justify-content-end mb-3 mb-md-0">
              <div class="img-area position-relative d-center">
                <img
                  src="assets/images/auth-bg.webp"
                  class="h-100 rounded-5"
                  alt="img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Authentication end --> */}
    </div>
  );
};

export default Signin;
