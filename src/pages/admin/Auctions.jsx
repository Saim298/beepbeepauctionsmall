import React from 'react'
import AdminSidebar from './Sidebar.jsx'

const AdminAuctions = () => {
  return (
    <div className="dashboard-root" data-theme={'dark'}>
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">Auctions</h1>
              <span className="page-subtitle">Manage running and upcoming auctions</span>
            </div>
          </header>
          <section className="panel glass">
            <div className="panel-header space-between">
              <h3>All Auctions</h3>
              <button className="pill">Create Auction</button>
            </div>
            <div className="panel-body">
              <p className="n4-color">Coming soon: table of auctions with filters and actions.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminAuctions


