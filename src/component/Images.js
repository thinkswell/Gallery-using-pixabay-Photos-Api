import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileDownload } from "@fortawesome/free-solid-svg-icons";

function Images() {
  const key = "14211217-1220ec0a2f19970f0350089d2";
  let controller = new AbortController();

  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");

  const fetchImages = () => {
    controller.abort();
    console.log(controller);

    controller = new AbortController();
    let { signal } = controller;

    fetch(`https://pixabay.com/api/?key=${key}&q=${search}&page=${page}`, {
      signal,
    })
      .then((data) => data.json())
      .then((data) => {
        setImages(data.hits);
        console.log(data.hits);
      });

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchImages();
  }, [page, search]);

  const handleClick = (e) => {
    if ((e === -1 && page > 0) || e === 1) setPage(page + e);
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    if (search !== e.target.value) {
      setSearch(e.target.value);
    }
    console.log(search);
  };

  return (
    <React.Fragment>
      <label className="search">
        {/* Add beautifull button to search content */}
        <FontAwesomeIcon icon={faSearch} className="searchIcon" />
        <input
          type="text"
          className="searchBar"
          value={search}
          onChange={handleChange}
        />
        <div className="searchBack"></div>
      </label>

      <section className="body">
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
            <img src={image.webformatURL} alt={image.user_id} />
            <a
              href="krishnaTheGreat"
              className="download"
              download={image.webformatURL}
            >
              <FontAwesomeIcon icon={faFileDownload} className="downloadIcon" />
            </a>
          </div>
        ))}
      </section>
      <div className="control">
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
