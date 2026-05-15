import React, { useEffect, useState } from 'react'
import AdminSidebar from './Sidebar.jsx'
import { getAuthToken } from '../../api/client'
import '../../pages/dashboard.css'

const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const AddCar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const token = getAuthToken()
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', price: '', makeId: '', modelId: '', year: '', era: '', origin: '', location: '', categoryIds: [], descriptionHtml: '' })

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])
  useEffect(() => { fetch(`${apiBase}/api/makes`).then(r => r.json()).then(setMakes) }, [])
  useEffect(() => { fetch(`${apiBase}/api/categories`).then(r => r.json()).then(setCategories) }, [])
  useEffect(() => {
    if (form.makeId) fetch(`${apiBase}/api/makes/${form.makeId}/models`).then(r => r.json()).then(setModels)
    else setModels([])
  }, [form.makeId])

  const onSubmit = (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      price: Number(form.price),
      make: form.makeId,
      model: form.modelId,
      year: Number(form.year),
      era: form.era,
      origin: form.origin,
      location: form.location,
      categories: form.categoryIds,
      descriptionHtml: form.descriptionHtml,
      media: []
    }
    fetch(`${apiBase}/api/cars`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      .then(r => r.json()).then(() => { alert('Car added'); window.location.href = '/admin/listings' })
  }

  return (
    <div className="dashboard-root" data-theme={theme}>
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">Add Car</h1>
              <span className="page-subtitle">Create a new marketplace listing</span>
            </div>
            <div className="topbar-right">
              <button className="pill" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
            </div>
          </header>

          <form className="panel glass" style={{ padding: 16 }} onSubmit={onSubmit}>
            <div className="form-grid">
              <div className="form-row"><label>Name</label><input className="input glass" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ferrari 348" required /></div>
              <div className="form-row"><label>Price (USD)</label><input className="input glass" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="250000" required /></div>
              <div className="form-row"><label>Make</label><select className="input glass" value={form.makeId} onChange={(e) => setForm({ ...form, makeId: e.target.value, modelId: '' })} required><option value="">Select make</option>{makes.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}</select></div>
              <div className="form-row"><label>Model</label><select className="input glass" value={form.modelId} onChange={(e) => setForm({ ...form, modelId: e.target.value })} required><option value="">Select model</option>{models.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}</select></div>
              <div className="form-row"><label>Year</label><input className="input glass" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="1991" required /></div>
              <div className="form-row"><label>Era</label><input className="input glass" value={form.era} onChange={(e) => setForm({ ...form, era: e.target.value })} placeholder="1990s" /></div>
              <div className="form-row"><label>Origin</label><input className="input glass" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Italian" /></div>
              <div className="form-row"><label>Location</label><input className="input glass" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="United States" /></div>
              <div className="form-row"><label>Categories</label><select className="input glass" multiple value={form.categoryIds} onChange={(e) => setForm({ ...form, categoryIds: Array.from(e.target.selectedOptions).map(o => o.value) })}>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div className="form-row"><label>Description (HTML)</label><textarea className="input glass" rows={8} value={form.descriptionHtml} onChange={(e) => setForm({ ...form, descriptionHtml: e.target.value })} placeholder="<p>Beautiful classic Ferrari...</p>" /></div>
            </div>
            <div className="actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="pill" type="submit">Save</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AddCar


