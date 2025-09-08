import React, { useEffect, useState } from 'react'
import Sidebar from '../../utils/Sidebar.jsx'
import '../../pages/dashboard.css'
import { FiCreditCard, FiPlus, FiCheck, FiTrash2, FiShield } from 'react-icons/fi'

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const CardManagement = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [cards, setCards] = useState([])
  const [showAddCard, setShowAddCard] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardHolderName: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    isDefault: false
  })

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`${API}/api/cards/my-cards`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setCards(data.cards || [])
      }
    } catch (error) {
      console.error('Error loading cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCard = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API}/api/cards/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const result = await response.json()

      if (response.ok) {
        alert('Card added successfully!')
        setShowAddCard(false)
        setForm({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cardHolderName: '',
          cvv: '',
          billingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US'
          },
          isDefault: false
        })
        await loadCards()
      } else {
        alert(result.error || 'Failed to add card')
      }
    } catch (error) {
      alert('Error adding card. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const setDefaultCard = async (cardId) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API}/api/cards/${cardId}/set-default`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        await loadCards()
      } else {
        alert('Failed to set default card')
      }
    } catch (error) {
      alert('Error updating card')
    }
  }

  const removeCard = async (cardId) => {
    if (!confirm('Are you sure you want to remove this card?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API}/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        await loadCards()
      } else {
        alert('Failed to remove card')
      }
    } catch (error) {
      alert('Error removing card')
    }
  }

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'visa': return '💳'
      case 'mastercard': return '💳'
      case 'amex': return '💳'
      case 'discover': return '💳'
      default: return '💳'
    }
  }

  const getCardColor = (cardType) => {
    switch (cardType) {
      case 'visa': return '#1a1f71'
      case 'mastercard': return '#eb001b'
      case 'amex': return '#006fcf'
      case 'discover': return '#ff6000'
      default: return '#333'
    }
  }

  if (loading) {
    return (
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--glass-300)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p>Loading payment methods...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">Payment Methods</h1>
              <span className="page-subtitle">Manage your cards for bidding</span>
            </div>
            <div className="topbar-right">
              <button 
                className="pill primary" 
                onClick={() => setShowAddCard(true)}
              >
                <FiPlus style={{ marginRight: 8 }} />
                Add Card
              </button>
            </div>
          </header>

          {/* Security Notice */}
          <div className="panel glass" style={{ padding: 20, marginBottom: 24, background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiShield size={24} style={{ color: '#22c55e' }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#22c55e' }}>Secure Payment Processing</h4>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text)' }}>
                  Your payment information is encrypted and stored securely. Cards are required for bidding security deposits.
                </p>
              </div>
            </div>
          </div>

          {/* Cards List */}
          {cards.length === 0 ? (
            <div className="panel glass" style={{ padding: 40, textAlign: 'center' }}>
              <FiCreditCard size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
              <h3 style={{ margin: '0 0 8px 0' }}>No Payment Methods</h3>
              <p className="muted" style={{ marginBottom: 24 }}>Add a card to start bidding on auctions</p>
              <button 
                className="pill primary"
                onClick={() => setShowAddCard(true)}
              >
                Add Your First Card
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {cards.map((card) => (
                <div key={card._id} className="panel glass" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ 
                        width: 60, 
                        height: 40, 
                        backgroundColor: getCardColor(card.cardType),
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 18
                      }}>
                        {getCardIcon(card.cardType)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 'bold', fontSize: 16 }}>
                            {card.maskedNumber}
                          </span>
                          {card.isDefault && (
                            <span style={{ 
                              background: '#22c55e', 
                              color: 'white', 
                              padding: '2px 8px', 
                              borderRadius: 12, 
                              fontSize: 12,
                              fontWeight: 'bold'
                            }}>
                              DEFAULT
                            </span>
                          )}
                          {card.isVerified && (
                            <FiCheck style={{ color: '#22c55e' }} />
                          )}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                          {card.cardHolderName} • Expires {card.expiryMonth}/{card.expiryYear}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', marginTop: 2 }}>
                          {card.cardType}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {!card.isDefault && (
                        <button 
                          className="pill small"
                          onClick={() => setDefaultCard(card._id)}
                        >
                          Set Default
                        </button>
                      )}
                      <button 
                        className="pill small danger"
                        onClick={() => removeCard(card._id)}
                        style={{ background: '#dc2626', color: 'white' }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Card Modal */}
          {showAddCard && (
            <div style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 1000 
            }}>
              <div className="panel glass" style={{ width: '90%', maxWidth: 500, padding: 24, maxHeight: '90vh', overflow: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h3 style={{ margin: 0 }}>Add New Card</h3>
                  <button 
                    className="pill small"
                    onClick={() => setShowAddCard(false)}
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddCard}>
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                      <label>Card Number</label>
                      <input
                        className="input glass big"
                        type="text"
                        value={form.cardNumber}
                        onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/\s/g, '') })}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div>
                        <label>Month</label>
                        <select
                          className="input glass big"
                          value={form.expiryMonth}
                          onChange={(e) => setForm({ ...form, expiryMonth: e.target.value })}
                          required
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Year</label>
                        <select
                          className="input glass big"
                          value={form.expiryYear}
                          onChange={(e) => setForm({ ...form, expiryYear: e.target.value })}
                          required
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                      <div>
                        <label>CVV</label>
                        <input
                          className="input glass big"
                          type="text"
                          value={form.cvv}
                          onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label>Cardholder Name</label>
                      <input
                        className="input glass big"
                        type="text"
                        value={form.cardHolderName}
                        onChange={(e) => setForm({ ...form, cardHolderName: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label>Billing Address</label>
                      <input
                        className="input glass big"
                        type="text"
                        value={form.billingAddress.street}
                        onChange={(e) => setForm({ 
                          ...form, 
                          billingAddress: { ...form.billingAddress, street: e.target.value }
                        })}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <input
                        className="input glass big"
                        type="text"
                        value={form.billingAddress.city}
                        onChange={(e) => setForm({ 
                          ...form, 
                          billingAddress: { ...form.billingAddress, city: e.target.value }
                        })}
                        placeholder="City"
                        required
                      />
                      <input
                        className="input glass big"
                        type="text"
                        value={form.billingAddress.state}
                        onChange={(e) => setForm({ 
                          ...form, 
                          billingAddress: { ...form.billingAddress, state: e.target.value }
                        })}
                        placeholder="State"
                        required
                      />
                      <input
                        className="input glass big"
                        type="text"
                        value={form.billingAddress.zipCode}
                        onChange={(e) => setForm({ 
                          ...form, 
                          billingAddress: { ...form.billingAddress, zipCode: e.target.value }
                        })}
                        placeholder="ZIP"
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={form.isDefault}
                        onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                      />
                      <label>Set as default payment method</label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                    <button 
                      type="button"
                      className="pill"
                      onClick={() => setShowAddCard(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="pill primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Adding...' : 'Add Card'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CardManagement
