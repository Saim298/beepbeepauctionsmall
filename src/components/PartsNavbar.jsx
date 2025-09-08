import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";
import logo from "../image/logo.png";

const PartsNavbar = ({ q, setQ }) => {
  const { itemCount } = useCart();

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top" style={{ zIndex: 1030 }}>
        <div className="container-fluid px-3 px-md-4 px-lg-6">
          {/* Brand */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Beep Products" style={{width:"4rem"}} className="me-2" />
            <span className="fw-bold fs-4" style={{color: '#D70007'}}>Beep Products</span>
          </Link>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Navigation */}
          <div className="navbar-nav ms-auto d-none d-lg-flex flex-row align-items-center gap-4">
            {/* Search */}
            <div className="position-relative" style={{ width: "300px" }}>
              <input
                type="text"
                className="form-control form-control-lg rounded-pill pe-5"
                placeholder="Search parts, brands, models..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ 
                  backgroundColor: "#f8f9fa",
                  border: "2px solid #e9ecef",
                  fontSize: "14px"
                }}
              />
              <FiSearch 
                className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                size={18}
              />
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="btn rounded-pill px-4 position-relative" 
              style={{backgroundColor: '#D70007', color: 'white'}}
            >
              <FiShoppingCart className="me-2" size={18} />
              Cart
              {itemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary rounded-circle p-2"
                data-bs-toggle="dropdown"
              >
                <FiUser size={20} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/signin">Sign In</Link></li>
                <li><Link className="dropdown-item" to="/signup">Sign Up</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="d-lg-none ms-auto d-flex align-items-center gap-3">
            <Link to="/cart" className="btn btn-primary btn-sm rounded-pill position-relative">
              <FiShoppingCart size={16} />
              {itemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: '10px' }}>
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/signin" className="btn btn-outline-primary btn-sm rounded-pill">
              <FiUser size={16} />
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="d-lg-none border-top bg-light px-3 py-2">
          <div className="position-relative">
            <input
              type="text"
              className="form-control rounded-pill pe-5"
              placeholder="Search parts..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <FiSearch 
              className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
              size={16}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default PartsNavbar;
