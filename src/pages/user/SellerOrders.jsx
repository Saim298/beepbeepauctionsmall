import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import { FiPackage, FiTruck, FiCheck, FiEye, FiEdit3, FiClock } from 'react-icons/fi';
import Sidebar from '../../utils/Sidebar.jsx';
import '../dashboard.css';

const SellerOrders = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateModal, setUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    trackingNumber: '',
    carrier: '',
    sellerNotes: ''
  });

  useEffect(() => { localStorage.setItem('beep-theme', theme); }, [theme]);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await apiRequest(`/api/orders/seller${params}`, {
        method: 'GET'
      });

      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      const response = await apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: updateData
      });

      if (response.success) {
        setUpdateModal(false);
        fetchOrders();
        alert('Order status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'success',
      delivered: 'success',
      completed: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FiClock />,
      confirmed: <FiCheck />,
      processing: <FiPackage />,
      shipped: <FiTruck />,
      delivered: <FiCheck />,
      completed: <FiCheck />
    };
    return icons[status] || <FiPackage />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      trackingNumber: order.tracking?.trackingNumber || '',
      carrier: order.tracking?.carrier || '',
      sellerNotes: order.notes?.sellerNotes || ''
    });
    setUpdateModal(true);
  };

  if (loading) {
    return (
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--glass-300)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p>Loading orders...</p>
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
              <h1 className="page-title">My Orders (Seller)</h1>
              <span className="page-subtitle">Manage orders from buyers</span>
            </div>
            <div className="topbar-right">
              <select
                className="pill"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
              </select>
              <button className="pill" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </header>

          {/* Orders List */}
          {orders.length === 0 ? (
            <section className="panel glass" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
                <div style={{ width: 120, height: 90, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--glass-300)' }}>
                  <FiPackage size={48} style={{ width: '100%', height: '100%', objectFit: 'cover', color: 'var(--muted)', padding: '20px' }} />
                </div>
                <h3 style={{ margin: 0 }}>No orders found</h3>
                <p className="muted" style={{ margin: 0 }}>You haven't received any orders yet.</p>
              </div>
            </section>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {orders.map((order) => (
                <div key={order._id}>
                  <div className="panel glass" style={{ padding: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'center' }}>
                      {/* Order Info */}
                      <div>
                        <h6 style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>#{order.orderNumber}</h6>
                        <small className="muted">
                          {formatDate(order.createdAt)}
                        </small>
                        <div style={{ marginTop: 8 }}>
                          <span className={`pill d-inline-flex align-items-center gap-1`} style={{ 
                            background: `var(--${getStatusColor(order.status)}-500)`, 
                            color: 'white',
                            fontSize: '12px'
                          }}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Buyer Info */}
                      <div>
                        <h6 style={{ margin: '0 0 4px 0' }}>Buyer</h6>
                        <p className="muted" style={{ margin: '0 0 4px 0' }}>{order.buyerInfo?.[0]?.username || 'Unknown'}</p>
                        <small className="muted">{order.buyerInfo?.[0]?.email}</small>
                      </div>

                      {/* Part Info */}
                      <div>
                        <h6 style={{ margin: '0 0 4px 0' }}>Item</h6>
                        <p style={{ margin: '0 0 4px 0' }}>{order.partInfo?.[0]?.name}</p>
                        <small className="muted">
                          Qty: {order.items?.quantity} × ${order.items?.price}
                        </small>
                      </div>

                      {/* Actions */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <button
                            className="pill"
                            onClick={() => openUpdateModal(order)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            <FiEdit3 style={{ marginRight: 4 }} />
                            Update
                          </button>
                        </div>
                        
                        {order.tracking?.trackingNumber && (
                          <div style={{ marginTop: 8 }}>
                            <small className="muted" style={{ display: 'block' }}>
                              Tracking: {order.tracking.trackingNumber}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Update Status Modal */}
          {updateModal && selectedOrder && (
            <div 
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setUpdateModal(false);
                }
              }}
            >
              <div 
                style={{
                  backgroundColor: 'var(--glass-bg)',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-300)',
                  maxWidth: '500px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ 
                  padding: '20px', 
                  borderBottom: '1px solid var(--glass-300)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h5 style={{ margin: 0, color: 'var(--text)' }}>Update Order Status</h5>
                  <button
                    type="button"
                    onClick={() => setUpdateModal(false)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '24px', 
                      cursor: 'pointer',
                      color: 'var(--muted)',
                      padding: '0',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--glass-300)';
                      e.target.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'var(--muted)';
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '20px' }}>
                  <form>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: 'bold',
                        color: 'var(--text)'
                      }}>
                        Order Status
                      </label>
                      <select
                        value={updateData.status}
                        onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--glass-300)',
                          backgroundColor: 'var(--glass-100)',
                          color: 'var(--text)',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-300)'}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {updateData.status === 'shipped' && (
                      <>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 'bold',
                            color: 'var(--text)'
                          }}>
                            Tracking Number
                          </label>
                          <input
                            type="text"
                            value={updateData.trackingNumber}
                            onChange={(e) => setUpdateData({...updateData, trackingNumber: e.target.value})}
                            placeholder="Enter tracking number"
                            style={{ 
                              width: '100%', 
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--glass-300)',
                              backgroundColor: 'var(--glass-100)',
                              color: 'var(--text)',
                              fontSize: '14px',
                              outline: 'none',
                              transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--glass-300)'}
                          />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 'bold',
                            color: 'var(--text)'
                          }}>
                            Carrier
                          </label>
                          <select
                            value={updateData.carrier}
                            onChange={(e) => setUpdateData({...updateData, carrier: e.target.value})}
                            style={{ 
                              width: '100%', 
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--glass-300)',
                              backgroundColor: 'var(--glass-100)',
                              color: 'var(--text)',
                              fontSize: '14px',
                              outline: 'none',
                              transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--glass-300)'}
                          >
                            <option value="">Select Carrier</option>
                            <option value="fedex">FedEx</option>
                            <option value="ups">UPS</option>
                            <option value="usps">USPS</option>
                            <option value="dhl">DHL</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: 'bold',
                        color: 'var(--text)'
                      }}>
                        Notes
                      </label>
                      <textarea
                        rows="3"
                        value={updateData.sellerNotes}
                        onChange={(e) => setUpdateData({...updateData, sellerNotes: e.target.value})}
                        placeholder="Add any notes for the buyer..."
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--glass-300)',
                          backgroundColor: 'var(--glass-100)',
                          color: 'var(--text)',
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'vertical',
                          minHeight: '80px',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-300)'}
                      />
                    </div>
                  </form>
                </div>

                {/* Modal Footer */}
                <div style={{ 
                  padding: '20px', 
                  borderTop: '1px solid var(--glass-300)', 
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'flex-end' 
                }}>
                  <button
                    type="button"
                    onClick={() => setUpdateModal(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-300)',
                      backgroundColor: 'var(--glass-100)',
                      color: 'var(--text)',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--glass-300)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--glass-100)';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(selectedOrder._id)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-dark)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary)';
                    }}
                  >
                    Update Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerOrders;
