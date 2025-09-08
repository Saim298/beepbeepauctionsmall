import React from 'react'
import AdminSidebar from './Sidebar.jsx'

const AdminDashboard = () => {
  return (
    <div className="dashboard-root" data-theme={'dark'}>
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">Admin Panel</h1>
              <span className="page-subtitle">Secure management area</span>
            </div>
          </header>
          <section className="panel glass">
            <div className="panel-header"><h3>Overview</h3></div>
            <div className="panel-body">
              <p className="n4-color">Welcome, Admin. Add your admin widgets here.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard


