import React, { useEffect, useState } from "react";
import {
  FaGripHorizontal,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import image from "../image/logo.png";

const Header = () => {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldFix = window.scrollY > 50;
      setIsHeaderFixed(shouldFix);
    };
    // initial state and listener
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* <!-- header-section start --> */}
      <header
        className={`header-section index-three transition${
          isHeaderFixed ? " header-fixed animated fadeInDown" : ""
        }`}
      >
        <div className="container-fluid px-0">
          <div className="main-navbar px-3 px-md-5 py-3 py-md-5">
            <nav className="navbar-custom">
              <div className="d-flex align-items-center justify-content-between">
                <Link
                  to="/"
                  className="nav-brand d-flex align-items-center gap-2 d-lg-none"
                >
                  <img src={image} alt="logo" />
                </Link>
                <div className="d-flex gap-6">
                  <button
                    className="navbar-toggle-btn d-block d-lg-none"
                    type="button"
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
              <div className="navbar-toggle-item">
                <div className="d-flex gap-6 flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between mt-5 mt-lg-0">
                    <Link to="/"
                    className="navbar-brand logo d-none d-lg-flex d-xl-flex d-lg-flex gap-2 align-items-center"
                  >
                    <img src={image} alt="logo" style={{ width: "4rem" }} />
                    
                  </Link>
                  <ul className="custom-nav third d-lg-flex d-grid gap-3 gap-lg-4">
                    <li className="menu-item position-relative">
                      <Link
                        to="/"
                        className="position-relative pe-5 z-1 slide-second text-uppercase slide-vertical"
                        aria-label="Menu Button"
                        data-splitting
                      >
                        Home
                      </Link>
                    </li>
                    <li className="menu-item position-relative">
                      <Link
                        to="/parts"
                        className="position-relative pe-5 z-1 slide-second text-uppercase slide-vertical"
                        aria-label="Menu Button"
                        data-splitting
                      >
                        Products  
                      </Link>
                    </li>
                    <li className="menu-item position-relative">
                      <Link
                        to="/cart"
                        className="position-relative pe-5 z-1 slide-second text-uppercase slide-vertical"
                        aria-label="Menu Button"
                        data-splitting
                      >
                        Cart  
                      </Link>
                    </li>
                    <li className="menu-item position-relative">
                      <Link
                        to="/about"
                        className="position-relative pe-5 z-1 slide-second text-uppercase slide-vertical"
                        data-splitting
                      >
                        About
                      </Link>
                    </li>

                    <li className="menu-link">
                      <Link
                        to="/contact"
                        className="n1-color slide-second text-uppercase slide-vertical"
                        aria-label="Menu Button"
                        data-splitting
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                  <div className="right-area sidebar-items position-relative d-flex gap-4 gap-xxl-6 align-items-center">
                    
                    <div className="single-item d-none d-xl-block">
                      <Link
                        to="/signin"
                        className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6"
                        aria-level="Rent Car"
                      >
                        <span className="fs-eight n1-color text-uppercase">
                          Register
                        </span>
                      </Link>
                    </div>
                    
                    <span className="position-relative d-center cus-border border-start box-area box-one only-height"></span>
              
                    <div className="single-item">
                      <button
                        type="button"
                        aria-label="Shopping Button"
                        className="box-area box-one box-style style-one cus-border border d-center rounded-circle position-relative"
                      >
                        <span className="d-center transition fs-five n4-color">
                          <FaGripHorizontal />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
      {/* <!-- header-section end --> */}
    </div>
  );
};

export default Header;
