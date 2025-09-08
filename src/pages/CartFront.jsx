import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { HiHome, HiChevronRight } from "react-icons/hi";
import { useCart } from '../context/CartContext';
import { getAuthToken } from '../api/client.js';
import PartsNavbar from '../components/PartsNavbar';

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

const CartFront = () => {
  const navigate = useNavigate();
  const { items, total, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/signin');
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
        } else {
          navigate('/signin');
        }
      })
      .catch(() => navigate('/signin'));
  }, [navigate]);

  const toAbsUrl = (u) => {
    if (!u) return '/assets/images/handpicked-img-1.webp';
    if (u.startsWith('http') || u.startsWith('data:')) return u;
    return `${API}${u}`;
  };

  const handleQuantityChange = (partId, newQuantity, maxQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(partId);
    } else if (newQuantity <= maxQuantity) {
      updateQuantity(partId, newQuantity);
    } else {
      alert(`Only ${maxQuantity} items available in stock`);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <PartsNavbar q="" setQ={() => {}} filters={{}} setFilters={() => {}} brands={[]} categories={[]} activeFilterCount={0} />
        <div style={{ paddingTop: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

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
                <span className="d-flex align-items-center text-dark">
                  <FiShoppingCart className="me-1" size={16} />
                  Shopping Cart
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
                      <FiShoppingCart className="me-2" />
                      Shopping Cart
                    </h5>
                    <p className="fs-nine n4-color">
                      {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                  </div>
                </div>
                <div className="col-sm-6 col-md-8 col-xl-7">
                  <div className="row justify-content-end">
                    <div className="col-md-6 d-flex justify-content-end gap-3">
                      <button 
                        className="btn btn-outline-secondary rounded-pill"
                        onClick={() => navigate('/parts')}
                      >
                        ← Continue Shopping
                      </button>
                      {items.length > 0 && (
                        <button 
                          className="btn btn-outline-danger rounded-pill"
                          onClick={clearCart}
                        >
                          Clear Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                  <div style={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%', 
                    background: '#f8f9fa', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    border: '2px solid #e9ecef'
                  }}>
                    <FiShoppingCart size={48} color="#6c757d" />
                  </div>
                  <h3 className="n4-color mb-3">Your cart is empty</h3>
                  <p className="n5-color mb-4">
                    Browse our parts catalog and add some items to your cart.
                  </p>
                  <button 
                    className="box-style style-two rounded-pill p1-bg-color py-3 py-md-4 px-3 px-md-4 px-xl-6 rounded-pill mb-3 px-4 py-2"
                    onClick={() => navigate('/parts')}
                  >
                    <FiPackage className="me-2" />
                    Browse Parts
                  </button>
                </div>
              ) : (
                <div className="row g-4">
                  {/* Cart Items */}
                  <div className="col-lg-8">
                    <div className="bg-white rounded-4 shadow-sm p-4">
                      <h4 className="n4-color mb-4">Cart Items ({items.length})</h4>
                      
                      <div className="cart-items">
                        {items.map((item, index) => (
                          <div 
                            key={item.partId} 
                            className={`cart-item d-flex gap-3 p-3 ${index !== items.length - 1 ? 'border-bottom' : ''}`}
                            style={{ alignItems: 'center' }}
                          >
                            {/* Item Image */}
                            <div 
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                borderRadius: '8px', 
                                overflow: 'hidden',
                                flexShrink: 0,
                                cursor: 'pointer',
                                border: '1px solid #e9ecef'
                              }}
                              onClick={() => navigate(`/parts/${item.partId}`)}
                            >
                              <img
                                src={toAbsUrl(item.image)}
                                alt={item.name}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover' 
                                }}
                                onError={(e) => {
                                  e.target.src = '/assets/images/handpicked-img-1.webp';
                                }}
                              />
                            </div>

                            {/* Item Details */}
                            <div style={{ flex: 1 }}>
                              <h5 
                                className="n4-color mb-1"
                                style={{ 
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  fontWeight: '600'
                                }}
                                onClick={() => navigate(`/parts/${item.partId}`)}
                              >
                                {item.name}
                              </h5>
                              {item.brand && (
                                <p className="n5-color mb-1" style={{ fontSize: '14px' }}>
                                  Brand: {item.brand}
                                </p>
                              )}
                              {item.partNumber && (
                                <p className="n5-color mb-1" style={{ fontSize: '12px' }}>
                                  Part #: {item.partNumber}
                                </p>
                              )}
                              {item.sellerName && (
                                <p className="n5-color mb-2" style={{ fontSize: '12px' }}>
                                  Seller: {item.sellerName}
                                </p>
                              )}

                              {/* Quantity Controls */}
                              <div className="d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center gap-2">
                                  <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    style={{ width: '32px', height: '32px', padding: 0 }}
                                    onClick={() => handleQuantityChange(item.partId, item.quantity - 1, item.maxQuantity)}
                                  >
                                    <FiMinus size={14} />
                                  </button>
                                  
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.partId, parseInt(e.target.value) || 1, item.maxQuantity)}
                                    className="form-control text-center"
                                    style={{ width: '60px', fontSize: '14px' }}
                                    min="1"
                                    max={item.maxQuantity}
                                  />
                                  
                                  <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    style={{ width: '32px', height: '32px', padding: 0 }}
                                    onClick={() => handleQuantityChange(item.partId, item.quantity + 1, item.maxQuantity)}
                                    disabled={item.quantity >= item.maxQuantity}
                                  >
                                    <FiPlus size={14} />
                                  </button>
                                </div>
                                
                                <small className="n5-color">
                                  Max: {item.maxQuantity}
                                </small>
                              </div>
                            </div>

                            {/* Price and Remove */}
                            <div className="text-end">
                              <div className="mb-2">
                                <h5 className="n4-color mb-0" style={{ fontSize: '16px', fontWeight: '600' }}>
                                  ${(item.price * item.quantity).toLocaleString()}
                                </h5>
                                <small className="n5-color">
                                  ${item.price.toLocaleString()} each
                                </small>
                              </div>
                              
                              <button
                                className="btn btn-outline-danger btn-sm rounded-circle"
                                onClick={() => removeFromCart(item.partId)}
                                title="Remove from cart"
                                style={{ width: '32px', height: '32px', padding: 0 }}
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="col-lg-4">
                    <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: '20px' }}>
                      <h4 className="n4-color mb-4">Order Summary</h4>
                      
                      <div className="d-flex justify-content-between mb-3">
                        <span className="n4-color">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                        <span className="n4-color fw-semibold">${total.toLocaleString()}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-3">
                        <span className="n4-color">Shipping:</span>
                        <span className="text-success fw-semibold">FREE</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-3">
                        <span className="n4-color">Tax:</span>
                        <span className="n4-color">Calculated at checkout</span>
                      </div>
                      
                      <hr className="my-3" />
                      
                      <div className="d-flex justify-content-between mb-4">
                        <span className="n4-color fw-bold fs-5">Total:</span>
                        <span className="fw-bold fs-5" style={{ color: 'var(--primary-500)' }}>${total.toLocaleString()}</span>
                      </div>
                      
                      <button
                        className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6 w-100 rounded-pill mb-3"
                        style={{ fontSize: '16px', fontWeight: '600' }}
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </button>
                      
                      <div className="text-center">
                        <Link 
                          to="/parts" 
                          className="text-decoration-none"
                          style={{ fontSize: '14px', color:"rgb(215, 0, 7)"}}
                        >
                          ← Continue Shopping
                        </Link>
                      </div>
                      
                      {/* Trust Badges */}
                      <div className="mt-4 p-3 bg-light rounded-3 text-center">
                        <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>
                          🔒 Secure Checkout
                        </div>
                        <div style={{ fontSize: '11px', color: '#6c757d' }}>
                          ✓ SSL Encrypted  ✓ Money Back Guarantee  ✓ Fast Shipping
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartFront;
