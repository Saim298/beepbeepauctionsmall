import React from 'react'

const ComingSoon = () => {
  return (
    <div>
      {/* <!-- Coming Soon Section start--> */}
      <section className="coming-soon-section position-relative overflow-hidden n1-bg-color" style={{ minHeight: '100vh' }}>

        <div className="container-fluid cus-padding pad-2nd position-relative">
          <div className="content-area row justify-content-center align-items-center text-center" style={{ minHeight: '100vh' }}>
            <div className="col-lg-8 col-xl-6 d-grid gap-4 gap-md-5 reveal-single reveal-text text-one">
              
              {/* Premium Badge */}
              <div className="d-flex justify-content-center">
                <div className="cus-border border b-fourth rounded-pill since-days p-2 d-inline-flex align-items-center flex-wrap gap-4 gap-md-5">
                  <span className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6">
                    <span className="fs-six fw-medium n1-color text-uppercase">
                      Premium Experience
                    </span>
                  </span>
                  <span className="fs-six fw-medium n4-color text-uppercase pe-6">
                    Launching Soon
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <div className="section-area d-grid gap-3 gap-md-4">
                <h1 className="fs-one text-uppercase text-center">
                  <span className="fw-bolder n4-color d-block mb-3">
                    Coming Soon
                  </span>
                  <span className="fw-normal p1-color">
                    Something Amazing
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div className="section-area text-center">
                <p className="fs-six n5-color mb-4 lh-base">
                  We're crafting an extraordinary experience for car enthusiasts and collectors. 
                  Our premium auction platform will revolutionize how you discover, bid on, and acquire the world's most prestigious vehicles.
                </p>
                
            
              </div>

              {/* Features Preview */}
              <div className="section-area text-center">
                <h4 className="n4-color fw-bold mb-4 fs-three">
                  What's Coming
                </h4>
                <ul className="d-flex flex-wrap justify-content-center gap-4 gap-xl-6 mb-0">
                  {[
                    { icon: "fa-solid fa-gavel", text: "Live Auctions" },
                    { icon: "fa-solid fa-car", text: "Premium Vehicles" },
                    { icon: "fa-solid fa-shield-check", text: "Verified Listings" },
                    { icon: "fa-solid fa-users", text: "Expert Support" },
                    { icon: "fa-solid fa-globe", text: "Global Platform" },
                    { icon: "fa-solid fa-crown", text: "VIP Experience" }
                  ].map((feature, idx) => (
                    <li key={idx} className="position-relative d-flex align-items-center gap-3">
                      <span className="box-area box-three style-one rounded-circle d-center position-relative p1-bg-color" style={{
                        width: '40px',
                        height: '40px',
                        minWidth: '40px'
                      }}>
                        <i className={`${feature.icon} n1-color fs-nine`}></i>
                      </span>
                      <span className="text-uppercase fs-nine n4-color fw-medium">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notify Me Button */}
              <div className="btn-area d-flex justify-content-center gap-3 flex-wrap">
                <button className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-4 px-md-6 px-xl-8">
                  <i className="fa-solid fa-bell me-3"></i>
                  <span className="fs-six fw-bold text-uppercase n1-color">Notify Me When Live</span>
                </button>
                
                <a 
                  href="/" 
                  className="box-style style-one rounded-pill cus-border border transition d-center py-3 py-md-4 px-4 px-md-6"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="fa-solid fa-home me-3 n4-color"></i>
                  <span className="fs-six n4-color fw-medium text-uppercase">Back to Home</span>
                </a>
              </div>

              {/* Social Links */}
              <div className="social-area text-center">
                <span className="n5-color fs-seven fw-medium mb-3 d-block">
                  Follow us for updates
                </span>
                <div className="d-flex justify-content-center gap-3">
                  {[
                    { icon: "fa-brands fa-facebook-f", link: "#" },
                    { icon: "fa-brands fa-twitter", link: "#" },
                    { icon: "fa-brands fa-instagram", link: "#" },
                    { icon: "fa-brands fa-linkedin-in", link: "#" }
                  ].map((social, idx) => (
                    <a 
                      key={idx}
                      href={social.link} 
                      className="d-center rounded-circle cus-border border b-fourth transition"
                      style={{
                        width: '50px',
                        height: '50px',
                        textDecoration: 'none'
                      }}
                    >
                      <i className={`${social.icon} n4-color fs-six`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Coming Soon Section end --> */}
    </div>
  )
}

export default ComingSoon
