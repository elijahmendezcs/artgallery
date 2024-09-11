import React, { useState, useEffect } from "react";
import "./App.css";

const MuseumCollection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchObjectIDs = async () => {
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=painting`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    return data.objectIDs ? data.objectIDs.slice(0, 100) : [];
  };

  // Fetch Image details for each Object ID
  const fetchObjectDetails = async (id) => {
    const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
    const response = await fetch(objectUrl);
    const data = await response.json();
    return data.primaryImage;
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const objectIDs = await fetchObjectIDs();
        const imagePromises = objectIDs.map((id) => fetchObjectDetails(id));
        const images = await Promise.all(imagePromises);
        setImages(images.filter((img) => img));
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div>Loading images...</div>;
  }

  return (
    <div className="gallery">
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Artwork ${index + 1}`}
          className="gallery-img"
        />
      ))}
    </div>
  );
};

export default MuseumCollection;
