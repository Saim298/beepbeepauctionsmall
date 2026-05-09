import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PartsNavbar from '../components/PartsNavbar';

const CloverCheckoutFailure = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('error_code');

  useEffect(() => {
    try {
      localStorage.removeItem('clover_checkout_session_id');
    } catch (_) {}
  }, []);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <PartsNavbar q="" setQ={() => {}} filters={{}} setFilters={() => {}} brands={[]} categories={[]} activeFilterCount={0} />
      <section className="section-sidebar details-section position-relative" style={{ marginTop: '110px' }}>
        <div className="container-fluid py-10 px-3 px-md-6">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center">
                <div className="text-danger mb-3" style={{ fontSize: '3rem' }}>
                  ✕
                </div>
                <h4 className="n4-color mb-3">Payment not completed</h4>
                <p className="n5-color mb-2">
                  Your Hosted Checkout session ended without a successful charge. You have not been billed for this
                  attempt.
                </p>
                {errorCode ? (
                  <p className="small text-muted mb-4">
                    Error code: <code>{errorCode}</code>
                  </p>
                ) : (
                  <p className="small text-muted mb-4">No error details were provided.</p>
                )}
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <Link to="/checkout" className="btn btn-primary rounded-pill px-4">
                    Try checkout again
                  </Link>
                  <Link to="/cart" className="btn btn-outline-secondary rounded-pill px-4">
                    Back to cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CloverCheckoutFailure;
