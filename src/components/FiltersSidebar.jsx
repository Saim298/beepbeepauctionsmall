import React from "react";

const FiltersSidebar = ({ q, setQ, filters, setFilters, brands, categories, activeFilterCount }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setQ("");
    setFilters({
      brand: "",
      category: "",
      condition: "",
      priceRange: "",
      compatibility: ""
    });
  };

  const conditionOptions = [
    { value: "", label: "All Conditions" },
    { value: "new", label: "New" },
    { value: "used_excellent", label: "Used - Excellent" },
    { value: "used_good", label: "Used - Good" },
    { value: "used_fair", label: "Used - Fair" },
    { value: "refurbished", label: "Refurbished" },
    { value: "remanufactured", label: "Remanufactured" }
  ];

  const priceRanges = [
    { value: "", label: "Any Price" },
    { value: "0-50", label: "Under $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-250", label: "$100 - $250" },
    { value: "250-500", label: "$250 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "1000-", label: "Over $1,000" }
  ];

  return (
    <div className="filters-sidebar bg-white border rounded-0 p-0 h-100" style={{ borderColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="px-4 py-3 border-bottom" style={{ backgroundColor: '#f8f9fa', borderColor: '#e0e0e0' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-semibold text-dark">
            Filters
          </h6>
          {activeFilterCount > 0 && (
            <span className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: '11px' }}>
              {activeFilterCount}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="d-grid gap-4">
          {/* Search */}
          <div>
            <label className="form-label fw-medium text-dark mb-2" style={{ fontSize: '14px' }}>
              Search
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Search parts, brands..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ 
                borderColor: '#d1d5db',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* Brand Filter */}
          <div>
            <label className="form-label fw-medium text-dark mb-2" style={{ fontSize: '14px' }}>
              Brand
            </label>
            <select
              className="form-select"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              style={{ 
                borderColor: '#d1d5db',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px'
              }}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="form-label fw-medium text-dark mb-2" style={{ fontSize: '14px' }}>
              Category
            </label>
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{ 
                borderColor: '#d1d5db',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {typeof category === 'string' ? category.replace('_', ' ') : category}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="form-label fw-medium text-dark mb-2" style={{ fontSize: '14px' }}>
              Condition
            </label>
            <select
              className="form-select"
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              style={{ 
                borderColor: '#d1d5db',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px'
              }}
            >
              {conditionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="form-label fw-medium text-dark mb-2" style={{ fontSize: '14px' }}>
              Price Range
            </label>
            <select
              className="form-select"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              style={{ 
                borderColor: '#d1d5db',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px'
              }}
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Compatibility Filter */}
          <div>
            <label className="form-label fw-medium text-dark mb-2" style={{ fontSize: '14px' }}>
              Compatibility
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. BMW, Toyota..."
              value={filters.compatibility}
              onChange={(e) => handleFilterChange('compatibility', e.target.value)}
              style={{ 
                borderColor: '#d1d5db',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* Clear Filters */}
          <div className="pt-2">
            <button
              className="btn btn-outline-secondary w-100 py-2 fw-medium"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
              style={{ 
                fontSize: '14px',
                borderRadius: '4px',
                borderColor: '#d1d5db'
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-4 border-top" style={{ borderColor: '#e0e0e0' }}>
            <h6 className="fw-medium mb-3 text-dark" style={{ fontSize: '14px' }}>
              Active Filters
            </h6>
            <div className="d-flex flex-column gap-2">
              {q && (
                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <span className="text-dark small">
                    Search: {q}
                  </span>
                  <button 
                    className="btn btn-sm p-0" 
                    style={{ color: '#6b7280', width: '20px', height: '20px' }}
                    onClick={() => setQ('')}
                  >
                    <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
              )}
              {filters.brand && (
                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <span className="text-dark small">
                    Brand: {filters.brand}
                  </span>
                  <button 
                    className="btn btn-sm p-0" 
                    style={{ color: '#6b7280', width: '20px', height: '20px' }}
                    onClick={() => handleFilterChange('brand', '')}
                  >
                    <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
              )}
              {filters.category && (
                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <span className="text-dark small">
                    Category: {typeof filters.category === 'string' ? filters.category.replace('_', ' ') : filters.category}
                  </span>
                  <button 
                    className="btn btn-sm p-0" 
                    style={{ color: '#6b7280', width: '20px', height: '20px' }}
                    onClick={() => handleFilterChange('category', '')}
                  >
                    <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
              )}
              {filters.condition && (
                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <span className="text-dark small">
                    Condition: {conditionOptions.find(c => c.value === filters.condition)?.label}
                  </span>
                  <button 
                    className="btn btn-sm p-0" 
                    style={{ color: '#6b7280', width: '20px', height: '20px' }}
                    onClick={() => handleFilterChange('condition', '')}
                  >
                    <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
              )}
              {filters.priceRange && (
                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <span className="text-dark small">
                    Price: {priceRanges.find(p => p.value === filters.priceRange)?.label}
                  </span>
                  <button 
                    className="btn btn-sm p-0" 
                    style={{ color: '#6b7280', width: '20px', height: '20px' }}
                    onClick={() => handleFilterChange('priceRange', '')}
                  >
                    <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
              )}
              {filters.compatibility && (
                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <span className="text-dark small">
                    Compatibility: {filters.compatibility}
                  </span>
                  <button 
                    className="btn btn-sm p-0" 
                    style={{ color: '#6b7280', width: '20px', height: '20px' }}
                    onClick={() => handleFilterChange('compatibility', '')}
                  >
                    <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersSidebar;
