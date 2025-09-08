import React, { useEffect, useRef, useState } from "react";
import "../../pages/dashboard.css";
import Sidebar from "../../utils/Sidebar.jsx";
import { getAuthToken } from "../../api/client.js";

const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

// Lightweight Rich Text Editor (no external deps)
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
    // Upload to backend then insert URL
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
    // paste plain text
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
    <div
      className="rte"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div
        className="rte-toolbar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: 8,
          borderBottom: "1px solid var(--glass-300)",
          background: "var(--glass-100)",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) insertImageFromFile(file);
              e.currentTarget.value = "";
            }}
          />
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
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              color: "var(--muted)",
              pointerEvents: "none",
            }}
          >Write details, add lists, or insert images…</div>
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
          onFocus={() => {
            setIsFocused(true);
            saveSelection();
          }}
          onBlur={() => setIsFocused(false)}
          style={{
            minHeight: 200,
            padding: 12,
            outline: "none",
            lineHeight: 1.6,
            borderRadius: 8,
          }}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
};

const UserAddCar = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("beep-theme") || "dark"
  );
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    makeId: "",
    makeName: "",
    modelId: "",
    modelName: "",
    year: "",
    era: "",
    origin: "",
    location: "",
    categoryIds: [],
    descriptionHtml: "",
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  

  useEffect(() => {
    localStorage.setItem("beep-theme", theme);
  }, [theme]);
  useEffect(() => {
    fetch(`${apiBase}/api/makes`)
      .then((r) => r.json())
      .then(setMakes);
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
      fetch(
        `${apiBase}/api/categories${q ? `?q=${encodeURIComponent(q)}` : ""}`,
        { signal: controller.signal }
      )
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

  const onSubmit = (e) => {
    e.preventDefault();
    const token = getAuthToken();
    const payload = {
      name: form.name,
      price: Number(form.price),
      make: form.makeId || undefined,
      makeName: form.makeName || undefined,
      model: form.modelId || undefined,
      modelName: form.modelName || undefined,
      year: Number(form.year),
      era: form.era,
      origin: form.origin,
      location: form.location,
      categories: form.categoryIds,
      descriptionHtml: form.descriptionHtml,
      media: [],
    };
    fetch(`${apiBase}/api/my/cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(async (listing) => {
        // If not admin, ensure listing is created under the current user (backend uses req.user.id)
        if (listing?._id && mediaFiles.length) {
          const formData = new FormData();
          mediaFiles.forEach((f) => formData.append("media", f));
          await fetch(`${apiBase}/api/my/cars/${listing._id}/media`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        }
        alert("Car submitted");
        window.location.href = "/user/listings";
      });
  };

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">Submit Your Car</h1>
              <span className="page-subtitle">
                List your vehicle on the marketplace
              </span>
            </div>
            <div className="topbar-right">
              <button
                className="pill"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </header>

          <form
            className="panel glass"
            style={{ padding: 16 }}
            onSubmit={onSubmit}
          >
            <div className="form-grid">
              <div className="form-row">
                <label>Name</label>
                <input
                  className="input glass big"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ferrari 348"
                  required
                />
              </div>
              <div className="form-row">
                <label>Price (USD)</label>
                <input
                  className="input glass big"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="250000"
                  required
                />
              </div>
              <div className="form-row">
                <label>Make</label>
                <div
                  className="d-grid"
                  style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}
                >
                  <select
                    className="input glass big"
                    value={form.makeId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        makeId: e.target.value,
                        makeName: "",
                        modelId: "",
                        modelName: "",
                      })
                    }
                  >
                    <option value="">Select make</option>
                    {makes.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input glass big"
                    value={form.makeName}
                    onChange={(e) =>
                      setForm({ ...form, makeName: e.target.value, makeId: "" })
                    }
                    placeholder="Or type new make"
                  />
                </div>
              </div>
              <div className="form-row">
                <label>Model</label>
                <div
                  className="d-grid"
                  style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}
                >
                  <select
                    className="input glass big"
                    value={form.modelId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        modelId: e.target.value,
                        modelName: "",
                      })
                    }
                  >
                    <option value="">Select model</option>
                    {models.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input glass big"
                    value={form.modelName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        modelName: e.target.value,
                        modelId: "",
                      })
                    }
                    placeholder="Or type new model"
                  />
                </div>
              </div>
              <div className="form-row">
                <label>Year</label>
                <select
                  className="input glass big"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  required
                >
                  <option value="">Select year</option>
                  {Array.from(
                    { length: new Date().getFullYear() - 1960 + 1 },
                    (_, i) => 1960 + i
                  )
                    .reverse()
                    .map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-row">
                <label>Era</label>
                <input
                  className="input glass big"
                  value={form.era}
                  onChange={(e) => setForm({ ...form, era: e.target.value })}
                  placeholder="1990s"
                />
              </div>
              <div className="form-row">
                <label>Origin</label>
                <input
                  className="input glass big"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  placeholder="Italian"
                />
              </div>
              <div className="form-row">
                <label>Location</label>
                <input
                  className="input glass big"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="United States"
                />
              </div>
              <div className="form-row">
                <label>Categories</label>
                <div
                  className="d-grid"
                  style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}
                >
                  <div>
                    <input
                      className="input glass big"
                      placeholder="Search categories"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                    <select
                      className="input glass big"
                      multiple
                      value={form.categoryIds}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          categoryIds: Array.from(e.target.selectedOptions).map(
                            (o) => o.value
                          ),
                        })
                      }
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      className="input glass big"
                      placeholder="Or type new category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button
                      type="button"
                      className="pill"
                      style={{ marginTop: 8 }}
                      onClick={async () => {
                        const token = getAuthToken();
                        const name = newCategory.trim();
                        if (!name) return;
                        await fetch(`${apiBase}/api/categories`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ name }),
                        });
                        setNewCategory("");
                        const list = await fetch(
                          `${apiBase}/api/categories`
                        ).then((r) => r.json());
                        setCategories(list);
                      }}
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <label>Description</label>
                <div className="input glass big" style={{ padding: 0 }}>
                  <RichTextEditor
                    value={form.descriptionHtml}
                    onChange={(val) =>
                      setForm({ ...form, descriptionHtml: val })
                    }
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
                  onChange={(e) =>
                    setMediaFiles(Array.from(e.target.files || []))
                  }
                />
                {mediaFiles.length > 0 && (
                  <div
                    className="d-grid"
                    style={{
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    {mediaFiles.map((f, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid var(--glass-300)",
                          borderRadius: 8,
                          overflow: "hidden",
                          padding: 4,
                        }}
                      >
                        <span className="muted" style={{ fontSize: 12 }}>
                          {f.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div
              className="actions"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button className="pill" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserAddCar;
