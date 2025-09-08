import React, { useMemo, useState } from 'react'
import CountdownTimer from './CountdownTimer.jsx'
import BidModal from './BidModal.jsx'
import '../pages/auctions.css'

const seedAuctions = [
  {
    id: 'AUC-4901',
    title: 'Porsche 911 Carrera',
    model: '2021 • 7,200 km',
    image: '/assets/images/top-deals-item-1.webp',
    highestBid: 86500,
    bids: 14,
    endsAt: Date.now() + 2 * 60 * 60 * 1000 + 14 * 60 * 1000 + 23 * 1000,
    status: 'LIVE',
    trend: 18,
  },
  {
    id: 'AUC-4789',
    title: 'Tesla Model S Plaid',
    model: '2022 • 3,900 km',
    image: '/assets/images/big-deals-car-2.webp',
    highestBid: 112300,
    bids: 32,
    endsAt: Date.now() + 54 * 60 * 1000 + 10 * 1000,
    status: 'LIVE',
    trend: 26,
  },
  {
    id: 'AUC-4712',
    title: 'BMW M5 Competition',
    model: '2020 • 12,400 km',
    image: '/assets/images/top-deals-item-2.webp',
    highestBid: 62900,
    bids: 9,
    endsAt: Date.now() - 1000,
    status: 'ENDED',
    trend: -5,
  },
  {
    id: 'AUC-4690',
    title: 'Audi RS7 Sportback',
    model: '2021 • 9,800 km',
    image: '/assets/images/top-deals-item-3.webp',
    highestBid: 79100,
    bids: 19,
    endsAt: Date.now() + 10 * 60 * 60 * 1000 + 5 * 60 * 1000 + 44 * 1000,
    status: 'LIVE',
    trend: 11,
  },
]

const fmtMoney = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const TopAuctions = () => {
  const [items, setItems] = useState(seedAuctions)
  const [active, setActive] = useState(null)

  const openBid = (a) => setActive(a)
  const closeBid = () => setActive(null)
  const submitBid = (bid) => {
    setItems((prev) => prev.map((it) => it.id === active.id ? { ...it, highestBid: bid, bids: it.bids + 1 } : it))
    closeBid()
  }

  return (
    <div className="auctions">
      {items.map((a) => (
        <div className="auction-row" key={a.id}>
          <div className="auction-left">
            <div className="thumb">
              <img src={a.image} alt={a.title} />
            </div>
            <div className="meta">
              <div className="title">
                <span className={`badge ${a.status === 'LIVE' ? 'live' : 'ended'}`}>{a.status}</span>
                <h4>{a.title}</h4>
              </div>
              <span className="muted">{a.model}</span>
            </div>
          </div>
          <div className="auction-mid">
            <div className="pill soft">{a.id}</div>
          </div>
          <div className="auction-right">
            <div className="price">{fmtMoney(a.highestBid)}</div>
            <div className="ends">
              <span className="muted">Ends in</span>
              <span className="value">{a.endsAt > Date.now() ? <CountdownTimer target={a.endsAt} /> : 'Ended'}</span>
            </div>
            {a.status === 'LIVE' && (
              <button className="pill" onClick={() => openBid(a)}>Place a Bid</button>
            )}
          </div>
        </div>
      ))}
      {active && (
        <BidModal
          item={{ ...active, year: active.model.split(' ')[0], image: active.image }}
          onClose={closeBid}
          onSubmit={submitBid}
        />
      )}
    </div>
  )
}

export default TopAuctions


