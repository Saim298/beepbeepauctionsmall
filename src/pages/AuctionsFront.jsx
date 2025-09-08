import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingsNavbar from "../components/ListingsNavbar";
import { HiHome, HiChevronRight } from "react-icons/hi";
import { MdGavel } from "react-icons/md";
import { FiClock, FiUsers, FiDollarSign, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import io from 'socket.io-client';

const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const AuctionCard = ({ auction, toAbsUrl }) => {
  const navigate = useNavigate();
  
  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return { text: 'Ended', urgent: false };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return { text: `${days}d ${hours}h`, urgent: days < 1 };
    if (hours > 0) return { text: `${hours}h ${minutes}m`, urgent: hours < 6 };
    return { text: `${minutes}m`, urgent: true };
  };

  const getAuctionTypeBadge = (type) => {
    const badges = {
      standard: { class: 'badge bg-primary', text: 'Standard' },
      reserve: { class: 'badge bg-warning text-dark', text: 'Reserve' },
      direct_sale: { class: 'badge bg-success', text: 'Buy Now' }
    };
    return badges[type] || { class: 'badge bg-secondary', text: type };
  };

  const timeRemaining = formatTimeRemaining(auction.endDate);
  const typeBadge = getAuctionTypeBadge(auction.auctionType);

  return (
    <div className="single-items d-flex transition cus-border border b-fourth rounded-3 mb-4">
      <div className="img-area position-relative">
        <div className="position-relative overflow-hidden rounded-3">
          <img
            src={auction.carListing?.media?.[0]?.url ? toAbsUrl(auction.carListing.media[0].url) : '/assets/images/handpicked-img-1.webp'}
            alt={auction.carListing?.name}
            className="w-100 h-100 object-fit-cover"
            style={{ height: '200px' }}
          />
          
          {/* Auction Type Badge */}
          <div className="position-absolute top-0 start-0 m-2">
            <span className={typeBadge.class}>{typeBadge.text}</span>
          </div>

          {/* Reserve Status */}
          {auction.auctionType === 'reserve' && (
            <div className="position-absolute top-0 end-0 m-2">
              {auction.reserveMet ? (
                <span className="badge bg-success">
                  <FiCheckCircle className="me-1" size={12} />
                  Reserve Met
                </span>
              ) : (
                <span className="badge bg-warning text-dark">
                  <FiAlertCircle className="me-1" size={12} />
                  Reserve Not Met
                </span>
              )}
            </div>
          )}

          {/* Time Remaining */}
          <div className="position-absolute bottom-0 start-0 m-2">
            <span className={`badge ${timeRemaining.urgent ? 'bg-danger' : 'bg-dark'}`}>
              <FiClock className="me-1" size={12} />
              {timeRemaining.text}
            </span>
          </div>
        </div>
      </div>

      <div className="content-area flex-grow-1 p-3 p-md-4">
        <div className="d-flex flex-column h-100">
          {/* Header */}
          <div className="head-area mb-3">
            <h4 className="mb-2">
              <a href={`/auction-details/${auction._id}`} className="text-decoration-none n4-color">
                {auction.carListing?.name}
              </a>
            </h4>
            <div className="d-flex align-items-center gap-3 text-muted">
              <span>{auction.carListing?.year}</span>
              <span>•</span>
              <span>{auction.carListing?.location}</span>
              {auction.carListing?.mileage && (
                <>
                  <span>•</span>
                  <span>{auction.carListing.mileage.toLocaleString()} miles</span>
                </>
              )}
            </div>
          </div>

          {/* Auction Info */}
          <div className="auction-info mb-3 flex-grow-1">
            <div className="row g-3">
              <div className="col-6">
                <div className="d-flex align-items-center gap-2">
                  <FiDollarSign className="text-primary" />
                  <div>
                    <div className="fw-bold fs-5 text-primary">
                      ${auction.currentBid?.toLocaleString() || '0'}
                    </div>
                    <small className="text-muted">Current Bid</small>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center gap-2">
                  <FiUsers className="text-info" />
                  <div>
                    <div className="fw-bold">{auction.totalBids || 0}</div>
                    <small className="text-muted">Bids</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Buy Now Price */}
            {auction.buyNowPrice && (
              <div className="mt-2">
                <div className="text-success fw-semibold">
                  Buy Now: ${auction.buyNowPrice.toLocaleString()}
                </div>
              </div>
            )}

            {/* Starting Bid */}
            <div className="mt-2">
              <small className="text-muted">
                Starting bid: ${auction.startingBid?.toLocaleString() || '0'}
              </small>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="btn-area d-grid gap-1 gap-md-2">
            {auction.buyNowPrice && auction.auctionType !== 'standard' && (
              <button
                onClick={() => navigate(`/auction-details/${auction._id}?action=buy-now`)}
                className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6"
              >
                <span className="fs-nine fw-semibold text-nowrap text-uppercase transition">
                  Buy Now - ${auction.buyNowPrice.toLocaleString()}
                </span>
              </button>
            )}
            
            <div className="d-flex gap-2">
              <button
                onClick={() => navigate(`/auction-details/${auction._id}`)}
                className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6 flex-grow-1"
              >
                <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                  Place Bid
                </span>
              </button>
              
              <button
                onClick={() => navigate(`/auction-details/${auction._id}`)}
                className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-2 px-md-3 flex-shrink-0"
                title="View Details"
              >
                <MdGavel className="fs-six n4-color" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-area d-center justify-content-center gap-2 gap-md-3">
      <button
        className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-4"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <span className="fs-nine n4-color fw-semibold">Previous</span>
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          className={`box-style style-one rounded-pill transition d-center py-2 py-md-3 px-3 px-md-4 ${
            currentPage === page ? 'n4-bg-color' : 'cus-border border'
          }`}
          onClick={() => onPageChange(page)}
        >
          <span className={`fs-nine fw-semibold ${currentPage === page ? 'n1-color' : 'n4-color'}`}>
            {page}
          </span>
        </button>
      ))}
      
      <button
        className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-4"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <span className="fs-nine n4-color fw-semibold">Next</span>
      </button>
    </div>
  );
};

const AuctionsFront = () => {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("endDate");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const [makes, setMakes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({ 
    make: "", 
    auctionType: "",
    year: "", 
    category: "", 
    priceRange: "",
    location: "",
    status: "active"
  });

  const activeFilterCount = useMemo(() => {
    return [q, filters.make, filters.auctionType, filters.year, filters.category, filters.priceRange, filters.location].filter(Boolean).length;
  }, [q, filters]);

  useEffect(() => {
    fetch(`${apiBase}/api/makes`).then(r => r.json()).then(setMakes).catch(()=>{});
    fetch(`${apiBase}/api/categories`).then(r => r.json()).then(setCategories).catch(()=>{});
    
    // Setup socket connection for real-time updates
    const token = localStorage.getItem('auth_token');
    const newSocket = io(apiBase, {
      auth: token ? { token } : {}
    });

    newSocket.on('connect', () => {
      console.log('🔗 Socket connected for auctions list');
    });

    // Listen for auction updates across all auctions
    newSocket.on('auction-updated', (updateData) => {
      console.log('🔄 Auction updated in list:', updateData);
      setAuctions(prev => prev.map(auction => 
        auction._id === updateData.auctionId 
          ? {
              ...auction,
              currentBid: updateData.currentBid,
              totalBids: updateData.totalBids,
              highestBidder: updateData.highestBidder,
              reserveMet: updateData.reserveMet
            }
          : auction
      ));
    });

    newSocket.on('new-bid', (bidData) => {
      console.log('🏁 New bid in auction list:', bidData);
      // Update the specific auction's current bid
      setAuctions(prev => prev.map(auction => 
        auction._id === bidData.auctionId 
          ? {
              ...auction,
              currentBid: bidData.currentBid,
              totalBids: bidData.totalBids,
              highestBidder: bidData.bidder
            }
          : auction
      ));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    
    const params = new URLSearchParams({ 
      page: String(page), 
      limit: String(limit), 
      sortBy: sort
    });
    
    if (q) params.set("search", q);
    if (filters.auctionType) params.set("auctionType", filters.auctionType);
    if (filters.make) params.set("make", filters.make);
    if (filters.year) params.set("year", filters.year);
    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);
    
    // Handle price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      if (min) params.set("priceMin", min);
      if (max) params.set("priceMax", max);
    }
    
    fetch(`${apiBase}/api/auctions/active?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(({ auctions: data, total: t }) => { 
        setAuctions(data || []); 
        setTotal(t || 0); 
      })
      .catch(() => {})
      .finally(() => setLoading(false));
      
    return () => controller.abort();
  }, [q, sort, page, limit, filters]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const toAbsUrl = (u) => {
    if (!u) return "";
    if (u.startsWith("http") || u.startsWith("data:")) return u;
    return `${apiBase}${u}`;
  };

  return (
    <div>
      {/* Listings Navbar */}
      <ListingsNavbar
        q={q}
        setQ={setQ}
        filters={filters}
        setFilters={setFilters}
        makes={makes}
        models={[]} // We'll handle models differently for auctions
        categories={categories}
        activeFilterCount={activeFilterCount}
        isAuction={true}
      />
      
      {/* Breadcrumb Section */}
      <section className="py-3 bg-light" style={{ marginTop: '110px' }}>
        <div className="container-fluid px-3 px-md-4 px-lg-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 d-flex align-items-center">
              <li className="breadcrumb-item d-flex align-items-center">
                <a href="/" className="text-decoration-none d-flex align-items-center">
                  <HiHome className="me-1" size={16} />
                  Home
                </a>
              </li>
              <li className="breadcrumb-item d-flex align-items-center">
                <HiChevronRight className="mx-2 text-muted" size={14} />
                <span className="d-flex align-items-center">
                  <MdGavel className="me-1" size={16} />
                  Live Auctions
                </span>
              </li>
              {filters.auctionType && (
                <li className="breadcrumb-item d-flex align-items-center">
                  <HiChevronRight className="mx-2 text-muted" size={14} />
                  <span className="text-primary fw-medium">
                    {filters.auctionType === 'standard' ? 'Standard Auctions' : 
                     filters.auctionType === 'reserve' ? 'Reserve Auctions' : 'Buy It Now'}
                  </span>
                </li>
              )}
              {filters.make && (
                <li className="breadcrumb-item d-flex align-items-center">
                  <HiChevronRight className="mx-2 text-muted" size={14} />
                  <span className="text-primary fw-medium">
                    {makes.find(m => m._id === filters.make)?.name}
                  </span>
                </li>
              )}
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
                    <h5 className="text-uppercase n4-color">{total} live auctions</h5>
                    <p className="fs-nine n4-color">
                      Bid on premium vehicles from trusted sellers.
                    </p>
                  </div>
                </div>
                <div className="col-sm-6 col-md-8 col-xl-7">
                  <div className="row justify-content-end justify-content-xl-start justify-content-xl-end">
                    <div className="col-md-7 d-flex justify-content-end gap-3 gap-md-5">
                      <div className="d-center w-100 justify-content-end gap-2">
                        <span className="n4-color text-capitalize text-nowrap">Sort By:</span>
                        <div className="w-auto single-input single-select w-100 px-3 px-md-4 py-2 py-lg-3 cus-border border b-sixth rounded-pill">
                          <select 
                            className="select-two"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                          >
                            <option value="endDate">Ending Soon</option>
                            <option value="-endDate">Ending Later</option>
                            <option value="-currentBid">Highest Bid</option>
                            <option value="currentBid">Lowest Bid</option>
                            <option value="-totalBids">Most Bids</option>
                            <option value="totalBids">Fewest Bids</option>
                            <option value="-createdAt">Newest</option>
                            <option value="createdAt">Oldest</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auction Listings */}
              <div className="grid-list-template second-template">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 n4-color">Loading auctions...</p>
                  </div>
                ) : auctions.length === 0 ? (
                  <div className="text-center py-5">
                    <h5 className="n4-color">No auctions found</h5>
                    <p className="n5-color">Try adjusting your filters or check back later for new auctions</p>
                  </div>
                ) : (
                  auctions.map(auction => (
                    <AuctionCard key={auction._id} auction={auction} toAbsUrl={toAbsUrl} />
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="col-12 mt-5">
                  <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-xxl-4 p-0 p-xl-3 sidebar-wrapper-area second d-flex d-sm-block d-xxl-flex flex-column gap-5 gap-md-8">
              {/* Auction Stats */}
              <div className="n4-2nd-bg-color p-2 p-md-3 cus-border border b-sixth">
                <div className="n4-3rd-bg-color py-3 py-md-4 ps-4 ps-md-6 d-center justify-content-between">
                  <h3 className="d-grid text-uppercase">
                    <span className="fw-bolder n4-color">Live Bidding</span>
                    <span className="fw-normal n4-color">happening now!</span>
                  </h3>
                  <div className="img-area pe-none">
                    <img src="/assets/images/icon/offer-icon.webp" alt="image" />
                  </div>
                </div>
                <div className="d-center justify-content-between pt-3 pt-md-5">
                  <div className="more-btn">
                    <button
                      type="button"
                      className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6"
                      onClick={() => window.location.href = '/user/auctions/new'}
                    >
                      <span className="fs-ten n4-color fw-semibold text-nowrap text-uppercase transition">
                        Start Selling
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* How Auctions Work */}
              <div className="n4-2nd-bg-color py-5 py-lg-8 px-3 px-md-6 px-lg-10 cus-border border b-sixth">
                <div className="section-area mb-5 mb-md-8 d-grid gap-3 gap-md-4">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">How It Works</span>
                  <h3 className="text-uppercase">
                    <span className="fw-bolder n4-color">Simple Steps To</span>
                    <span className="fw-normal n4-color">Win Auctions!</span>
                  </h3>
                </div>
                <div className="d-grid gap-8 gap-md-6 mt-5 mt-md-8">
                  <div className="d-flex flex-column flex-lg-column flex-xxl-row gap-4 gap-lg-10">
                    <div className="icon-area p1-3rd-bg-color d-center rounded-circle cus-border border b-third box-area box-four">
                      <img src="/assets/images/icon/rent-step-icon-1.webp" alt="Browse" />
                    </div>
                    <div className="text-area d-grid gap-2">
                      <span className="p1-color font-tertiary">Step 1</span>
                      <h5 className="text-uppercase">
                        <span className="n4-color fw-bolder">Browse</span>
                        <span className="n4-color fw-normal">Auctions</span>
                      </h5>
                      <p className="n5-color mt-1">Find vehicles you love from our live auction listings.</p>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-lg-column flex-xxl-row gap-4 gap-lg-10">
                    <div className="icon-area p1-3rd-bg-color d-center rounded-circle cus-border border b-third box-area box-four">
                      <img src="/assets/images/icon/rent-step-icon-2.webp" alt="Bid" />
                    </div>
                    <div className="text-area d-grid gap-2">
                      <span className="p1-color font-tertiary">Step 2</span>
                      <h5 className="text-uppercase">
                        <span className="n4-color fw-bolder">Place Your</span>
                        <span className="n4-color fw-normal">Bid</span>
                      </h5>
                      <p className="n5-color mt-1">Set your maximum bid and let our system bid for you automatically.</p>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-lg-column flex-xxl-row gap-4 gap-lg-10">
                    <div className="icon-area p1-3rd-bg-color d-center rounded-circle cus-border border b-third box-area box-four">
                      <img src="/assets/images/icon/rent-step-icon-3.webp" alt="Win" />
                    </div>
                    <div className="text-area d-grid gap-2">
                      <span className="p1-color font-tertiary">Step 3</span>
                      <h5 className="text-uppercase">
                        <span className="n4-color fw-bolder">Win &</span>
                        <span className="n4-color fw-normal">Pay</span>
                      </h5>
                      <p className="n5-color mt-1">If you win, complete payment and arrange vehicle pickup or delivery.</p>
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

export default AuctionsFront;
