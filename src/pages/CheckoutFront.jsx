import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiCreditCard, FiMapPin, FiUser, FiMail, FiPhone, FiShoppingBag } from 'react-icons/fi';
import { HiHome, HiChevronRight } from "react-icons/hi";
import { useCart } from '../context/CartContext';
import { getAuthToken, apiRequest } from '../api/client.js';
import PartsNavbar from '../components/PartsNavbar';

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

const CheckoutFront = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card', // Default payment method
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      sameAsShipping: true,
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/signin');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Get current user
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          setShippingInfo(prev => ({
            ...prev,
            fullName: data.user.name || '',
            email: data.user.email || ''
          }));
        } else {
          navigate('/signin');
        }
      })
      .catch(() => navigate('/signin'));
  }, [navigate, items.length]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          partId: item.partId,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone
        },
        paymentMethod: paymentInfo.method,
        buyerNotes: shippingInfo.notes || ''
      };

      console.log('🛒 Creating order:', orderData);
      
      // Validate required fields before sending
      if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
        alert('Please fill in all required shipping information.');
        setLoading(false);
        return;
      }

      if (!items || items.length === 0) {
        alert('Your cart is empty.');
        setLoading(false);
        return;
      }
      
      // Create order via API
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        body: orderData
      });

      console.log('API Response:', response);

      if (response.success) {
        // Clear cart after successful order
        clearCart();
        
        // Show success message
        alert(`Order placed successfully! 🎉\n\nOrder ID: ${response.order.orderNumber}\n\nYou will receive an email confirmation shortly.`);
        
        // Redirect to buyer orders page
        navigate('/user/orders');
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage = error.message || error.error || 'Failed to place order. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const toAbsUrl = (u) => {
    if (!u) return '/assets/images/handpicked-img-1.webp';
    if (u.startsWith('http') || u.startsWith('data:')) return u;
    return `${API}${u}`;
  };

  const renderShippingForm = () => (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <h4 className="n4-color mb-4 d-flex align-items-center">
        <FiMapPin className="me-2" />
        Shipping Information
      </h4>
      
      <form onSubmit={handleShippingSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label n4-color fw-semibold">Full Name *</label>
            <input
              type="text"
              className="form-control"
              value={shippingInfo.fullName}
              onChange={(e) => setShippingInfo(prev => ({...prev, fullName: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label n4-color fw-semibold">Email *</label>
            <input
              type="email"
              className="form-control"
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo(prev => ({...prev, email: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label n4-color fw-semibold">Phone *</label>
            <input
              type="tel"
              className="form-control"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo(prev => ({...prev, phone: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-12">
            <label className="form-label n4-color fw-semibold">Address *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Street address"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo(prev => ({...prev, address: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-4">
            <label className="form-label n4-color fw-semibold">City *</label>
            <input
              type="text"
              className="form-control"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo(prev => ({...prev, city: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-4">
            <label className="form-label n4-color fw-semibold">State *</label>
            <input
              type="text"
              className="form-control"
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo(prev => ({...prev, state: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-4">
            <label className="form-label n4-color fw-semibold">ZIP Code *</label>
            <input
              type="text"
              className="form-control"
              value={shippingInfo.zipCode}
              onChange={(e) => setShippingInfo(prev => ({...prev, zipCode: e.target.value}))}
              required
            />
          </div>
        </div>
        
        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6 rounded-pill mb-3 ">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <h4 className="n4-color mb-4 d-flex align-items-center">
        <FiCreditCard className="me-2" />
        Payment Information
      </h4>
      
      <form onSubmit={handlePaymentSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label n4-color fw-semibold">Card Number *</label>
            <input
              type="text"
              className="form-control"
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={(e) => setPaymentInfo(prev => ({...prev, cardNumber: e.target.value}))}
              maxLength="19"
              required
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label n4-color fw-semibold">Expiry Date *</label>
            <input
              type="text"
              className="form-control"
              placeholder="MM/YY"
              value={paymentInfo.expiryDate}
              onChange={(e) => setPaymentInfo(prev => ({...prev, expiryDate: e.target.value}))}
              maxLength="5"
              required
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label n4-color fw-semibold">CVV *</label>
            <input
              type="text"
              className="form-control"
              placeholder="123"
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo(prev => ({...prev, cvv: e.target.value}))}
              maxLength="4"
              required
            />
          </div>
          
          <div className="col-12">
            <label className="form-label n4-color fw-semibold">Cardholder Name *</label>
            <input
              type="text"
              className="form-control"
              value={paymentInfo.cardholderName}
              onChange={(e) => setPaymentInfo(prev => ({...prev, cardholderName: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-12">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="sameAsShipping"
                checked={paymentInfo.billingAddress.sameAsShipping}
                onChange={(e) => setPaymentInfo(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, sameAsShipping: e.target.checked }
                }))}
              />
              <label className="form-check-label n4-color" htmlFor="sameAsShipping">
                Billing address same as shipping address
              </label>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setStep(1)}>
            Back to Shipping
          </button>
          <button type="submit" className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6 rounded-pill mb-3 px-4 py-2">
            Review Order
          </button>
        </div>
      </form>
    </div>
  );

  const renderOrderReview = () => (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <h4 className="n4-color mb-4 d-flex align-items-center">
        <FiShoppingBag className="me-2" />
        Order Review
      </h4>
      
      {/* Order Items */}
      <div className="mb-4">
        <h5 className="n4-color mb-3">Items</h5>
        <div className="border rounded-3 p-3">
          {items.map((item) => (
            <div key={item.partId} className="d-flex gap-3 align-items-center mb-3 last:mb-0">
              <img
                src={toAbsUrl(item.image)}
                alt={item.name}
                style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div className="n4-color fw-semibold" style={{ fontSize: '14px' }}>{item.name}</div>
                <div className="n5-color" style={{ fontSize: '12px' }}>Qty: {item.quantity}</div>
              </div>
              <div className="fw-semibold" style={{ color: 'var(--primary-500)' }}>
                ${(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Shipping Info */}
      <div className="mb-4">
        <h5 className="n4-color mb-3">Shipping Address</h5>
        <div className="border rounded-3 p-3 n5-color" style={{ fontSize: '14px' }}>
          <div>{shippingInfo.fullName}</div>
          <div>{shippingInfo.address}</div>
          <div>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</div>
          <div>{shippingInfo.email} • {shippingInfo.phone}</div>
        </div>
      </div>
      
      {/* Payment Info */}
      <div className="mb-4">
        <h5 className="n4-color mb-3">Payment Method</h5>
        <div className="border rounded-3 p-3 n5-color" style={{ fontSize: '14px' }}>
          <div>Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</div>
          <div>{paymentInfo.cardholderName}</div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setStep(2)}>
          Back to Payment
        </button>
        <button 
          className="box-style style-two rounded-pill p1-bg-color d-center py-md-4 px-3 px-md-4 px-xl-6 rounded-pill mb-3 px-4"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Placing Order...
            </>
          ) : (
            <>
              <FiLock className="me-2" />
              Place Order (${total.toLocaleString()})
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <PartsNavbar q="" setQ={() => {}} filters={{}} setFilters={() => {}} brands={[]} categories={[]} activeFilterCount={0} />
      
      {/* Breadcrumb Section */}
      <section className="py-3 bg-light" style={{ marginTop: '110px' }}>
        <div className="container-fluid px-3 px-md-4 px-lg-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 d-flex align-items-center">
              <li className="breadcrumb-item d-flex align-items-center">
                <a href="/" className="text-decoration-none d-flex align-items-center text-dark">
                  <HiHome className="me-1" size={16} />
                  Home
                </a>
              </li>
              <li className="breadcrumb-item d-flex align-items-center">
                <HiChevronRight className="mx-2 text-muted" size={14} />
                <a href="/cart" className="text-decoration-none d-flex align-items-center text-dark">
                  Cart
                </a>
              </li>
              <li className="breadcrumb-item d-flex align-items-center">
                <HiChevronRight className="mx-2 text-muted" size={14} />
                <span className="d-flex align-items-center text-dark">
                  <FiLock className="me-1" size={16} />
                  Secure Checkout
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-sidebar details-section position-relative">
        <div className="container-fluid position-relative py-8 py-md-15">
          <div className="row gy-12 gy-xxl-0 px-3 px-md-4 px-lg-6 justify-content-center">
            <div className="col-xxl-8 main-body-content z-1 px-0">
              <div className="row d-center justify-content-between gy-3 mb-6 mb-md-11">
                <div className="col-sm-6 col-md-4 col-xl-5">
                  <div className="head-area d-grid gap-1 gap-md-2">
                    <h5 className="text-uppercase n4-color">
                      <FiLock className="me-2" />
                      Secure Checkout
                    </h5>
                    <p className="fs-nine n4-color">
                      Step {step} of 3 - {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review'}
                    </p>
                  </div>
                </div>
                <div className="col-sm-6 col-md-8 col-xl-7">
                  <div className="row justify-content-end">
                    <div className="col-md-6 d-flex justify-content-end">
                      <button 
                        className="btn btn-outline-secondary rounded-pill"
                        onClick={() => navigate('/cart')}
                      >
                        <FiArrowLeft className="me-1" /> Back to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="bg-white rounded-4 shadow-sm p-3 mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  {[1, 2, 3].map((stepNum) => (
                    <div key={stepNum} className="d-flex align-items-center" style={{ 
                      color: step >= stepNum ? '#0d6efd' : '#6c757d',
                      fontWeight: step === stepNum ? '600' : 'normal'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: step >= stepNum ? 'rgb(215, 0, 7)' : '#e9ecef',
                        color: step >= stepNum ? 'white' : '#6c757d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {step > stepNum ? '✓' : stepNum}
                      </div>
                      <span>
                        {stepNum === 1 ? 'Shipping' : stepNum === 2 ? 'Payment' : 'Review'}
                      </span>
                      {stepNum < 3 && (
                        <div style={{
                          width: '60px',
                          height: '2px',
                          background: step > stepNum ? '#0d6efd' : '#e9ecef',
                          marginLeft: '16px'
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="row g-4">
                {/* Main Content */}
                <div className="col-lg-8">
                  {step === 1 && renderShippingForm()}
                  {step === 2 && renderPaymentForm()}
                  {step === 3 && renderOrderReview()}
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                  <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: '20px' }}>
                    <h4 className="n4-color mb-3">Order Summary</h4>
                    
                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14px' }}>
                      <span className="n4-color">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span className="n4-color">${total.toLocaleString()}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14px' }}>
                      <span className="n4-color">Shipping:</span>
                      <span className="text-success">FREE</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-3" style={{ fontSize: '14px' }}>
                      <span className="n4-color">Tax:</span>
                      <span className="n4-color">$0.00</span>
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between mb-4">
                      <span className="n4-color fw-bold fs-5">Total:</span>
                      <span className="fw-bold fs-5" style={{ color: 'var(--primary-500)' }}>${total.toLocaleString()}</span>
                    </div>
                    
                    {/* Security Features */}
                    <div className="p-3 bg-light rounded-3 text-center">
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                        🔒 256-bit SSL Encryption
                      </div>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>
                        ✓ Secure Payment  ✓ Money Back Guarantee
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutFront;
