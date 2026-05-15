import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AdminSetup from './Setup.jsx'
import AdminLogin from './Login.jsx'
import AdminDashboard from './Dashboard.jsx'
import AdminAuctions from './Auctions.jsx'
import AdminListings from './Listings.jsx'
import AdminAddCar from './AddCar.jsx'
import Taxonomy from './Taxonomy.jsx'
import { getAuthToken } from '../../api/client'

const AdminGuard = ({ children }) => {
  const navigate = useNavigate()
  const [state, setState] = useState({ loading: true, exists: false, token: null })
  const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

  useEffect(() => {
    const check = async () => {
      try {
        // call backend to check if an admin exists (absolute URL based on base env)
        const res = await fetch(`${apiBase}/api/admin/exists`, { credentials: 'include' })
        const json = await res.json()
        setState({ loading: false, exists: !!json.exists, token: getAuthToken() })
      } catch {
        setState({ loading: false, exists: false, token: getAuthToken() })
      }
    }
    check()
  }, [])

  if (state.loading) return <div className="d-center" style={{ minHeight: '60vh' }}><span className="n4-color">Loading…</span></div>
  return children(state)
}

const AdminRoutes = () => {
  const Protected = ({ children }) => {
    const token = getAuthToken()
    if (!token) return <Navigate to="/admin/login" replace />
    return children
  }
  return (
    <Routes>
      <Route path="/admin/*" element={
        <AdminGuard>
          {({ exists }) => (
            exists ? <Navigate to="/admin/login" replace /> : <Navigate to="/admin/setup" replace />
          )}
        </AdminGuard>
      } />
      
      <Route path="/admin/dashboard" element={<Protected><AdminDashboard /></Protected>} />
      <Route path="/admin/auctions" element={<Protected><AdminAuctions /></Protected>} />
      <Route path="/admin/listings" element={<Protected><AdminListings /></Protected>} />
      <Route path="/admin/listings/new" element={<Protected><AdminAddCar /></Protected>} />
      <Route path="/admin/taxonomy" element={<Protected><Taxonomy /></Protected>} />
    </Routes>
  )
}

export default AdminRoutes


