import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, saveAuthToken } from '../../api/client'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaStage, setMfaStage] = useState(false)
  const [mfaToken, setMfaToken] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setError('')
    try {
      const res = await apiRequest('/api/admin/login', { method: 'POST', body: { email, password } })
      if (res.mfaRequired) { setMfaStage(true); setMfaToken(res.mfaToken); }
      else { saveAuthToken(res.token); navigate('/admin/dashboard', { replace: true }) }
    } catch (err) { setError(err.message) }
  }

  const verify = async (e) => {
    e.preventDefault(); setError('')
    try {
      const res = await apiRequest('/api/admin/mfa/verify', { method: 'POST', token: mfaToken, body: { token: otp } })
      saveAuthToken(res.token); navigate('/admin/dashboard', { replace: true })
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="d-center" style={{ minHeight: '80vh' }}>
      <form onSubmit={mfaStage ? verify : submit} className="role-card n4-3rd-bg-color rounded-5 p-6 p-md-8" style={{ maxWidth: 560 }}>
        <h2 className="n4-color mb-3">Admin {mfaStage ? 'Authenticator' : 'Sign In'}</h2>
        {!mfaStage && (
          <>
            <div className="d-grid gap-2">
              <label className="n4-color">Email</label>
              <input className="w-100 n4-color" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div className="d-grid gap-2 mt-3">
              <label className="n4-color">Password</label>
              <input type="password" className="w-100 n4-color" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="********" />
            </div>
          </>
        )}
        {mfaStage && (
          <div className="d-grid gap-2">
            <label className="n4-color">Enter 6‑digit code</label>
            <input className="w-100 n4-color" value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="000000" />
          </div>
        )}
        {error && <p className="p1-color mt-3">{error}</p>}
        <div className="d-center mt-4">
          <button className="box-style style-two rounded-pill p1-bg-color d-center transition py-3 px-8">{mfaStage ? 'Verify' : 'Sign In'}</button>
        </div>
      </form>
    </div>
  )
}

export default AdminLogin


