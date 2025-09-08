import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import CountdownTimer from './CountdownTimer.jsx'

const fmtMoney = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const BidModal = ({ item, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.body.classList.add('no-scroll')
    setTimeout(() => setVisible(true), 10)

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter') handleSubmit()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 200)
  }

  if (!item) return null

  const minIncrement = Math.ceil(item.highestBid * 0.02)
  const nextMin = item.highestBid + minIncrement

  const handleSubmit = () => {
    const bid = Number(amount)
    if (!amount || isNaN(bid) || bid < nextMin) return
    onSubmit(bid)
  }

  return createPortal(
    <div className={`modal-overlay ${visible ? 'show' : ''}`} onClick={handleClose}>
      <div
        className={`modal panel glass ${visible ? 'modal-enter' : 'modal-exit'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Place a Bid</h3>
          <button className="pill ghost" onClick={handleClose}>Close</button>
        </div>
        <div className="modal-body">
          <div className="modal-info">
            <img src={item.image} alt={item.title} />
            <div>
              <h4>
                {item.title} <span className="year">{item.year}</span>
              </h4>
              <div className="specs">
                <span>{item.specs?.mileage}</span>
                <span>{item.specs?.engine}</span>
                <span>{item.specs?.fuel}</span>
                <span>{item.specs?.transmission}</span>
              </div>
            </div>
          </div>
          <div className="modal-metrics">
            <div>
              <span className="muted">Current Highest Bid</span>
              <strong>{fmtMoney(item.highestBid)}</strong>
            </div>
            <div>
              <span className="muted">Minimum Increment</span>
              <strong>{fmtMoney(minIncrement)}</strong>
            </div>
            <div>
              <span className="muted">Ends In</span>
              <strong>
                <CountdownTimer target={item.endsAt} />
              </strong>
            </div>
          </div>
          <div className="form">
            <label>Enter your bid</label>
            <div className="input-field">
              <span className="prefix">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`${nextMin}`}
                className={!amount || isNaN(Number(amount)) || Number(amount) < nextMin ? 'invalid' : ''}
                inputMode="numeric"
              />
            </div>
            <div className="helper">
              {!amount || isNaN(Number(amount)) || Number(amount) < nextMin
                ? <span className="error">Minimum allowed: {fmtMoney(nextMin)}</span>
                : <span>Looks good</span>}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pill primary" disabled={!amount || isNaN(Number(amount)) || Number(amount) < nextMin} onClick={handleSubmit}>
            Submit Bid
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default BidModal
