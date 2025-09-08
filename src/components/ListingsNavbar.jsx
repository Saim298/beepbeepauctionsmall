import React, { useState } from 'react';
import './ListingsNavbar.css';
import { MdDirectionsCar, MdSearch, MdFilterList, MdClear, MdHome, MdAdd, MdPerson } from 'react-icons/md';
import logo from '../image/logo.png';
const ListingsNavbar = ({ 
  q = "", 
  setQ = () => {}, 
  filters = {}, 
  setFilters = () => {}, 
  makes = [], 
  models = [], 
  categories = [], 
  activeFilterCount = 0 
}) => {
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const clearAllFilters = () => {
    setQ("");
    setFilters({ make: "", model: "", year: "", category: "", priceRange: "", location: "" });
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm position-fixed w-100" style={{ top: 0, zIndex: 1030 }}>
        <div className="container-fluid px-3 px-lg-4">
          
          {/* Brand */}
          <a className="navbar-brand fw-bold text-primary" href="/">
           <img src={logo} alt="" style={{width:"5rem"}} />
          </a>

          {/* Mobile Filter Toggle */}
          <button 
            className="btn btn-outline-primary d-lg-none"
            type="button" 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <MdFilterList className="me-1" size={18} />
            <span className="badge bg-primary rounded-pill ms-1">{activeFilterCount}</span>
          </button>

          {/* Account & Actions */}
          <div className="d-flex align-items-center gap-2">
            <a href="/sell-car" className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6 btn-sm d-none d-md-block">
              <MdAdd className="me-1" size={16} />Sell Car
            </a>
            
            <div className="dropdown">
              <button 
                className="btn btn-outline-secondary btn-sm dropdown-toggle"
                type="button" 
                data-bs-toggle="dropdown"
              >
                <MdPerson size={18} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="/dashboard">Dashboard</a></li>
                <li><a className="dropdown-item" href="/my-cars">My Cars</a></li>
                <li><a className="dropdown-item" href="/settings">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="/logout">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Filter Bar */}
      <div className="bg-light border-bottom position-fixed w-100" style={{ top: '5rem', zIndex: 1029 }}>
        <div className="container-fluid px-3 px-lg-4 py-4">
          
          {/* Desktop Filters */}
          <div className="d-none d-lg-flex align-items-center gap-3 flex-wrap">
            
            {/* Filter Badge & Clear */}
            <div className="d-flex align-items-center">
              <button 
                className={`btn btn-sm d-flex align-items-center gap-2 ${activeFilterCount > 0 ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={clearAllFilters}
                disabled={activeFilterCount === 0}
              >
                <MdFilterList size={16} />
                <span className="badge bg-white text-dark">{activeFilterCount}</span>
                {activeFilterCount > 0 && <span>Clear All</span>}
              </button>
            </div>

            {/* Search */}
            <div className="flex-grow-1" style={{ maxWidth: '300px' }}>
              <div className="input-group input-group-sm">
                <span className="input-group-text"><MdSearch size={16} /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search cars..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <select 
              className="form-select form-select-sm"
              style={{ width: '140px' }}
              value={filters.category || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Vehicle Type</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            {/* Make */}
            <select 
              className="form-select form-select-sm"
              style={{ width: '120px' }}
              value={filters.make || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value, model: "" }))}
            >
              <option value="">Make</option>
              {makes.map(make => (
                <option key={make._id} value={make._id}>{make.name}</option>
              ))}
            </select>

            {/* Model */}
            <select 
              className="form-select form-select-sm"
              style={{ width: '120px' }}
              value={filters.model || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
              disabled={!filters.make}
            >
              <option value="">Model</option>
              {models.map(model => (
                <option key={model._id} value={model._id}>{model.name}</option>
              ))}
            </select>

            {/* Year */}
            <select 
              className="form-select form-select-sm"
              style={{ width: '100px' }}
              value={filters.year || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            >
              <option value="">Year</option>
              {Array.from({length: 20}, (_, i) => 2024 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Price Range */}
            <select 
              className="form-select form-select-sm"
              style={{ width: '130px' }}
              value={filters.priceRange || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
            >
              <option value="">Price Range</option>
              <option value="0-50000">$0 - $50K</option>
              <option value="50000-100000">$50K - $100K</option>
              <option value="100000-200000">$100K - $200K</option>
              <option value="200000-500000">$200K - $500K</option>
              <option value="500000-">$500K+</option>
            </select>

            {/* Location */}
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: '120px' }}
              placeholder="Location"
              value={filters.location || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />

          </div>

          {/* Mobile Search */}
          <div className="d-lg-none">
            <div className="input-group input-group-sm mb-2">
              <span className="input-group-text"><MdSearch size={16} /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search cars..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className="d-lg-none border-top bg-white p-3">
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label small text-muted">Vehicle Type</label>
                <select 
                  className="form-select form-select-sm"
                  value={filters.category || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">All Types</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small text-muted">Make</label>
                <select 
                  className="form-select form-select-sm"
                  value={filters.make || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value, model: "" }))}
                >
                  <option value="">All Makes</option>
                  {makes.map(make => (
                    <option key={make._id} value={make._id}>{make.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small text-muted">Model</label>
                <select 
                  className="form-select form-select-sm"
                  value={filters.model || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                  disabled={!filters.make}
                >
                  <option value="">All Models</option>
                  {models.map(model => (
                    <option key={model._id} value={model._id}>{model.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small text-muted">Year</label>
                <select 
                  className="form-select form-select-sm"
                  value={filters.year || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                >
                  <option value="">All Years</option>
                  {Array.from({length: 20}, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small text-muted">Price Range</label>
                <select 
                  className="form-select form-select-sm"
                  value={filters.priceRange || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                >
                  <option value="">All Prices</option>
                  <option value="0-50000">$0 - $50K</option>
                  <option value="50000-100000">$50K - $100K</option>
                  <option value="100000-200000">$100K - $200K</option>
                  <option value="200000-500000">$200K - $500K</option>
                  <option value="500000-">$500K+</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small text-muted">Location</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Enter location"
                  value={filters.location || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="col-12 mt-3">
                <button 
                  className="btn btn-danger btn-sm w-100"
                  onClick={clearAllFilters}
                  disabled={activeFilterCount === 0}
                >
                  <MdClear className="me-2" size={16} />
                  Clear All Filters ({activeFilterCount})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ListingsNavbar;
