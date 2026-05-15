import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiBarChart2, FiTag, FiClock, FiUsers, FiSettings, FiLogOut, FiMessageSquare, FiLayers, FiCheckCircle, FiCreditCard, FiPackage, FiTool, FiSearch, FiStar, FiTruck, FiX, FiBell } from 'react-icons/fi'
import { MdGavel, MdBuild, MdDirectionsCar } from 'react-icons/md'
import logo from '../image/logo.png'
import { apiRequest, getAuthToken, clearAuthToken } from '../api/client'
import NotificationBell from '../components/NotificationBell.jsx'
import { BRAND_NAME, BRAND_NAME_SHORT } from '../constants/brand.js'

const adminItems = [
  { label: 'Overview', to: '/dashboard', icon: <FiHome /> },
  { label: 'Notifications', to: '/dashboard/notifications', icon: <FiBell /> },
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
  { label: 'Notifications', to: '/dashboard/notifications', icon: <FiBell /> },
  { label: 'My Products', to: '/user/parts', icon: <FiTool /> },
  { label: 'My Reviews', to: '/user/reviews', icon: <FiStar /> },
  { label: 'My Orders', to: '/user/orders', icon: <FiPackage /> },
  { label: 'Seller Orders', to: '/user/seller-orders', icon: <FiTruck /> },
  { label: 'Browse Products', to: '/parts', icon: <FiSearch /> },
  { label: 'Payment Methods', to: '/user/cards', icon: <FiCreditCard /> },
  { label: 'Chat', to: '/chat', icon: <FiMessageSquare /> },
]

function navItemActive(pathname, to) {
  if (to === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/dashboard/';
  }
  return pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));
}

const Sidebar = ({ mobileOpen = false, onCloseMobile = () => {} }) => {
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

  useEffect(() => {
    onCloseMobile()
  }, [pathname])

  const onLogout = () => {
    clearAuthToken()
    navigate('/signin', { replace: true })
  }

  const items = userRole === 'admin' ? adminItems : userItems
  const brandText = userRole === 'admin' ? `${BRAND_NAME_SHORT} Admin` : BRAND_NAME

  return (
    <>
    <aside className={`dashboard-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <button className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="Close sidebar">
        <FiX />
      </button>
      <div className="brand">
        <img src={logo} alt={BRAND_NAME} />
        <span>{brandText}</span>
      </div>

      <nav className="nav">
        {items.map((i) => {
          const active = navItemActive(pathname, i.to)
          return (
            <Link key={i.label} to={i.to} onClick={onCloseMobile} className={`nav-item ${active ? 'active' : ''}`}>
              <span className="icon">{i.icon}</span>
              <span className="text">{i.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-notify-slot">
          <NotificationBell />
        </div>
        <Link to="/dashboard/settings" onClick={onCloseMobile} className="settings">
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
              <Link to="/dashboard/settings" className="dropdown-item"><span className="icon"><FiSettings /></span> Account Settings</Link>
              <button className="dropdown-item danger" onClick={onLogout}><span className="icon"><FiLogOut /></span> Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-gradient" />
    </aside>
    <button
      className={`dashboard-sidebar-overlay ${mobileOpen ? 'active' : ''}`}
      onClick={onCloseMobile}
      aria-label="Close sidebar overlay"
    />
    </>
  )
}

export default Sidebar