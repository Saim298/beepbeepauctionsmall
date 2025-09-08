import React, { useEffect, useState } from 'react'
import AdminSidebar from './Sidebar.jsx'
import { getAuthToken } from '../../api/client'
import '../../pages/dashboard.css'

const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const Taxonomy = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [modelsMakeId, setModelsMakeId] = useState('')
  const [categories, setCategories] = useState([])
  const [newMake, setNewMake] = useState('')
  const [newModel, setNewModel] = useState({ makeId: '', name: '' })
  const [newModelYears, setNewModelYears] = useState('')
  const [newCategory, setNewCategory] = useState('')

  const token = getAuthToken()

  const load = async () => {
    const [mk, cat] = await Promise.all([
      fetch(`${apiBase}/api/makes`).then(r => r.json()),
      fetch(`${apiBase}/api/categories`).then(r => r.json())
    ])
    setMakes(mk)
    setCategories(cat)
    const first = mk[0]?._id || ''
    setModelsMakeId(first)
    if (first) fetch(`${apiBase}/api/makes/${first}/models`).then(r => r.json()).then(setModels)
  }

  useEffect(() => { load() }, [])

  const addMake = async (e) => {
    e.preventDefault()
    if (!newMake.trim()) return
    await fetch(`${apiBase}/api/makes`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: newMake.trim() }) })
    setNewMake('')
    load()
  }
  const addModel = async (e) => {
    e.preventDefault()
    if (!newModel.makeId || !newModel.name.trim()) return
    const years = newModelYears
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => Number(s))
      .filter(n => !Number.isNaN(n))
    await fetch(`${apiBase}/api/models`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ makeId: newModel.makeId, name: newModel.name.trim(), years }) })
    setNewModel({ makeId: '', name: '' })
    setNewModelYears('')
    load()
  }

  const onChangeModelsMake = async (e) => {
    const id = e.target.value
    setModelsMakeId(id)
    if (id) {
      const list = await fetch(`${apiBase}/api/makes/${id}/models`).then(r => r.json())
      setModels(list)
    } else {
      setModels([])
    }
  }
  const addCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    await fetch(`${apiBase}/api/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: newCategory.trim() }) })
    setNewCategory('')
    load()
  }

  const delMake = async (id) => {
    await fetch(`${apiBase}/api/makes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }
  const delModel = async (id) => {
    await fetch(`${apiBase}/api/models/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }
  const delModelYear = async (id, year) => {
    await fetch(`${apiBase}/api/models/${id}/years/${year}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }
  const delCategory = async (id) => {
    await fetch(`${apiBase}/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  return (
    <div className="dashboard-root" data-theme={theme}>
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">Taxonomy</h1>
              <span className="page-subtitle">Manage makes, models, and categories</span>
            </div>
            <div className="topbar-right">
              <button className="pill" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
            </div>
          </header>

          <section className="grid content-grid">
            <div className="panel glass">
              <div className="panel-header space-between"><h3>Makes</h3></div>
              <div className="panel-body">
                <form className="form-grid" onSubmit={addMake}>
                  <div className="form-row"><label>New Make</label><input className="input glass" value={newMake} onChange={(e) => setNewMake(e.target.value)} placeholder="Ferrari" /></div>
                  <div className="actions" style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="pill">Add</button></div>
                </form>
                <div className="list-grid">
                  {makes.map(m => (
                    <div key={m._id} className="list-row">
                      <span className="label">{m.name}</span>
                      <button className="pill ghost" onClick={() => delMake(m._id)}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel glass">
              <div className="panel-header space-between"><h3>Models</h3></div>
              <div className="panel-body">
                <form className="form-grid" onSubmit={addModel}>
                  <div className="form-row"><label>Make</label><select className="input glass" value={newModel.makeId} onChange={(e) => setNewModel({ ...newModel, makeId: e.target.value })}><option value="">Select</option>{makes.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}</select></div>
                  <div className="form-row"><label>Model name</label><input className="input glass" value={newModel.name} onChange={(e) => setNewModel({ ...newModel, name: e.target.value })} placeholder="348" /></div>
                  <div className="form-row"><label>Years (comma‑separated)</label><input className="input glass" value={newModelYears} onChange={(e) => setNewModelYears(e.target.value)} placeholder="1990, 1991, 1992" /></div>
                  <div className="actions" style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="pill">Add</button></div>
                </form>
                <div className="form-row" style={{ marginTop: 12 }}>
                  <label>View models for make</label>
                  <select className="input glass" value={modelsMakeId} onChange={onChangeModelsMake}><option value="">Select</option>{makes.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}</select>
                </div>
                <div className="list-grid">
                  {models.map(m => (
                    <div key={m._id} className="list-row">
                      <div>
                        <span className="label">{m.name}</span>
                        {Array.isArray(m.years) && m.years.length > 0 && (
                          <span className="muted"> — {m.years.join(', ')}</span>
                        )}
                      </div>
                      <div className="btn-row">
                        {Array.isArray(m.years) && m.years.map(y => (
                          <button key={y} className="pill ghost" onClick={() => delModelYear(m._id, y)}>Remove {y}</button>
                        ))}
                        <button className="pill ghost" onClick={() => delModel(m._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel glass">
              <div className="panel-header space-between"><h3>Categories</h3></div>
              <div className="panel-body">
                <form className="form-grid" onSubmit={addCategory}>
                  <div className="form-row"><label>New Category</label><input className="input glass" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Supercar" /></div>
                  <div className="actions" style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="pill">Add</button></div>
                </form>
                <div className="list-grid">
                  {categories.map(c => (
                    <div key={c._id} className="list-row">
                      <span className="label">{c.name}</span>
                      <button className="pill ghost" onClick={() => delCategory(c._id)}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Taxonomy


