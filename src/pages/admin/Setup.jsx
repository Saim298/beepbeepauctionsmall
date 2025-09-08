import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../../api/client'

const AdminSetup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      await apiRequest('/api/admin/setup', { method: 'POST', body: { name, email, password } })
      navigate('/admin/login', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  return (
    <div className="d-center" style={{ minHeight: '80vh' }}>
      <form onSubmit={submit} className="role-card n4-3rd-bg-color rounded-5 p-6 p-md-8" style={{ maxWidth: 560 }}>
        <h2 className="n4-color mb-3">Create Admin</h2>
        <div className="d-grid gap-2">
          <label className="n4-color">Name</label>
          <input className="w-100 n4-color" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Admin name" />
        </div>
        <div className="d-grid gap-2 mt-3">
          <label className="n4-color">Email</label>
          <input className="w-100 n4-color" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="admin@example.com" />
        </div>
        <div className="d-grid gap-2 mt-3">
          <label className="n4-color">Password</label>
          <input type="password" className="w-100 n4-color" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="********" />
        </div>
        {error && <p className="p1-color mt-3">{error}</p>}
        <div className="d-center mt-4">
          <button className="box-style style-two rounded-pill p1-bg-color d-center transition py-3 px-8" disabled={saving}>{saving ? 'Saving…' : 'Create Admin'}</button>
        </div>
      </form>
    </div>
  )
}

export default AdminSetup


