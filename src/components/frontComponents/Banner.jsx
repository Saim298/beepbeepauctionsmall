import React from 'react'
import BeepVintageVideo from '../../assets/Videos/Beep Vintage Car.mp4'

const Banner = () => {
  return (
    <div>

      {/* <!-- banner section start--> */}
      <section className="banner-section index-three position-relative overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Video Background */}
        <div className="video-background banner-video-wrap position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: 1 }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-100 h-100 banner-hero-video"
          >
            <source src={BeepVintageVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for better text readability */}
          <div
            className="position-absolute w-100 h-100"
            style={{
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 2
            }}
          ></div>
        </div>

        <div className="container-fluid cus-padding pad-2nd position-relative" style={{ zIndex: 3 }}>
          <div className="content-area row justify-content-between align-items-center pt-16 mt-md-20 mt-0 mt-md-20" style={{ minHeight: '80vh', position: 'relative', zIndex: 10 }}>
            <div className="col-md-6 text-start d-grid gap-3 gap-md-4 reveal-single reveal-text text-one" style={{ position: 'relative', zIndex: 15 }}>

            </div>
            <div className="col-md-5 d-flex flex-column gap-3 gap-md-4">
              <ul className="d-flex">
                <li className="d-center me-n3">
                  <span className="img-area cus-border border b-seventh rounded-circle box-area box-ten" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                    <img
                      src="assets/images/customer-img-1.webp"
                      className="rounded-circle"
                      alt="Happy Bidder"
                    />
                  </span>
                </li>
                <li className="d-center me-n3">
                  <span className="img-area cus-border border b-seventh rounded-circle box-area box-ten" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                    <img
                      src="assets/images/customer-img-2.webp"
                      className="rounded-circle"
                      alt="Satisfied Customer"
                    />
                  </span>
                </li>
                <li className="d-center me-n3">
                  <span className="img-area cus-border border b-seventh rounded-circle box-area box-ten" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                    <img
                      src="assets/images/customer-img-3.webp"
                      className="rounded-circle"
                      alt="Car Enthusiast"
                    />
                  </span>
                </li>
                <li className="d-center me-n3">
                  <span className="img-area cus-border border b-seventh rounded-circle box-area box-ten" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                    <img
                      src="assets/images/customer-img-4.webp"
                      className="rounded-circle"
                      alt="Winning Bidder"
                    />
                  </span>
                </li>
                <li className="d-center me-n3">
                  <span className="d-center cus-border border b-seventh rounded-circle box-area box-ten fs-six p1-bg-color">
                    <i className="ph ph-plus"></i>
                  </span>
                </li>
              </ul>
              <div className="total-review">
                <span className="text-white text-uppercase fw-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                  <a
                    href="#"
                    className="text-white text-decoration-underline"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                  >
                    Join Beepbeep Community
                  </a>
                  {/* Join Beepbeep Community */}
                </span>
              </div>
              <p className="fs-six text-white mb-2 mt-4 mt-md-6" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                Discover premium car products, vintage components, and exclusive accessories. Join the most trusted car products marketplace where quality meets affordability.
              </p>
              <ul className="ul-dots d-center d-grid d-sm-flex flex-wrap justify-content-start gap-5 gap-xl-8">
                <li className="position-relative d-center justify-content-start gap-3">
                  <span className="box-area box-three style-one rounded-circle d-center position-relative p1-bg-color"></span>
                  <span className="text-uppercase fs-nine text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                    Quality products
                  </span>
                </li>
                <li className="position-relative d-center justify-content-start gap-3">
                  <span className="box-area box-three style-one rounded-circle d-center position-relative p1-bg-color"></span>
                  <span className="text-uppercase fs-nine text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                    Verified Sellers
                  </span>
                </li>
                <li className="position-relative d-center justify-content-start gap-3">
                  <span className="box-area box-three style-one rounded-circle d-center position-relative p1-bg-color"></span>
                  <span className="text-uppercase fs-nine text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                    Fast Shipping
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <form
            action="#"
            className="cus-border border b-fourth rounded-pill p-2 mt-6 mt-xl-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="row gx-0 gx-md-2 gy-3 gy-xxl-0">
              <div className="col-md-6 col-lg-5 col-xxl-4">
                <div className="input-area second cus-border border b-sixth rounded-pill d-center gap-2 transition px-4 px-md-5 py-3 py-lg-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <span className="fs-five d-center text-white">
                    <i className="ph ph-car"></i>
                  </span>
                  <div className="input-item w-100">
                    <input
                      type="text"
                      className="w-100 text-white"
                      placeholder="Product Name/Brand"
                      style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-lg-2 col-xxl-2">
                <div className="input-area second cus-border border b-sixth rounded-pill d-center gap-2 transition px-4 px-md-5 py-3 py-lg-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <span className="fs-five d-center text-white">
                    <i className="ph ph-currency-dollar"></i>
                  </span>
                  <div className="input-item w-100">
                    <input
                      type="text"
                      className="w-100 text-white"
                      placeholder="Price Range"
                      style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-lg-4 col-xl-3 col-xxl-2 d-flex flex-wrap flex-sm-nowrap gap-2">
                <div className="single-select third w-100 d-center gap-2 transition px-4 px-md-5 py-3 py-lg-4 cus-border border b-sixth rounded-pill" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <span className="fs-five d-center text-white input-card">
                    <i className="ph ph-list"></i>
                  </span>
                  <select className="select-two text-white" style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}>
                    <option value="" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Product Category</option>
                    <option value="engine" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Jackets</option>
                    <option value="brakes" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Surveniers</option>
                    <option value="suspension" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Accesories</option>
                    <option value="electrical" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Thx</option>
                  </select>
                </div>

              </div>

              <div className="col-md-4 col-lg-3 col-xxl-2">
                <div className="input-area second cus-border border b-sixth rounded-pill d-center gap-2 transition px-4 px-md-5 py-3 py-lg-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <span className="fs-five d-center text-white">
                    <i className="ph ph-map-pin"></i>
                  </span>
                  <div className="input-item w-100">
                    <input
                      type="text"
                      className="w-100 text-white"
                      placeholder="Location"
                      style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4 col-lg-3 col-xxl-2 d-flex justify-content-center justify-content-md-start">
                <div className="btn-area w-100">
                  <button
                    type="submit"
                    className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6"

                  >
                    <i className="ph ph-magnifying-glass" style={{ fontSize: '18px' }}></i>
                    <span>Search products</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      {/* <!-- banner section end --> */}
    </div>
  )
}

export default Banner