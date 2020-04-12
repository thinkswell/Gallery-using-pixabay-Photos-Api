import React, { useEffect, useState } from "react";

function Images() {
  const key = "14211217-1220ec0a2f19970f0350089d2";

  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const response = await fetch(
      `https://pixabay.com/api/?key=${key}&q=cute&page=${page}`
    );
    const data = await response.json();
    setImages(data.hits);
    console.log(data.hits);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleClick = (e) => {
    if ((e === -1 && page > 0) || e === 1) setPage(page + e);
  };

  return (
    <React.Fragment>
      <section className="body">
        {images.map((image) => (
          <div
            key={image.id}
            className={`${
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
          </div>
        ))}
      </section>
      <div className="control">
        <button className="btn" onClick={() => handleClick(-1)}>
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
