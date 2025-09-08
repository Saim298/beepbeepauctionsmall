import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiTag, FiLayers, FiSettings, FiLogOut, FiGrid, FiCheckCircle } from 'react-icons/fi'
import { MdGavel } from 'react-icons/md'
import logo from '../../image/logo.png'
import { clearAuthToken } from '../../api/client'

const items = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <FiHome /> },
  { label: 'Car Listings', to: '/admin/listings', icon: <FiLayers /> },
  { label: 'Manage Auctions', to: '/admin/auctions', icon: <MdGavel /> },
  { label: 'Auction Approval', to: '/admin/auction-approval', icon: <FiCheckCircle /> },
  { label: 'Taxonomy', to: '/admin/taxonomy', icon: <FiGrid /> },
]

const AdminSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const onLogout = () => { clearAuthToken(); navigate('/signin', { replace: true }) }

  return (
    <aside className="dashboard-sidebar">
      <div className="brand">
        <img src={logo} alt="Beep Auction" />
        <span>Admin</span>
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
        <Link to="/dashboard/settings" className="settings">
          <span className="icon"><FiSettings /></span>
          <span>Settings</span>
        </Link>
        <div className="profile" ref={ref}>
          <button className="logout" onClick={() => setOpen((o) => !o)}>
            <span className="icon"><FiLogOut /></span>
            <span>Account</span>
          </button>
          {open && (
            <div className="dropdown">
              <button className="dropdown-item danger" onClick={onLogout}><span className="icon"><FiLogOut /></span> Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-gradient" />
    </aside>
  )
}

export default AdminSidebar


