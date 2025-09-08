import React, { useEffect, useRef, useState } from "react";
import "../../pages/dashboard.css";
import Sidebar from "../../utils/Sidebar.jsx";
import { getAuthToken } from "../../api/client.js";

const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

// Reuse the same RichTextEditor from AddCar
const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== (value || "")) {
      el.innerHTML = value || "";
      setIsEmpty(el.innerText.trim().length === 0 && !el.querySelector("img"));
    }
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const run = (command, arg) => {
    restoreSelection();
    document.execCommand(command, false, arg);
    const html = editorRef.current?.innerHTML || "";
    onChange(html);
    setIsEmpty(editorRef.current?.innerText.trim().length === 0 && !editorRef.current?.querySelector("img"));
    saveSelection();
  };

  const onInput = () => {
    const html = editorRef.current?.innerHTML || "";
    onChange(html);
    setIsEmpty(editorRef.current?.innerText.trim().length === 0 && !editorRef.current?.querySelector("img"));
    saveSelection();
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const insertImageFromFile = async (file) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("image", file);
      setIsUploading(true);
      const res = await fetch(`${apiBase}/api/uploads/editor`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data?.url) {
        restoreSelection();
        document.execCommand("insertImage", false, `${apiBase}${data.url}`);
        onInput();
        showToast("Image uploaded", "success");
      } else {
        showToast(data?.message || "Upload failed", "error");
      }
    } catch (_e) {
      showToast("Upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const onPaste = (e) => {
    const items = e.clipboardData?.items || [];
    const imageItem = Array.from(items).find((i) => i.type && i.type.startsWith("image/"));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) insertImageFromFile(file);
      return;
    }
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    onInput();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    const image = files.find((f) => f.type.startsWith("image/"));
    if (image) insertImageFromFile(image);
  };

  const createLink = () => {
    const url = window.prompt("Enter URL");
    if (!url) return;
    run("createLink", url);
  };

  const block = (tag) => run("formatBlock", tag);

  const openImagePicker = () => {
    saveSelection();
    fileInputRef.current?.click();
  };

  return (
    <div className="rte" style={{ display: "flex", flexDirection: "column" }}>
      <div className="rte-toolbar" style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 8, borderBottom: "1px solid var(--glass-300)", background: "var(--glass-100)", position: "sticky", top: 0, zIndex: 1 }} onMouseDown={(e) => e.preventDefault()}>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" className="pill" onClick={() => run("bold")}>Bold</button>
          <button type="button" className="pill" onClick={() => run("italic")}>Italic</button>
          <button type="button" className="pill" onClick={() => run("underline")}>Underline</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" className="pill" onClick={() => block("H1")}>H1</button>
          <button type="button" className="pill" onClick={() => block("H2")}>H2</button>
          <button type="button" className="pill" onClick={() => block("P")}>Paragraph</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" className="pill" onClick={() => run("insertOrderedList")}>Numbered</button>
          <button type="button" className="pill" onClick={() => run("insertUnorderedList")}>Bulleted</button>
          <button type="button" className="pill" onClick={() => block("BLOCKQUOTE")}>Quote</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" className="pill" onClick={() => run("justifyLeft")}>Left</button>
          <button type="button" className="pill" onClick={() => run("justifyCenter")}>Center</button>
          <button type="button" className="pill" onClick={() => run("justifyRight")}>Right</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" className="pill" onClick={createLink}>Link</button>
          <button type="button" className="pill" onClick={openImagePicker}>Image</button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) insertImageFromFile(file); e.currentTarget.value = ""; }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          <button type="button" className="pill" onClick={() => run("removeFormat")}>Clear</button>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {isUploading && (
          <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
            <span className="pill" style={{ opacity: 0.85 }}>Uploading image…</span>
          </div>
        )}
        {toast && (
          <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 2 }}>
            <span className="pill" style={{ background: toast.type === 'success' ? 'var(--green-500)' : toast.type === 'error' ? 'var(--red-500)' : undefined }}>
              {toast.message}
            </span>
          </div>
        )}
        {!isFocused && isEmpty && (
          <div style={{ position: "absolute", top: 12, left: 12, color: "var(--muted)", pointerEvents: "none" }}>
            Describe the part condition, features, and installation notes…
          </div>
        )}
        <div
          className={`rte-editor ${isFocused ? "focused" : ""}`}
          contentEditable
          ref={editorRef}
          onInput={onInput}
          onPaste={onPaste}
          onDrop={onDrop}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onFocus={() => { setIsFocused(true); saveSelection(); }}
          onBlur={() => setIsFocused(false)}
          style={{ minHeight: 200, padding: 12, outline: "none", lineHeight: 1.6, borderRadius: 8 }}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
};

const UserAddSparePart = () => {
  const [theme, setTheme] = useState(localStorage.getItem("beep-theme") || "dark");
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    // Part details
    name: "",
    partNumber: "",
    brand: "",
    category: "",
    subcategory: "",
    compatibility: "", // Compatible car models
    year: "",
    condition: "new",
    location: "",
    descriptionHtml: "",
    price: "",
    quantity: "1",
    weight: "",
    dimensions: "",
    warranty: "",
    returnPolicy: "7_days",
    oem: false, // Original Equipment Manufacturer
    aftermarket: true,
    used: false,
    remanufactured: false,
    partType: "engine", // engine, transmission, suspension, etc.
    material: "",
    color: "",
    sellerNotes: ""
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => { localStorage.setItem("beep-theme", theme); }, [theme]);
  useEffect(() => {
    fetch(`${apiBase}/api/makes`).then((r) => r.json()).then(setMakes);
  }, []);
  useEffect(() => {
    let isMounted = true;
    fetch(`${apiBase}/api/categories`)
      .then((r) => r.json())
      .then((data) => isMounted && setCategories(data))
      .catch(() => {});
    return () => { isMounted = false };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const q = categorySearch.trim();
    const timer = setTimeout(() => {
      fetch(`${apiBase}/api/categories${q ? `?q=${encodeURIComponent(q)}` : ""}`, { signal: controller.signal })
        .then((r) => r.json())
        .then(setCategories)
        .catch(() => {});
    }, 250);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [categorySearch]);
  useEffect(() => {
    if (form.makeId)
      fetch(`${apiBase}/api/makes/${form.makeId}/models`)
        .then((r) => r.json())
        .then(setModels);
    else setModels([]);
  }, [form.makeId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    
    try {
      // Create the spare part listing
      const partPayload = {
        name: form.name,
        partNumber: form.partNumber,
        brand: form.brand,
        category: form.partType,
        subcategory: form.subcategory,
        compatibility: form.compatibility,
        year: form.year,
        condition: form.condition,
        location: form.location,
        descriptionHtml: form.descriptionHtml,
        price: Number(form.price) || 0,
        quantity: Number(form.quantity) || 1,
        weight: form.weight ? Number(form.weight) : undefined,
        dimensions: form.dimensions,
        warranty: form.warranty,
        returnPolicy: form.returnPolicy,
        oem: form.oem,
        aftermarket: form.aftermarket,
        used: form.condition.includes('used'),
        remanufactured: form.condition === 'remanufactured',
        partType: form.partType,
        material: form.material,
        color: form.color,
        sellerNotes: form.sellerNotes,
        listingType: 'part',
        status: 'active',
        media: []
      };

      const partResponse = await fetch(`${apiBase}/api/my/parts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(partPayload),
      });
      
      const partListing = await partResponse.json();
      
      if (!partResponse.ok || !partListing._id) {
        throw new Error(partListing.message || 'Failed to create part listing');
      }

      // Upload media files if any
      if (mediaFiles.length) {
        const formData = new FormData();
        mediaFiles.forEach((f) => formData.append("media", f));
        await fetch(`${apiBase}/api/my/parts/${partListing._id}/media`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      alert("Part listed successfully! It is now available for purchase.");
      window.location.href = "/user/parts";
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">List Spare Part</h1>
              <span className="page-subtitle">Add your car part to the marketplace</span>
            </div>
            <div className="topbar-right">
              <button className="pill" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </header>

          <form className="panel glass" style={{ padding: 16 }} onSubmit={onSubmit}>
            <div className="form-grid">
              {/* Part Details Section */}
              <div style={{ gridColumn: '1 / -1', marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 16px 0', padding: '12px 0', borderBottom: '1px solid var(--glass-300)' }}>
                  Part Information
                </h3>
              </div>

              <div className="form-row">
                <label>Part Name *</label>
                <input
                  className="input glass big"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="BMW E46 M3 Engine Mount"
                  required
                />
              </div>

              <div className="form-row">
                <label>Part Number</label>
                <input
                  className="input glass big"
                  value={form.partNumber}
                  onChange={(e) => setForm({ ...form, partNumber: e.target.value })}
                  placeholder="22116779972"
                />
              </div>

              <div className="form-row">
                <label>Brand</label>
                  <input
                    className="input glass big"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="BMW, Bosch, Brembo, etc."
                />
              </div>

              <div className="form-row">
                <label>Part Category *</label>
                  <select
                    className="input glass big"
                  value={form.partType}
                  onChange={(e) => setForm({ ...form, partType: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  <option value="engine">Engine</option>
                  <option value="transmission">Transmission</option>
                  <option value="suspension">Suspension</option>
                  <option value="brakes">Brakes</option>
                  <option value="electrical">Electrical</option>
                  <option value="exhaust">Exhaust</option>
                  <option value="interior">Interior</option>
                  <option value="exterior">Exterior</option>
                  <option value="cooling">Cooling</option>
                  <option value="fuel_system">Fuel System</option>
                  <option value="steering">Steering</option>
                  <option value="wheels_tires">Wheels & Tires</option>
                  </select>
              </div>

              <div className="form-row">
                <label>Compatible Year(s)</label>
                <input
                  className="input glass big"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="2000-2006 or 2005"
                />
              </div>

              <div className="form-row">
                <label>Compatible Models</label>
                <input
                  className="input glass big"
                  value={form.compatibility}
                  onChange={(e) => setForm({ ...form, compatibility: e.target.value })}
                  placeholder="BMW E46 M3, E46 330i, E46 325i"
                />
              </div>

              <div className="form-row">
                <label>Condition *</label>
                <select
                  className="input glass big"
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  required
                >
                  <option value="new">New</option>
                  <option value="used_excellent">Used - Excellent</option>
                  <option value="used_good">Used - Good</option>
                  <option value="used_fair">Used - Fair</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="remanufactured">Remanufactured</option>
                </select>
              </div>

              <div className="form-row">
                <label>Price (USD) *</label>
                <input
                  className="input glass big"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="150.00"
                  required
                />
              </div>

              <div className="form-row">
                <label>Quantity</label>
                <input
                  className="input glass big"
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder="1"
                  min="1"
                />
              </div>

              <div className="form-row">
                <label>Location</label>
                <input
                  className="input glass big"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Los Angeles, CA"
                />
              </div>

              <div className="form-row">
                <label>Weight (lbs)</label>
                <input
                  className="input glass big"
                  type="number"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="5.2"
                />
              </div>

              <div className="form-row">
                <label>Dimensions (L x W x H)</label>
                <input
                  className="input glass big"
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  placeholder="12 x 8 x 4 inches"
                />
              </div>

              {/* Products Specifications */}
              <div style={{ gridColumn: '1 / -1', marginBottom: 24, marginTop: 32 }}>
                <h3 style={{ margin: '0 0 16px 0', padding: '12px 0', borderBottom: '1px solid var(--glass-300)' }}>
                  Products Specifications
                </h3>
              </div>

                <div className="form-row">
                <label>Material</label>
                  <input
                    className="input glass big"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  placeholder="Aluminum, Steel, Carbon Fiber, etc."
                  />
                </div>

                <div className="form-row">
                <label>Color/Finish</label>
                  <input
                    className="input glass big"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="Black, Silver, Red, etc."
                  />
                </div>

              <div className="form-row">
                <label>Warranty Period</label>
                <select
                  className="input glass big"
                  value={form.warranty}
                  onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                >
                  <option value="">No Warranty</option>
                  <option value="30_days">30 Days</option>
                  <option value="90_days">90 Days</option>
                  <option value="6_months">6 Months</option>
                  <option value="1_year">1 Year</option>
                  <option value="2_years">2 Years</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>

              <div className="form-row">
                <label>Return Policy</label>
                <select
                  className="input glass big"
                  value={form.returnPolicy}
                  onChange={(e) => setForm({ ...form, returnPolicy: e.target.value })}
                >
                  <option value="no_returns">No Returns</option>
                  <option value="7_days">7 Days</option>
                  <option value="14_days">14 Days</option>
                  <option value="30_days">30 Days</option>
                </select>
              </div>

              <div className="form-row">
                <label>Description</label>
                <div className="input glass big" style={{ padding: 0 }}>
                  <RichTextEditor
                    value={form.descriptionHtml}
                    onChange={(val) => setForm({ ...form, descriptionHtml: val })}
                  />
                </div>
              </div>

              <div className="form-row">
                <label>Media (images/videos)</label>
                <input
                  className="input glass big"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
                />
                {mediaFiles.length > 0 && (
                  <div className="d-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 8 }}>
                    {mediaFiles.map((f, idx) => (
                      <div key={idx} style={{ border: "1px solid var(--glass-300)", borderRadius: 8, overflow: "hidden", padding: 4 }}>
                        <span className="muted" style={{ fontSize: 12 }}>{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Part Type Options */}
              <div style={{ gridColumn: '1 / -1', marginTop: 24 }}>
                <div className="d-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={form.oem}
                      onChange={(e) => setForm({ ...form, oem: e.target.checked })}
                    />
                    OEM (Original Equipment Manufacturer)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={form.aftermarket}
                      onChange={(e) => setForm({ ...form, aftermarket: e.target.checked })}
                    />
                    Aftermarket
                  </label>
                </div>
              </div>
            </div>

            <div className="actions" style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button className="pill" type="submit">List Part</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserAddSparePart;
