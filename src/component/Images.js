// Images.js (replace your current file with this)
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFileDownload,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

function Images() {
  const key = "14211217-1220ec0a2f19970f0350089d2";

  // useRef for controller so it persists between renders
  const controllerRef = useRef(null);

  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("gallery_theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) { /* ignore */ }
    return "dark";
  });

  // Apply theme and persist
  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", theme === "light");
    try { localStorage.setItem("gallery_theme", theme); } catch (e) { /* ignore */ }
  }, [theme]);

  const fetchImages = () => {
    // abort previous request safely
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch (e) { /**/ }
    }
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    fetch(`https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(search)}&page=${page}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        setImages(Array.isArray(data.hits) ? data.hits : []);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("fetchImages error:", err);
        setImages([]);
      });

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchImages();
    // cleanup on unmount
    return () => {
      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch (e) { /**/ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleClick = (delta) => {
    if (delta === -1 && page === 1) return;
    setPage((p) => p + delta);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // update search and reset to page 1
    setSearch(val);
    setPage(1);
  };

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      console.log("Theme toggled:", next);
      return next;
    });
  };

  return (
    <React.Fragment>
      {/* Search */}
      <label className="search" style={{ zIndex: 50 }}>
        <FontAwesomeIcon icon={faSearch} className="searchIcon" />
        <input
          type="text"
          className="searchBar"
          value={search}
          onChange={handleChange}
          placeholder="Search images..."
        />
        <div className="searchBack"></div>
      </label>

      {/* Theme toggle button (keeps UI unchanged, positioned top-right) */}
      <div
        style={{
          position: "fixed",
          top: "5rem",
          right: "5rem",
          zIndex: 99999,             // very high so it's above other fixed elements
          pointerEvents: "auto",     // ensure it can receive clicks
        }}
      >
        <button
          type="button"              // important to avoid any form/label interactions
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to night mode" : "Switch to day mode"}
          title={theme === "light" ? "Night mode" : "Day mode"}
          style={{
            fontSize: "1.7rem",
            background: theme === "light" ? "rgba(255,255,255,0.92)" : "rgba(10,10,10,1)",
            color: theme === "light" ? "#000" : "#fff",
            border: "none",
            padding: "0.5rem 0.9rem",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "3.8rem",
            height: "3.8rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
        </button>
      </div>

      {/* Image grid */}
      <section className="body" style={{ zIndex: 1 }}>
        {images.map((image) => (
          <div
            key={image.id}
            className={`contains ${
              image.id % 8 === 0
                ? "hori"
                : image.id % 6 === 0
                ? "vert"
                : image.id % 4 === 0
                ? "big"
                : ""
            }`}
          >
            <img src={image.webformatURL} alt={image.user_id || `img-${image.id}`} />
            <a href="krishnaTheGreat" className="download" download={image.webformatURL}>
              <FontAwesomeIcon icon={faFileDownload} className="downloadIcon" />
            </a>
          </div>
        ))}
      </section>

      {/* Pagination control */}
      <div className="control" style={{ zIndex: 20 }}>
        <button
          className="btn"
          onClick={() => handleClick(-1)}
          style={{ visibility: `${page === 1 ? "hidden" : "visible"}` }}
        >
          {`Page ${page > 1 ? page - 1 : "N/A"}`}
        </button>
        <div className="mid"> - {`Page ${page}`} - </div>
        <button className="btn" onClick={() => handleClick(1)}>
          {`Page ${page + 1}`}
        </button>
      </div>
    </React.Fragment>
  );
}

export default Images;
