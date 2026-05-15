import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getAuthToken } from '../api/client.js';
import Sidebar from '../utils/Sidebar.jsx';
import '../pages/dashboard.css';

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

const Cart = () => {
  const navigate = useNavigate();
  const { items, total, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme]);

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
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading your cart...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <button className="pill ghost" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
              </button>
              <div>
                <h1 className="page-title">
                  <FiShoppingCart className="me-2" />
                  Shopping Cart
                </h1>
                <span className="page-subtitle">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </span>
              </div>
            </div>
            <div className="topbar-right">
              {items.length > 0 && (
                <button className="pill danger" onClick={clearCart}>
                  Clear Cart
                </button>
              )}
            </div>
          </header>

          {items.length === 0 ? (
            <section className="panel glass" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 20 }}>
                <div style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  background: 'var(--glass-100)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid var(--glass-300)'
                }}>
                  <FiShoppingCart size={48} color="var(--muted)" />
                </div>
                <h3 style={{ margin: 0 }}>Your cart is empty</h3>
                <p className="muted" style={{ margin: 0 }}>
                  Browse our parts catalog and add some items to your cart.
                </p>
                <div className="btn-row" style={{ marginTop: 16 }}>
                  <button className="pill primary" onClick={() => navigate('/parts')}>
                    <FiPackage className="me-2" />
                    Browse Parts
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <div className="row" style={{ gap: '24px' }}>
              {/* Cart Items */}
              <div className="col-lg-8">
                <div className="panel glass" style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                    Cart Items ({items.length})
                  </h3>
                  
                  <div className="cart-items" style={{ display: 'grid', gap: '16px' }}>
                    {items.map((item) => (
                      <div 
                        key={item.partId} 
                        className="cart-item"
                        style={{
                          display: 'flex',
                          gap: '16px',
                          padding: '16px',
                          background: 'var(--glass-50)',
                          borderRadius: '12px',
                          border: '1px solid var(--glass-200)'
                        }}
                      >
                        {/* Item Image */}
                        <div 
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            flexShrink: 0,
                            cursor: 'pointer'
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
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div>
                            <h4 
                              style={{ 
                                margin: 0, 
                                fontSize: '16px', 
                                fontWeight: '600',
                                cursor: 'pointer',
                                color: 'var(--primary-500)'
                              }}
                              onClick={() => navigate(`/parts/${item.partId}`)}
                            >
                              {item.name}
                            </h4>
                            {item.brand && (
                              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--muted)' }}>
                                Brand: {item.brand}
                              </p>
                            )}
                            {item.partNumber && (
                              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                                Part #: {item.partNumber}
                              </p>
                            )}
                            {item.sellerName && (
                              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                                Seller: {item.sellerName}
                              </p>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                            {/* Quantity Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onClick={() => handleQuantityChange(item.partId, item.quantity - 1, item.maxQuantity)}
                              >
                                <FiMinus size={14} />
                              </button>
                              
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.partId, parseInt(e.target.value) || 1, item.maxQuantity)}
                                style={{
                                  width: '60px',
                                  textAlign: 'center',
                                  padding: '6px',
                                  border: '1px solid var(--glass-300)',
                                  borderRadius: '6px',
                                  background: 'var(--glass-100)'
                                }}
                                min="1"
                                max={item.maxQuantity}
                              />
                              
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onClick={() => handleQuantityChange(item.partId, item.quantity + 1, item.maxQuantity)}
                                disabled={item.quantity >= item.maxQuantity}
                              >
                                <FiPlus size={14} />
                              </button>
                              
                              <small style={{ color: 'var(--muted)', marginLeft: '8px' }}>
                                Max: {item.maxQuantity}
                              </small>
                            </div>

                            {/* Price and Remove */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-500)' }}>
                                  ${(item.price * item.quantity).toLocaleString()}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                                  ${item.price.toLocaleString()} each
                                </div>
                              </div>
                              
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeFromCart(item.partId)}
                                title="Remove from cart"
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <div className="panel glass" style={{ padding: '20px', position: 'sticky', top: '20px' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                    Order Summary
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span style={{ fontWeight: '600' }}>${total.toLocaleString()}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Shipping:</span>
                      <span style={{ color: 'var(--success-500)', fontWeight: '600' }}>FREE</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tax:</span>
                      <span>Calculated at checkout</span>
                    </div>
                    
                    <hr style={{ margin: '12px 0', border: '1px solid var(--glass-300)' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
                      <span>Total:</span>
                      <span style={{ color: 'var(--primary-500)' }}>${total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    className="pill primary"
                    style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: '600' }}
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                  
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Link 
                      to="/parts" 
                      style={{ 
                        color: 'var(--primary-500)', 
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                    >
                      ← Continue Shopping
                    </Link>
                  </div>
                  
                  {/* Trust Badges */}
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '16px', 
                    background: 'var(--glass-50)', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                      🔒 Secure Checkout
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      ✓ SSL Encrypted  ✓ Money Back Guarantee  ✓ Fast Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;
