import React from "react";
import image from "../../image/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      {/* <!-- Footer Area Start --> */}
      <footer className="footer-section n4-bg-color position-relative">
        <div className="container-fluid footer-inner position-relative pt-120 rounded-5 rounded-top-0">
          <div className="cus-padding position-relative">
            <div className="row gy-5 gy-md-0 align-items-center justify-content-between">
              <div className="col-md-6">
                <div className="rent-car d-center position-relative">
                  <div className="img-area pe-none">
                    <img
                      src="assets/images/footer-img-1.webp"
                      className="w-100"
                      alt="image"
                    />
                  </div>
                  <div className="abs-area position-absolute top-0 start-0 d-grid gap-1 p-3 p-lg-4 p-xl-10">
                    <h3 className="n1-color font-secondary fw-bold text-uppercase">
                      Auction a Car
                    </h3>
                    <p className="n1-color fw-normal">
                      Flexible auctions for your cars
                    </p>
                    <div className="btn-area book-online d-inline-flex mt-4">
                      <Link
                        to="/comming-soon"
                        className="d-center justify-content-start gap-2 border-item second position-relative"
                      >
                        <span className="n1-color fs-eight text-uppercase">
                          List Now
                        </span>
                        <span className="d-center transition fs-six n1-color">
                          <i className="ph ph-arrow-up-right"></i>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="rent-car d-center position-relative">
                  <div className="img-area pe-none">
                    <img
                      src="assets/images/footer-img-2.webp"
                      className="w-100"
                      alt="image"
                    />
                  </div>
                  <div className="abs-area position-absolute top-0 start-0 d-grid gap-1 p-3 p-lg-4 p-xl-10">
                    <h3 className="n1-color font-secondary fw-bold text-uppercase">
                      List a Cars
                    </h3>
                    <p className="n1-color fw-normal">
                      Earn on your idle cars
                    </p>
                    <div className="btn-area book-online d-inline-flex mt-4">
                      <Link 
                        to="/list-your-car"
                        className="d-center justify-content-start gap-2 border-item second position-relative"
                      >
                        <span className="n1-color fs-eight text-uppercase">
                          List Now
                        </span>
                        <span className="d-center transition fs-six n1-color">
                          <i className="ph ph-arrow-up-right"></i>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row cus-row justify-content-startaa justify-content-between gy-9 gy-xxl-0 pt-120 pb-8 cus-border border-bottom b-second">
              <div className="col-sm-6 d-flex justify-content-start">
                <a href="index-5.html" className="img-area d-center gap-1">
                  <img
                    src={image}
                    className="max-un"
                    style={{ width: "6rem" }}
                    alt="favicon"
                  />
                 
                </a>
              </div>
              <div className="col-sm-6 footer-link d-flex justify-content-start justify-content-sm-end">
                <div className="single-box">
                  <ul className="d-flex gap-3 gap-md-4 overflow-hidden">
                    <li>
                      <Link to="/comming-soon"
                        className="d-center justify-content-start transition n1-color"
                      >
                        <span className="me-2 transition">About</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/comming-soon"
                        className="d-center justify-content-start transition n1-color"
                      >
                        <span className="me-2 transition">FAQ’s</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/comming-soon"
                        className="d-center justify-content-start transition n1-color"
                      >
                        <span className="me-2 transition">Luxury Cars</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/comming-soon"
                        className="d-center justify-content-start transition n1-color"
                      >
                        <span className="me-2 transition">Special Offers</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row cus-row justify-content-start justify-content-xl-between py-5">
              <div className="col-sm-6 col-xxl-6 d-center justify-content-start cus-border border-end b-second">
                <p className="text-nowrap n1-color">Follow US:</p>
                <ul className="d-center justify-content-start justify-content-sm-center gap-2 gap-md-3 social-area p-3 p-md-5 transition">
                  <li>
                    <a
                      href="https://x.com/beepbeepauctions"
                      aria-label="Twitter"
                      className="box-area box-six box-style style-one n1-4th-bg-color d-center rounded-circle"
                    >
                      <span className="d-center transition fs-six n1-color">
                        <i className="fa-brands fa-x-twitter"></i>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/beepbeepauctions"
                      aria-label="linkedin"
                      className="box-area box-six box-style style-one n1-4th-bg-color d-center rounded-circle"
                      style={{ "--x": "14px", "--y": "2px" }}
                    >
                      <span className="d-center transition fs-six n1-color">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/beepbeepauctions"
                      aria-label="instagram"
                      className="box-area box-six box-style style-one n1-4th-bg-color d-center rounded-circle"
                    >
                      <span className="d-center transition fs-six n1-color">
                        <i className="fa-brands fa-instagram"></i>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-sm-6 col-xxl-6 footer-link d-grid gap-3 gap-md-4 d-xl-flex justify-content-between ps-4 ps-sm-10 py-6 py-sm-18">
                <div className="d-center justify-content-start gap-3 gap-md-4">
                  <span className="d-center transition fs-eight n1-color box-area box-one n1-4th-bg-color d-center rounded-circle">
                    <i className="ph ph-phone-call"></i>
                  </span>
                  <div className="d-center align-items-start flex-column gap-1">
                    <span className="fs-six fw-normal n1-color mt-1">
                      Call Us:
                    </span>
                    <span className="n1-color fw-bold fs-five">
                      + 111 222 333
                    </span>
                  </div>
                </div>
                <div className="d-center justify-content-start gap-3 gap-md-4">
                  <span className="d-center transition fs-eight n1-color box-area box-one n1-4th-bg-color d-center rounded-circle">
                    <i className="ph ph-envelope-open"></i>
                  </span>
                  <div className="d-center align-items-start flex-column gap-1">
                    <span className="fs-six fw-normal n1-color mt-1">
                      Email US:
                    </span>
                    <span className="n1-color fw-bold fs-five">
                      <a
                        href="mailto:beepbeepauctions@gmail.com"
                      >
                        beepbeepauctions@gmail.com
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="abs-area position-absolute start-50 item-centerX pe-none">
            <span className="text-uppercase text-gradient second footer-text display-four">
              Beep Beep
            </span>
          </div>
        </div>
        <div className="container-fluid py-5 py-md-7">
  <div className="row gy-5 gy-md-0 cus-padding justify-content-between py-4 py-md-6">
    <div className="col-md-6 order-1 order-md-0">
      <div className="copyright text-center text-md-start">
        <p className="n1-color">
          <Link to="/">Beep Beep</Link> ©
        </p>
      </div>
    </div>
    <div className="col-md-6">
      <div className="text-end h-100 d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-end gap-4">
        
        {/* Download Buttons (inline) */}
        <div className="download-buttons d-flex flex-row gap-3">
          {/* Android Download */}
          <a
            href="#"
            className="download-btn d-flex align-items-center gap-3 p-3 rounded-3 transition"
            style={{
              backgroundColor: '#000',
              color: 'white',
              textDecoration: 'none',
              minWidth: '200px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            <div className="app-icon">
              <i className="fab fa-google-play fs-three"></i>
            </div>
            <div className="app-info text-start">
              <div className="app-label fs-ten opacity-75">GET IT ON</div>
              <div className="app-name fw-bold">Google Play</div>
            </div>
          </a>

          {/* iOS Download */}
          <a
            href="#"
            className="download-btn d-flex align-items-center gap-3 p-3 rounded-3 transition"
            style={{
              backgroundColor: '#000',
              color: 'white',
              textDecoration: 'none',
              minWidth: '200px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            <div className="app-icon">
              <i className="fab fa-apple fs-three"></i>
            </div>
            <div className="app-info text-start">
              <div className="app-label fs-ten opacity-75">Download on the</div>
              <div className="app-name fw-bold">App Store</div>
            </div>
          </a>
        </div>

        {/* Policies */}
        <div className="d-flex flex-row align-items-center gap-3 mt-3 mt-md-0">
          <Link to="/comming-soon">Terms & Conditions</Link>
          <span className="cus-border border-end d-none d-sm-flex h-100"></span>
          <Link to="/comming-soon">Privacy Policy</Link>
        </div>

      </div>
    </div>
  </div>
</div>

      </footer>
      {/* <!-- Footer Area End --> */}
    </div>
  );
};

export default Footer;
