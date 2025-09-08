import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiCreditCard, FiMapPin, FiUser, FiMail, FiPhone, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getAuthToken } from '../api/client.js';
import Sidebar from '../utils/Sidebar.jsx';
import '../pages/dashboard.css';

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark');
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

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme]);

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
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sellerId: item.sellerId
        })),
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: '****-****-****-' + paymentInfo.cardNumber.slice(-4) // Mask card number
        },
        total,
        subtotal: total,
        tax: 0,
        shipping: 0
      };

      // Simulate order creation
      console.log('🛒 Creating order:', orderData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just simulate success
      const orderId = 'ORD-' + Date.now();
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      alert(`Order placed successfully! 🎉\n\nOrder ID: ${orderId}\n\nYou will receive an email confirmation shortly.`);
      
      // Redirect to dashboard or orders page
      navigate('/dashboard');
      
      // In a real implementation, you would:
      // 1. Send order to backend API
      // 2. Process payment
      // 3. Send confirmation emails
      // 4. Update inventory
      // 5. Create order record
      
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to place order. Please try again.');
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
    <div className="panel glass" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
        <FiMapPin className="me-2" />
        Shipping Information
      </h3>
      
      <form onSubmit={handleShippingSubmit}>
        <div className="row" style={{ gap: '16px' }}>
          <div className="col-md-6">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              value={shippingInfo.fullName}
              onChange={(e) => setShippingInfo(prev => ({...prev, fullName: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo(prev => ({...prev, email: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Phone *</label>
            <input
              type="tel"
              className="form-control"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo(prev => ({...prev, phone: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-12">
            <label className="form-label">Address *</label>
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
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-control"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo(prev => ({...prev, city: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-4">
            <label className="form-label">State *</label>
            <input
              type="text"
              className="form-control"
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo(prev => ({...prev, state: e.target.value}))}
              required
            />
          </div>
          
          <div className="col-md-4">
            <label className="form-label">ZIP Code *</label>
            <input
              type="text"
              className="form-control"
              value={shippingInfo.zipCode}
              onChange={(e) => setShippingInfo(prev => ({...prev, zipCode: e.target.value}))}
              required
            />
          </div>
        </div>
        
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="pill primary" style={{ padding: '12px 24px' }}>
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="panel glass" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
        <FiCreditCard className="me-2" />
        Payment Information
      </h3>
      
      <form onSubmit={handlePaymentSubmit}>
        <div className="row" style={{ gap: '16px' }}>
          <div className="col-12">
            <label className="form-label">Card Number *</label>
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
            <label className="form-label">Expiry Date *</label>
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
            <label className="form-label">CVV *</label>
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
            <label className="form-label">Cardholder Name *</label>
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
              <label className="form-check-label" htmlFor="sameAsShipping">
                Billing address same as shipping address
              </label>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" className="pill ghost" onClick={() => setStep(1)}>
            Back to Shipping
          </button>
          <button type="submit" className="pill primary" style={{ padding: '12px 24px' }}>
            Review Order
          </button>
        </div>
      </form>
    </div>
  );

  const renderOrderReview = () => (
    <div className="panel glass" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
        <FiShoppingBag className="me-2" />
        Order Review
      </h3>
      
      {/* Order Items */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Items</h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map((item) => (
            <div key={item.partId} style={{
              display: 'flex',
              gap: '12px',
              padding: '12px',
              background: 'var(--glass-50)',
              borderRadius: '8px'
            }}>
              <img
                src={toAbsUrl(item.image)}
                alt={item.name}
                style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '12px' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontWeight: '600', color: 'var(--primary-500)' }}>
                ${(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Shipping Info */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Shipping Address</h4>
        <div style={{ padding: '12px', background: 'var(--glass-50)', borderRadius: '8px', fontSize: '14px' }}>
          <div>{shippingInfo.fullName}</div>
          <div>{shippingInfo.address}</div>
          <div>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</div>
          <div>{shippingInfo.email} • {shippingInfo.phone}</div>
        </div>
      </div>
      
      {/* Payment Info */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Payment Method</h4>
        <div style={{ padding: '12px', background: 'var(--glass-50)', borderRadius: '8px', fontSize: '14px' }}>
          <div>Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</div>
          <div>{paymentInfo.cardholderName}</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        <button type="button" className="pill ghost" onClick={() => setStep(2)}>
          Back to Payment
        </button>
        <button 
          className="pill primary" 
          style={{ padding: '12px 24px' }}
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
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <button className="pill ghost" onClick={() => navigate('/cart')}>
                <FiArrowLeft /> Back to Cart
              </button>
              <div>
                <h1 className="page-title">
                  <FiLock className="me-2" />
                  Secure Checkout
                </h1>
                <span className="page-subtitle">
                  Step {step} of 3 - {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review'}
                </span>
              </div>
            </div>
          </header>

          {/* Progress Steps */}
          <div style={{ marginBottom: '24px' }}>
            <div className="panel glass" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: step >= stepNum ? 'var(--primary-500)' : 'var(--muted)',
                    fontWeight: step === stepNum ? '600' : 'normal'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: step >= stepNum ? 'var(--primary-500)' : 'var(--glass-200)',
                      color: step >= stepNum ? 'white' : 'var(--muted)',
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
                        background: step > stepNum ? 'var(--primary-500)' : 'var(--glass-200)',
                        marginLeft: '16px'
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row" style={{ gap: '24px' }}>
            {/* Main Content */}
            <div className="col-lg-8">
              {step === 1 && renderShippingForm()}
              {step === 2 && renderPaymentForm()}
              {step === 3 && renderOrderReview()}
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="panel glass" style={{ padding: '20px', position: 'sticky', top: '20px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                  Order Summary
                </h3>
                
                <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>Shipping:</span>
                    <span style={{ color: 'var(--success-500)' }}>FREE</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </div>
                  
                  <hr style={{ margin: '8px 0', border: '1px solid var(--glass-300)' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700' }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--primary-500)' }}>${total.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Security Features */}
                <div style={{ 
                  padding: '12px', 
                  background: 'var(--glass-50)', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'var(--muted)'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    🔒 256-bit SSL Encryption
                  </div>
                  <div>
                    ✓ Secure Payment  ✓ Money Back Guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
