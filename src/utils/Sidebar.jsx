import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiBarChart2, FiTag, FiClock, FiUsers, FiSettings, FiBell, FiLogOut, FiMessageSquare, FiLayers, FiCheckCircle, FiCreditCard, FiPackage, FiTool, FiSearch, FiStar, FiTruck } from 'react-icons/fi'
import { MdGavel, MdBuild, MdDirectionsCar } from 'react-icons/md'
import logo from '../image/logo.png'
import { apiRequest, getAuthToken, clearAuthToken } from '../api/client'

const adminItems = [
  { label: 'Overview', to: '/dashboard', icon: <FiHome /> },
  { label: 'Analytics', to: '/dashboard/analytics', icon: <FiBarChart2 /> },
  { label: 'Parts Catalog', to: '/admin/parts', icon: <FiTool /> },
  { label: 'Manage Vendors', to: '/admin/vendors', icon: <FiUsers /> },
  { label: 'Parts Approval', to: '/admin/parts-approval', icon: <FiCheckCircle /> },
  { label: 'Categories', to: '/admin/categories', icon: <FiLayers /> },
  { label: 'Chat', to: '/chat', icon: <FiMessageSquare /> },
  { label: 'Orders', to: '/admin/orders', icon: <FiPackage /> },
]

const userItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <FiHome /> },
  { label: 'My Products', to: '/user/parts', icon: <FiTool /> },
  { label: 'My Reviews', to: '/user/reviews', icon: <FiStar /> },
  { label: 'My Orders', to: '/user/orders', icon: <FiPackage /> },
  { label: 'Seller Orders', to: '/user/seller-orders', icon: <FiTruck /> },
  { label: 'Browse Products', to: '/parts', icon: <FiSearch /> },
  { label: 'Payment Methods', to: '/user/cards', icon: <FiCreditCard /> },
  { label: 'Chat', to: '/chat', icon: <FiMessageSquare /> },
]

const Sidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [userRole, setUserRole] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const token = getAuthToken()
        if (!token) return
        const { user } = await apiRequest('/api/auth/me', { token })
        if (user) {
          setUserRole(user.role || '')
          if (user.avatarFile || user.avatarUrl) {
            const base = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'
            const src = user.avatarFile ? `${base}${user.avatarFile}` : user.avatarUrl
            setAvatarUrl(src)
          }
        }
      } catch {}
    }
    load()
  }, [])

  const onLogout = () => {
    clearAuthToken()
    navigate('/signin', { replace: true })
  }

  const items = userRole === 'admin' ? adminItems : userItems
  const brandText = userRole === 'admin' ? 'Beep Admin' : 'Beep Products'

  return (
    <aside className="dashboard-sidebar">
      <div className="brand">
        <img src={logo} alt="Beep Products" />
        <span>{brandText}</span>
      </div>

      <nav className="nav">
        {items.map((i) => {
          const active = pathname.startsWith(i.to)
          return (
            <Link key={i.label} to={i.to} className={`nav-item ${active ? 'active' : ''}`}>
              <span className="icon">{i.icon}</span>
              <span className="text">{i.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <Link to="#" className="notify">
          <span className="icon"><FiBell /></span>
          <span>Notifications</span>
          <span className="badge dot"></span>
        </Link>
        <Link to="/dashboard/settings" className="settings">
          <span className="icon"><FiSettings /></span>
          <span>Settings</span>
        </Link>
        <div className="profile" ref={ref}>
          <button className="logout" onClick={() => setOpen((o) => !o)}>
            <span className="icon"><FiLogOut /></span>
            <span>Profile</span>
          </button>
          {open && (
            <div className="dropdown">
              <Link to="#" className="dropdown-item"><span className="icon"><FiSettings /></span> Account Settings</Link>
              <Link to="#" className="dropdown-item"><span className="icon"><FiBell /></span> Notifications</Link>
              <button className="dropdown-item danger" onClick={onLogout}><span className="icon"><FiLogOut /></span> Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-gradient" />
    </aside>
  )
}

export default Sidebar