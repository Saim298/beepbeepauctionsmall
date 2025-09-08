import React from "react";
import Header from "../utils/Header";
import Footer from "../components/frontComponents/Footer";

const Contact = () => {
  return (
    <div>
      <Header />
      {/* <!-- Contact Section start --> */}
      <section
        className="contact-section second position-relative p1-2nd-bg-color py-20 bg-img-start py-5"
        data-bg="./assets/images/contact-bg-1.webp"
      >
        <div className="container-fluid cus-padding">
          <div className="row gy-5 gy-lg-0 justify-content-between">
            <div className="col-lg-6 col-xxl-6 order-1 order-xl-0 d-center flex-column flex-sm-row flex-lg-column flex-xl-row justify-content-end align-items-end mb-0 mb-lg-7">
              <div className="col-12 col-sm-6 col-lg-8 col-xl-5 position-relative d-grid p1-bg-color py-6 py-md-8 px-5 px-md-7">
                <span className="fs-six fw-light text-uppercase n1-color mt-1">
                  Call Us
                </span>
                <span className="n1-color fw-bold text-uppercase fs-five">
                  + 111 222 333
                </span>
                <div className="d-center fs-two n1-2nd-color p-1 position-absolute end-0 top-0">
                  <i className="ph ph-phone-call"></i>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-8 col-xl-6 position-relative d-grid p3-bg-color py-6 py-md-8 px-5 px-md-7">
                <span className="fs-six fw-light text-uppercase n1-color mt-1">
                  MAIL Us
                </span>
                <span className="n1-color fw-bold text-uppercase fs-five">
                  <a
                    href="cdn-cgi/l/email-protection"
                    className="__cf_email__"
                    data-cfemail="c8a1a6aea788adb0a9a5b8a4ade6aba7a5"
                  >
                    [email&#160;protected]
                  </a>
                </span>
                <div className="d-center fs-two n1-2nd-color p-1 position-absolute end-0 top-0">
                  <i className="ph ph-envelope-open"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xxl-6">
              <div className="form-area cus-border border b-eleventh rounded-4 n1-3rd-bg-color py-6 py-md-12 py-lg-16 px-4 px-md-8 px-lg-12">
                <div className="section-text mb-6 mb-md-10 d-grid gap-2">
                  <span className="n4-color fw-medium text-uppercase">
                    Have any Questions?
                  </span>
                  <h2 className="text-uppercase">
                    <span className="n4-color">Drop Us</span>
                    <span className="fw-normal n4-color">a Line</span>
                  </h2>
                  <span className="n4-color mt-1">
                    We’ve been waiting for you!
                  </span>
                </div>
                <form action="#">
                  <div className="row gy-6 gy-md-10">
                    <div className="col-md-6 col-lg-12 col-xl-6 d-grid gap-2">
                      <label
                        for="contact-name"
                        className="n4-color text-capitalize"
                      >
                        Name:
                      </label>
                      <div className="input-area second cus-border border b-fourth rounded-4 d-center gap-2 transition px-5 px-md-8 py-3 py-lg-5">
                        <div className="input-item w-100">
                          <input
                            type="text"
                            id="contact-name"
                            className="w-100 n4-color"
                            placeholder="Write your Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-12 col-xl-6 d-grid gap-2">
                      <label
                        for="contact-email"
                        className="n4-color text-capitalize"
                      >
                        Email address:
                      </label>
                      <div className="input-area second cus-border border b-fourth rounded-4 d-center gap-2 transition px-5 px-md-8 py-3 py-lg-5">
                        <div className="input-item w-100">
                          <input
                            type="text"
                            id="contact-email"
                            className="w-100 n4-color"
                            placeholder="Write your email"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 d-grid gap-2">
                      <label
                        for="contact-subject"
                        className="n4-color text-capitalize"
                      >
                        subject:
                      </label>
                      <div className="input-area second cus-border border b-fourth rounded-4 d-center gap-2 transition px-5 px-md-8 py-3 py-lg-5">
                        <div className="input-item w-100">
                          <input
                            type="text"
                            id="contact-subject"
                            className="w-100 n4-color"
                            placeholder="Write your Subject"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 d-grid gap-2">
                      <label
                        for="contact-message"
                        className="n4-color text-capitalize"
                      >
                        message:
                      </label>
                      <div className="input-area second cus-border border b-fourth rounded-4 d-center gap-2 transition px-5 px-md-8 py-3 py-lg-5">
                        <div className="input-item w-100">
                          <textarea
                            rows="4"
                            id="contact-message"
                            placeholder="Your Message"
                            className="w-100 n4-color"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex">
                      <button
                        type="button"
                        aria-label="Submit Button"
                        className="box-style style-one rounded-pill n1-bg-color d-center justify-content-start transition py-3 py-md-4 px-3 px-md-6 px-xl-12"
                      >
                        <span className="fs-eight n4-color transition text-uppercase fw-semibold">
                          Send Message
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Contact Section end --> */}
      <Footer />
    </div>
  );
};

export default Contact;
