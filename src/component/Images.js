import React, { useEffect, useState } from "react";

function Images() {
  const key = "14211217-1220ec0a2f19970f0350089d2";

  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const response = await fetch(
      `https://pixabay.com/api/?key=${key}&q=beautiful&page=${page}`
    );
    const data = await response.json();
    setImages(data.hits);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleClick = e => {
    if ((e === -1 && page > 0) || e === 1) setPage(page + e);
  };

  return (
    <section className="body">
      <ul className="imageList">
        {images.map(image => (
          <li key={image.id}>
            <img src={image.webformatURL} alt={image.user_id} />
          </li>
        ))}
      </ul>

      <div className="control">
        <div className="left" onClick={() => handleClick(-1)}>
          Prev
        </div>
        <div className="right" onClick={() => handleClick(1)}>
          Next
        </div>
      </div>
    </section>
  );
}

export default Images;
