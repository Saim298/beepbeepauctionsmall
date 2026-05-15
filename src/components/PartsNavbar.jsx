import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";
import logo from "../image/logo.png";
import "./parts-navbar-theme.css";
import { BRAND_NAME } from "../constants/brand.js";

const PartsNavbar = ({ q, setQ, variant = "light" }) => {
  const { itemCount } = useCart();
  const isDark = variant === "dark";

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top shadow-sm ${isDark ? "parts-navbar-dark" : "navbar-light bg-white"}`}
      style={{ zIndex: 1030 }}
    >
      <div className="container-fluid px-3 px-md-4 px-lg-6">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt={BRAND_NAME} style={{ width: "4rem" }} className="me-2" />
          <span className="fw-bold fs-4" style={{ color: "#D70007" }}>
            {BRAND_NAME}
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="navbar-nav ms-auto d-none d-lg-flex flex-row align-items-center gap-4">
          <div className="position-relative" style={{ width: "300px" }}>
            <input
              type="text"
              className="form-control form-control-lg rounded-pill pe-5"
              placeholder="Search parts, brands, models..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={
                isDark
                  ? { fontSize: "14px" }
                  : {
                      backgroundColor: "#f8f9fa",
                      border: "2px solid #e9ecef",
                      fontSize: "14px",
                    }
              }
            />
            <FiSearch
              className={`position-absolute top-50 end-0 translate-middle-y me-3 ${isDark ? "parts-navbar-dark__search-icon" : "text-muted"}`}
              size={18}
              aria-hidden
            />
          </div>

          <Link
            to="/cart"
            className="btn rounded-pill px-4 position-relative"
            style={{ backgroundColor: "#D70007", color: "white" }}
          >
            <FiShoppingCart className="me-2" size={18} aria-hidden />
            Cart
            {itemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                {itemCount}
              </span>
            )}
          </Link>

          <div className="dropdown">
            <button className="btn btn-outline-secondary rounded-circle p-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <FiUser size={20} aria-hidden />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/signin">
                  Sign In
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/signup">
                  Sign Up
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/dashboard">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="d-lg-none ms-auto d-flex align-items-center gap-3">
          <Link to="/cart" className="btn btn-primary btn-sm rounded-pill position-relative">
            <FiShoppingCart size={16} aria-hidden />
            {itemCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                style={{ fontSize: "10px" }}
              >
                {itemCount}
              </span>
            )}
          </Link>
          <Link to="/signin" className="btn btn-outline-primary btn-sm rounded-pill">
            <FiUser size={16} aria-hidden />
          </Link>
        </div>
      </div>

      <div className={`d-lg-none px-3 py-2 border-top ${isDark ? "parts-navbar-dark__mobile-bar" : "bg-light"}`}>
        <div className="position-relative">
          <input
            type="text"
            className="form-control rounded-pill pe-5"
            placeholder="Search parts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <FiSearch
            className={`position-absolute top-50 end-0 translate-middle-y me-3 ${isDark ? "parts-navbar-dark__search-icon" : "text-muted"}`}
            size={16}
            aria-hidden
          />
        </div>
      </div>
    </nav>
  );
};

export default PartsNavbar;
