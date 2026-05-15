import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiClock, 
  FiDollarSign, 
  FiUsers, 
  FiHeart, 
  FiShare2, 

  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { MdGavel } from 'react-icons/md';
import io from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://beep-auctions-backend.onrender.com';

const AuctionDetail = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [auction, setAuction] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [userBids, setUserBids] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [watcherCount, setWatcherCount] = useState(0);
  
  // Bidding state
  const [bidAmount, setBidAmount] = useState('');
  const [maxBidAmount, setMaxBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);
  const [showProxyBidding, setShowProxyBidding] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');

  useEffect(() => {
    initializeAuction();
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-auction', { auctionId });
        socketRef.current.disconnect();
      }
    };
  }, [auctionId]);

  useEffect(() => {
    let timer;
    if (auction && auction.status === 'active' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [auction, timeRemaining]);

  const initializeAuction = async () => {
    try {
      // Get current user
      const userResponse = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUser(userData.user);
      }

      // Get auction data
      const auctionResponse = await fetch(`${API_BASE}/api/auctions/${auctionId}`, {
        credentials: 'include'
      });

      if (auctionResponse.ok) {
        const data = await auctionResponse.json();
        setAuction(data.auction);
        setBidHistory(data.bidHistory);
        setUserBids(data.userBids);
        setTimeRemaining(data.timeRemaining);
        
        // Set minimum bid amount
        const minBid = Math.max(
          data.auction.startingBid,
          data.auction.currentBid + data.auction.bidIncrement
        );
        setBidAmount(minBid.toString());
      } else {
        navigate('/auctions');
        return;
      }

      // Initialize Socket.IO
      socketRef.current = io(API_BASE, { withCredentials: true });
      
      socketRef.current.on('connect', () => {
        if (currentUser) {
          socketRef.current.emit('join', { 
            userId: currentUser.id, 
            userName: currentUser.name 
          });
        }
        socketRef.current.emit('join-auction', { auctionId });
      });

      // Real-time event listeners
      socketRef.current.on('new-bid', (bidData) => {
        if (bidData.auctionId === auctionId) {
          setAuction(prev => ({
            ...prev,
            currentBid: bidData.currentBid,
            totalBids: bidData.totalBids,
            highestBidder: bidData.bidder,
            reserveMet: bidData.reserveMet
          }));
          
          setBidHistory(prev => [bidData, ...prev.slice(0, 9)]);
          setTimeRemaining(bidData.timeRemaining);
          
          // Show notification if not current user's bid
          if (currentUser && bidData.bidder._id !== currentUser.id) {
            setBidSuccess(`New bid: $${bidData.bidAmount.toLocaleString()} by ${bidData.bidder.name}`);
            setTimeout(() => setBidSuccess(''), 5000);
          }
        }
      });

      socketRef.current.on('auction-extended', (data) => {
        if (data.auctionId === auctionId) {
          setTimeRemaining(data.timeRemaining);
          setBidSuccess('Auction extended due to last-minute bidding!');
          setTimeout(() => setBidSuccess(''), 5000);
        }
      });

      socketRef.current.on('auction-sold', (data) => {
        if (data.auctionId === auctionId) {
          setAuction(prev => ({
            ...prev,
            status: 'sold',
            currentBid: data.soldPrice,
            highestBidder: data.buyer
          }));
          setBidSuccess(`Auction sold for $${data.soldPrice.toLocaleString()}!`);
        }
      });

      socketRef.current.on('auction-watcher-joined', (data) => {
        setWatcherCount(data.watcherCount);
      });

      socketRef.current.on('auction-watcher-left', (data) => {
        setWatcherCount(data.watcherCount);
      });

    } catch (error) {
      console.error('Error initializing auction:', error);
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Check if user has a verified payment method
    try {
      const cardResponse = await fetch(`${API_BASE}/api/cards/verify-for-bidding`, {
        credentials: 'include'
      });
      
      if (!cardResponse.ok) {
        const cardResult = await cardResponse.json();
        if (cardResult.needsCard) {
          setBidError('Please add a payment method before bidding');
          setTimeout(() => {
            if (confirm('You need to add a payment method to bid. Go to card management now?')) {
              navigate('/user/cards');
            }
          }, 100);
          return;
        }
      }
    } catch (error) {
      setBidError('Unable to verify payment method. Please try again.');
      return;
    }

    setBidding(true);
    setBidError('');
    setBidSuccess('');

    try {
      const response = await fetch(`${API_BASE}/api/auctions/${auctionId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bidAmount: parseFloat(bidAmount),
          maxBidAmount: showProxyBidding && maxBidAmount ? parseFloat(maxBidAmount) : undefined
        })
      });

      const result = await response.json();

      if (response.ok) {
        setBidSuccess(`Bid placed successfully! $${parseFloat(bidAmount).toLocaleString()}`);
        
        // Update bid amount for next bid
        const newMinBid = Math.max(
          auction.startingBid,
          parseFloat(bidAmount) + auction.bidIncrement
        );
        setBidAmount(newMinBid.toString());
        setMaxBidAmount('');
        setShowProxyBidding(false);
        
        // Update user bids
        setUserBids(prev => [result.bid, ...prev]);
        
      } else {
        setBidError(result.error || 'Failed to place bid');
      }
    } catch (error) {
      setBidError('Network error. Please try again.');
    } finally {
      setBidding(false);
    }
  };

  const buyNow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!confirm(`Buy now for $${auction.buyNowPrice.toLocaleString()}?`)) {
      return;
    }

    setBidding(true);
    try {
      const response = await fetch(`${API_BASE}/api/auctions/${auctionId}/buy-now`, {
        method: 'POST',
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok) {
        setBidSuccess(`Congratulations! You bought this item for $${result.soldPrice.toLocaleString()}`);
      } else {
        setBidError(result.error || 'Purchase failed');
      }
    } catch (error) {
      setBidError('Network error. Please try again.');
    } finally {
      setBidding(false);
    }
  };

  const formatTimeRemaining = (ms) => {
    if (ms <= 0) return 'Auction Ended';
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading auction...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h3>Auction not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/auctions')}>
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  const isActive = auction.status === 'active' && timeRemaining > 0;
  const isUserHighBidder = currentUser && auction.highestBidder?._id === currentUser.id;
  const canBid = isActive && currentUser && auction.seller._id !== currentUser.id;

  return (
    <div className="container py-4">
      <div className="row">
        {/* Left Column - Images and Details */}
        <div className="col-lg-8">
          {/* Car Images */}
          <div className="card mb-4">
            <div className="card-body p-0">
              {auction.carListing.media && auction.carListing.media.length > 0 ? (
                <img 
                  src={`${API_BASE}${auction.carListing.media[0].url}`}
                  alt={auction.carListing.name}
                  className="img-fluid w-100"
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                  <span className="text-muted">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Vehicle Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Year:</strong> {auction.carListing.year}</p>
                  <p><strong>Make:</strong> {auction.carListing.make?.name}</p>
                  <p><strong>Model:</strong> {auction.carListing.model?.name}</p>
                  {auction.carListing.mileage && (
                    <p><strong>Mileage:</strong> {auction.carListing.mileage.toLocaleString()} miles</p>
                  )}
                </div>
                <div className="col-md-6">
                  {auction.carListing.condition && (
                    <p><strong>Condition:</strong> {auction.carListing.condition}</p>
                  )}
                  {auction.carListing.color && (
                    <p><strong>Color:</strong> {auction.carListing.color}</p>
                  )}
                  {auction.carListing.transmission && (
                    <p><strong>Transmission:</strong> {auction.carListing.transmission}</p>
                  )}
                  {auction.carListing.location && (
                    <p><strong>Location:</strong> {auction.carListing.location}</p>
                  )}
                </div>
              </div>
              
              {auction.carListing.descriptionHtml && (
                <div className="mt-3">
                  <h6>Description</h6>
                  <div dangerouslySetInnerHTML={{ __html: auction.carListing.descriptionHtml }} />
                </div>
              )}
            </div>
          </div>

          {/* Bid History */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Bid History ({auction.totalBids} bids)</h5>
            </div>
            <div className="card-body">
              {bidHistory.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Bidder</th>
                        <th>Amount</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bidHistory.map((bid, index) => (
                        <tr key={index} className={index === 0 ? 'table-success' : ''}>
                          <td>{bid.bidder?.name || 'Anonymous'}</td>
                          <td>${bid.bidAmount?.toLocaleString()}</td>
                          <td>{new Date(bid.timestamp).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No bids yet. Be the first to bid!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Bidding Panel */}
        <div className="col-lg-4">
          {/* Auction Status Card */}
          <div className="card mb-4 border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 d-flex align-items-center">
                <MdGavel className="me-2" />
                {auction.carListing.name}
              </h5>
            </div>
            <div className="card-body">
              {/* Current Bid */}
              <div className="text-center mb-3">
                <div className="h2 text-primary mb-0">
                  ${auction.currentBid.toLocaleString()}
                </div>
                <small className="text-muted">Current Bid</small>
                {auction.totalBids > 0 && (
                  <div className="mt-1">
                    <small className="text-muted">
                      {auction.totalBids} bid{auction.totalBids !== 1 ? 's' : ''}
                    </small>
                  </div>
                )}
              </div>

              {/* Reserve Status */}
              {auction.auctionType === 'reserve' && (
                <div className="alert alert-info py-2 mb-3">
                  <div className="d-flex align-items-center">
                    {auction.reserveMet ? (
                      <>
                        <FiCheckCircle className="text-success me-2" />
                        <span className="text-success">Reserve Met</span>
                      </>
                    ) : (
                      <>
                        <FiAlertCircle className="text-warning me-2" />
                        <span className="text-warning">Reserve Not Met</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Time Remaining */}
              <div className="text-center mb-3">
                <div className={`h5 mb-0 ${timeRemaining < 300000 ? 'text-danger' : 'text-dark'}`}>
                  {formatTimeRemaining(timeRemaining)}
                </div>
                <small className="text-muted">Time Remaining</small>
              </div>

              {/* High Bidder */}
              {auction.highestBidder && (
                <div className="text-center mb-3">
                  <small className="text-muted">
                    High Bidder: <strong>{auction.highestBidder.name}</strong>
                    {isUserHighBidder && <span className="text-success"> (You)</span>}
                  </small>
                </div>
              )}

              {/* Watchers */}
              <div className="text-center mb-3">
                <small className="text-muted d-flex align-items-center justify-content-center">
                  <FiUsers className="me-1" />
                  {watcherCount} watching
                </small>
              </div>

              {/* Bidding Interface */}
              {canBid ? (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Your Bid</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input 
                        type="number"
                        className="form-control"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={Math.max(auction.startingBid, auction.currentBid + auction.bidIncrement)}
                        step={auction.bidIncrement}
                      />
                    </div>
                    <small className="text-muted">
                      Minimum: ${Math.max(auction.startingBid, auction.currentBid + auction.bidIncrement).toLocaleString()}
                    </small>
                  </div>

                  {/* Proxy Bidding Toggle */}
                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input"
                      type="checkbox"
                      id="proxyBidding"
                      checked={showProxyBidding}
                      onChange={(e) => setShowProxyBidding(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="proxyBidding">
                      Use Proxy Bidding
                    </label>
                  </div>

                  {/* Max Bid Input */}
                  {showProxyBidding && (
                    <div className="mb-3">
                      <label className="form-label">Maximum Bid</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input 
                          type="number"
                          className="form-control"
                          value={maxBidAmount}
                          onChange={(e) => setMaxBidAmount(e.target.value)}
                          min={bidAmount}
                          placeholder="Your maximum bid"
                        />
                      </div>
                      <small className="text-muted">
                        System will bid up to this amount automatically
                      </small>
                    </div>
                  )}

                  <button 
                    className="btn btn-primary w-100 mb-2"
                    onClick={placeBid}
                    disabled={bidding || !bidAmount}
                  >
                    {bidding ? 'Placing Bid...' : 'Place Bid'}
                  </button>

                  {/* Buy Now Button */}
                  {auction.buyNowPrice && auction.auctionType !== 'standard' && (
                    <button 
                      className="btn btn-success w-100"
                      onClick={buyNow}
                      disabled={bidding}
                    >
                      Buy Now - ${auction.buyNowPrice.toLocaleString()}
                    </button>
                  )}
                </div>
              ) : !currentUser ? (
                <button 
                  className="btn btn-primary w-100"
                  onClick={() => navigate('/login')}
                >
                  Login to Bid
                </button>
              ) : auction.seller._id === currentUser.id ? (
                <div className="alert alert-info">
                  This is your auction
                </div>
              ) : !isActive ? (
                <div className="alert alert-warning">
                  Auction has ended
                </div>
              ) : null}

              {/* Messages */}
              {bidError && (
                <div className="alert alert-danger mt-3">{bidError}</div>
              )}
              {bidSuccess && (
                <div className="alert alert-success mt-3">{bidSuccess}</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card">
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <FiHeart className="me-2" />
                  Add to Watchlist
                </button>
                <button className="btn btn-outline-secondary">
                  <FiShare2 className="me-2" />
                  Share Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
