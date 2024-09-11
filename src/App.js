import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import {
  Captions,
  Download,
  Fullscreen,
  Thumbnails,
  Zoom,
} from "yet-another-react-lightbox/plugins";
import Title from "./Title";

function App() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  // Fetch Object IDs from the API
  const fetchObjectIDs = async () => {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=painting`
    );
    const data = await response.json();
    return data.objectIDs ? data.objectIDs.slice(0, 10) : [];
  };

  const fetchObjectDetails = async (id) => {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
    );
    const data = await response.json();
    return {
      src: data.primaryImage,
      title: data.title,
      description: data.artistDisplayName,
    };
  };

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const objectIDs = await fetchObjectIDs();
        const slidePromises = objectIDs.map((id) => fetchObjectDetails(id));
        const fetchedSlides = await Promise.all(slidePromises);
        const validSlides = fetchedSlides.filter((slide) => slide.src);
        setSlides(validSlides);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <>
      <Title text="Elijah's Art Museum" />

      <div
        className="gallery"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          padding: "20px",
        }}
      >
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.src}
            alt={slide.title}
            className="thumbnail"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
            }}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      {/* Lightbox component */}
      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Captions, Download, Fullscreen, Zoom, Thumbnails]}
        captions={{
          showToggle: true,
          descriptionTextAlign: "end",
        }}
      />
    </>
  );
}

export default App;
