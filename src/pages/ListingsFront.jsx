import React, { useEffect, useMemo, useState } from "react";
import CarCard from "../components/CarCard";
import Pagination from "../components/Pagination";
import ListingsNavbar from "../components/ListingsNavbar";
import { HiHome, HiChevronRight } from "react-icons/hi";
import { MdDirectionsCar } from "react-icons/md";

const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const ListingsFront = () => {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [cars, setCars] = useState([]);

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({ 
    make: "", 
    model: "", 
    year: "", 
    category: "", 
    priceRange: "",
    location: "" 
  });

  const activeFilterCount = useMemo(() => {
    return [q, filters.make, filters.model, filters.year, filters.category, filters.priceRange, filters.location].filter(Boolean).length;
  }, [q, filters]);

  useEffect(() => {
    fetch(`${apiBase}/api/makes`).then(r => r.json()).then(setMakes).catch(()=>{});
    fetch(`${apiBase}/api/categories`).then(r => r.json()).then(setCategories).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!filters.make) { setModels([]); return; }
    fetch(`${apiBase}/api/makes/${filters.make}/models`).then(r => r.json()).then(setModels).catch(()=>{});
  }, [filters.make]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: String(limit), sort });
    if (q) params.set("q", q);
    if (filters.make) params.set("make", filters.make);
    if (filters.model) params.set("model", filters.model);
    if (filters.year) params.set("year", filters.year);
    if (filters.category) params.set("categories", filters.category);
    if (filters.location) params.set("location", filters.location);
    
    // Handle price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      if (min) params.set("priceMin", min);
      if (max) params.set("priceMax", max);
    }
    
    fetch(`${apiBase}/api/cars?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(({ data, total: t }) => { setCars(data || []); setTotal(t || 0); })
      .catch(() => {});
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
        models={models}
        categories={categories}
        activeFilterCount={activeFilterCount}
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
                  <MdDirectionsCar className="me-1" size={16} />
                  Car Listings
                </span>
              </li>
              {filters.make && (
                <li className="breadcrumb-item d-flex align-items-center">
                  <HiChevronRight className="mx-2 text-muted" size={14} />
                  <span className="text-primary fw-medium">
                    {makes.find(m => m._id === filters.make)?.name}
                </span>
                </li>
              )}
              {filters.model && (
                <li className="breadcrumb-item d-flex align-items-center">
                  <HiChevronRight className="mx-2 text-muted" size={14} />
                  <span className="text-primary fw-medium">
                    {models.find(m => m._id === filters.model)?.name}
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
                    <h5 className="text-uppercase n4-color">{total} cars available</h5>
                    <p className="fs-nine n4-color">
                      These cars are available for purchase.
                    </p>
                  </div>
                </div>
                <div className="col-sm-6 col-md-8 col-xl-7">
                  <div className="row justify-content-end justify-content-xl-start justify-content-xl-end">
                    <div className="col-md-7 d-flex justify-content-end gap-3 gap-md-5">
                      <div className="d-center w-100 justify-content-end gap-2">
                        <span className="n4-color text-capitalize text-nowrap">
                          Sort By:
                        </span>
                        <div className="w-auto single-input single-select w-100 px-3 px-md-4 py-2 py-lg-3 cus-border border b-sixth rounded-pill">
                          <select 
                            className="select-two"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                          >
                            <option value="-createdAt">Newest</option>
                            <option value="createdAt">Oldest</option>
                            <option value="-price">Price High to Low</option>
                            <option value="price">Price Low to High</option>
                            <option value="name">Name A-Z</option>
                            <option value="-name">Name Z-A</option>
                            <option value="-year">Year Newest</option>
                            <option value="year">Year Oldest</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid-list-btn d-center d-none d-lg-flex gap-2 gap-md-3">
                        <button className="box-area box-ten transition n1-bg-color cus-border border rounded-circle d-center grid-active">
                          <span className="d-center fs-five n4-color">
                            <i className="ph ph-squares-four"></i>
                          </span>
                        </button>
                        <button className="box-area box-ten transition n1-bg-color cus-border border rounded-circle d-center list-active">
                          <span className="d-center fs-five n4-color">
                            <i className="ph ph-list"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Car Listings */}
              <div className="grid-list-template second-template">
                {cars.length === 0 ? (
                  <div className="text-center py-5">
                    <h5 className="n4-color">No cars found</h5>
                    <p className="n5-color">Try adjusting your filters or search terms</p>
                      </div>
                ) : (
                  cars.map(car => (
                    <CarCard key={car._id} car={car} toAbsUrl={toAbsUrl} />
                  ))
                )}
                      </div>

              {/* Pagination */}
              <div className="col-12">
                <Pagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  onPageChange={setPage} 
                            />
                          </div>
                        </div>

            {/* Sidebar */}
            <div className="col-xxl-4 p-0 p-xl-3 sidebar-wrapper-area second d-flex d-sm-block d-xxl-flex flex-column gap-5 gap-md-8">
              <div className="n4-2nd-bg-color p-2 p-md-3 cus-border border b-sixth multi-slider-parent">
                <div className="n4-3rd-bg-color py-3 py-md-4 ps-4 ps-md-6 d-center justify-content-between">
                  <h3 className="d-grid text-uppercase">
                    <span className="fw-bolder n4-color">Save 10%+</span>
                    <span className="fw-normal n4-color">on car purchases!</span>
                  </h3>
                  <div className="img-area pe-none">
                    <img src="/assets/images/icon/offer-icon.webp" alt="image" />
                  </div>
                </div>
                {/* Featured car would go here */}
                <div className="d-center justify-content-between pt-3 pt-md-5">
                  <div className="more-btn">
                    <button
                      type="button"
                      className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6"
                    >
                      <span className="fs-ten n4-color fw-semibold text-nowrap text-uppercase transition">
                        See More Deals
                      </span>
                    </button>
                  </div>
                  </div>
                </div>

              <div className="n4-2nd-bg-color py-5 py-lg-8 px-3 px-md-6 px-lg-10 cus-border border b-sixth order-1">
                <div className="section-area mb-5 mb-md-8 d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">
                    What Customers Say
                  </span>
                  <h3 className="text-uppercase">
                    <span className="fw-bolder n4-color">Real Reviews,</span>
                    <span className="fw-normal n4-color">Real Shine</span>
                  </h3>
                </div>
                <div className="swiper multi-slider">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <div className="cus-border border b-sixth py-6 py-lg-10 px-3 px-md-6 d-grid gap-2 gap-md-3">
                        <ul className="d-center justify-content-start gap-1 gap-md-2">
                          {[...Array(5)].map((_, i) => (
                            <li key={i}>
                              <span className="fs-six d-center s3-color">
                                <i className="fa-solid fa-star"></i>
                            </span>
                          </li>
                          ))}
                        </ul>
                        <p className="fs-five n4-color">
                          Quick bidding, great deals, and amazing cars! Highly recommend
                        </p>
                        <div className="d-center justify-content-start gap-3 gap-md-4 mt-3">
                          <div className="img-area box-area box-one position-relative">
                            <img
                              src="/assets/images/trusted-img-4.webp"
                              className="w-100 rounded-circle"
                              alt="Image"
                            />
                            <span className="d-center transition fs-eight n1-color box-area box-two p1-bg-color rounded-circle position-absolute bottom-0 end-0">
                              <i className="ph ph-quotes"></i>
                            </span>
                          </div>
                          <div className="text-area">
                            <h6 className="fs-six n4-color fw-medium">
                              David Carter
                            </h6>
                            <span className="fs-eight n4-2nd-color">
                              Car Collector
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="n4-2nd-bg-color py-5 py-lg-8 px-3 px-md-6 px-lg-10 cus-border border b-sixth">
                <div className="section-area mb-5 mb-md-8 d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">
                    Fast & Easy Way To Buy A Car
                  </span>
                  <h3 className="d-grid text-uppercase">
                    <span className="fw-bolder n4-color">
                      Make 4 Simple Steps To
                    </span>
                    <span className="fw-normal n4-color">Buy a Car!</span>
                  </h3>
                </div>
                <div className="d-grid gap-8 gap-md-6 mt-5 mt-md-8">
                  <div className="d-flex flex-column flex-lg-column flex-xxl-row gap-4 gap-lg-10">
                    <div className="icon-area p1-3rd-bg-color d-center rounded-circle cus-border border b-third box-area box-four">
                      <img
                        src="/assets/images/icon/rent-step-icon-1.webp"
                        alt="Image"
                      />
                    </div>
                    <div className="text-area d-grid gap-2">
                      <span className="p1-color font-tertiary">Step 1</span>
                      <h5 className="text-uppercase">
                        <span className="n4-color fw-bolder">Browse</span>
                        <span className="n4-color fw-normal">Cars</span>
                      </h5>
                      <p className="n5-color mt-1">
                        Explore our collection of premium classic and modern cars.
                      </p>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-lg-column flex-xxl-row gap-4 gap-lg-10">
                    <div className="icon-area p1-3rd-bg-color d-center rounded-circle cus-border border b-third box-area box-four">
                      <img
                        src="/assets/images/icon/rent-step-icon-2.webp"
                        alt="Image"
                      />
                    </div>
                    <div className="text-area d-grid gap-2">
                      <span className="p1-color font-tertiary">Step 2</span>
                      <h5 className="text-uppercase">
                        <span className="n4-color fw-bolder">Place Your</span>
                        <span className="n4-color fw-normal">Bid</span>
                      </h5>
                      <p className="n5-color mt-1">
                        Bid on cars you love or buy them instantly at asking price.
                      </p>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-lg-column flex-xxl-row gap-4 gap-lg-10">
                    <div className="icon-area p1-3rd-bg-color d-center rounded-circle cus-border border b-third box-area box-four">
                      <img
                        src="/assets/images/icon/rent-step-icon-3.webp"
                        alt="Image"
                      />
                    </div>
                    <div className="text-area d-grid gap-2">
                      <span className="p1-color font-tertiary">Step 3</span>
                      <h5 className="text-uppercase">
                        <span className="n4-color fw-bolder">Secure</span>
                        <span className="n4-color fw-normal">Payment</span>
                      </h5>
                      <p className="n5-color mt-1">
                        Complete your purchase with our secure payment system.
                      </p>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-lg-column flex-xxl-row gap-4 gap-lg-10">
                    <div className="icon-area p1-3rd-bg-color d-center rounded-circle cus-border border b-third box-area box-four">
                      <img
                        src="/assets/images/icon/rent-step-icon-4.webp"
                        alt="Image"
                      />
                    </div>
                    <div className="text-area d-grid gap-2">
                      <span className="p1-color font-tertiary">Step 4</span>
                      <h5 className="text-uppercase">
                        <span className="n4-color fw-bolder">Enjoy Your</span>
                        <span className="n4-color fw-normal">Car</span>
                      </h5>
                      <p className="n5-color mt-1">
                        Get your dream car delivered or arrange pickup.
                      </p>
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

export default ListingsFront;
