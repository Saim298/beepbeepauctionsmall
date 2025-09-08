import React, { useEffect, useMemo, useState } from "react";
import PartCardFront from "../components/PartCardFront";
import Pagination from "../components/Pagination";
import PartsNavbar from "../components/PartsNavbar";
import FiltersSidebar from "../components/FiltersSidebar";
import "../components/FiltersSidebar.css";
import { HiHome, HiChevronRight } from "react-icons/hi";
import { FiPackage } from "react-icons/fi";

const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const PartsListingFront = () => {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [parts, setParts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({ 
    brand: "", 
    category: "", 
    condition: "", 
    priceRange: "",
    compatibility: "" 
  });

  const activeFilterCount = useMemo(() => {
    return [q, filters.brand, filters.category, filters.condition, filters.priceRange, filters.compatibility].filter(Boolean).length;
  }, [q, filters]);

  useEffect(() => {
    fetch(`${apiBase}/api/parts/brands`).then(r => r.json()).then(setBrands).catch(()=>{});
    fetch(`${apiBase}/api/parts/categories`).then(r => r.json()).then(setCategories).catch(()=>{});
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), limit: String(limit), sort });
    if (q) params.set("search", q);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.category) params.set("category", filters.category);
    if (filters.condition) params.set("condition", filters.condition);
    if (filters.compatibility) params.set("compatibility", filters.compatibility);
    
    // Handle price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    
    fetch(`${apiBase}/api/parts?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(({ parts: partsData, pagination }) => { 
        setParts(partsData || []); 
        setTotal(pagination?.totalParts || 0); 
      })
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
      {/* Parts Navbar */}
      <PartsNavbar
        q={q}
        setQ={setQ}
      />
      
      {/* Breadcrumb Section */}
      <section className="py-3 bg-light" style={{ marginTop: '80px' }}>
        <div className="container-fluid px-3 px-md-4 px-lg-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 d-flex align-items-center">
              <li className="breadcrumb-item d-flex align-items-center">
                <a href="/" className="text-decoration-none d-flex align-items-center text-black" style={{color: '#D70007'}}>
                  <HiHome className="me-1" size={16} />
                  Home
                </a>
              </li>
              <li className="breadcrumb-item d-flex align-items-center">
                <HiChevronRight className="mx-2 text-muted" style={{color: '#D70007'}} size={14} />
                <span className="d-flex align-items-center text-black" style={{color: '#D70007'}}>
                  <FiPackage className="me-1" size={16} />
                  Products
                </span>
              </li>
              {filters.brand && (
                <li className="breadcrumb-item d-flex align-items-center">
                  <HiChevronRight className="mx-2 text-muted" size={14} />
                  <span className="text-primary fw-medium text-black">
                    {brands.find(b => b === filters.brand) || filters.brand}
                  </span>
                </li>
              )}
              {filters.category && (
                <li className="breadcrumb-item d-flex align-items-center">
                  <HiChevronRight className="mx-2 text-muted" size={14} />
                  <span className="text-primary fw-medium">
                    {filters.category.replace('_', ' ')}
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
          <div className="row gy-12 gy-xxl-0 px-3 px-md-4 px-lg-6">
            {/* Sidebar Column */}
            <div className="col-md-4 col-lg-3">
              <div className="filters-sidebar-container">
                <FiltersSidebar
                  q={q}
                  setQ={setQ}
                  filters={filters}
                  setFilters={setFilters}
                  brands={brands}
                  categories={categories}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            </div>
            
            {/* Main Content Column */}
            <div className="col-md-8 col-lg-9 main-body-content z-1 px-0">
              <div className="row d-center justify-content-between gy-3 mb-6 mb-md-11">
                <div className="col-sm-6 col-md-4 col-xl-5">
                  <div className="head-area d-grid gap-1 gap-md-2">
                    <h5 className="text-uppercase n4-color">{total} products available</h5>
                    <p className="fs-nine n4-color">
                      High-quality car products from trusted sellers.
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
                            <option value="-views">Most Popular</option>
                            <option value="views">Least Popular</option>
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

              {/* Parts Listings */}
              <div className="grid-list-template second-template">
                {parts.length === 0 ? (
                  <div className="text-center py-5">
                    <h5 className="n4-color">No products found</h5>
                    <p className="n5-color">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  parts.map(part => (
                    <PartCardFront key={part._id} part={part} toAbsUrl={toAbsUrl} />
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

          </div>
        </div>
      </section>
    </div>
  );
};

export default PartsListingFront;
