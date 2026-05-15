import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getAuthToken } from '../api/client'

const roles = [
  { key: 'dealer', title: 'Dealer', desc: 'List multiple vehicles, manage inventory, run auctions or direct sales' },
  { key: 'individual', title: 'Individual Seller', desc: 'List a single vehicle and choose auction or direct sale' },
  { key: 'vendor', title: 'Vendor Marketplace Seller', desc: 'Access the vendor marketplace tools and storefront' },
]

const RoleSelect = () => {
  const [selected, setSelected] = useState('dealer')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const token = getAuthToken()
      await apiRequest('/api/auth/set-role', { method: 'POST', token, body: { role: selected } })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div class="d-center" style={{ minHeight: '80vh' }}>
      <form onSubmit={submit} class="role-card n4-3rd-bg-color rounded-5 p-6 p-md-8" style={{ maxWidth: 760 }}>
        <div class="text-center mb-5">
          <h2 class="n4-color">Choose your experience</h2>
          <p class="n4-color">Select your account type to continue</p>
        </div>
        <div class="row g-4">
          {roles.map(r => (
            <div key={r.key} class="col-12 col-md-6">
              <label class={`role-option d-block rounded-4 p-4 border ${selected===r.key? 'border-danger' : 'n4-border'}`} style={{ cursor:'pointer', borderWidth: '2px' }}>
                <input type="radio" name="role" value={r.key} class="d-none" checked={selected===r.key} onChange={()=>setSelected(r.key)} />
                <div class="d-grid gap-2">
                  <h4 class="n4-color">{r.title}</h4>
                  <p class="n4-color fs-six">{r.desc}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
        {error && <p class="p1-color mt-4">{error}</p>}
        <div class="d-center mt-5">
          <button type="submit" class="box-style style-two rounded-pill p1-bg-color d-center transition py-3 px-8">
            <span class="fs-eight n1-color fw-semibold text-uppercase">Continue</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default RoleSelect


