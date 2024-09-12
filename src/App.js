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
  // State for holding the slide data (images and metadata)
  const [slides, setSlides] = useState([]);

  // State for holding the index of the currently selected slide (or -1 if none)
  const [index, setIndex] = useState(-1);

  // State to manage the loading state while fetching data
  const [loading, setLoading] = useState(true);

  // Function to fetch object IDs from the API (MET Museum collection) for paintings that are highlighted
  const fetchObjectIDs = async () => {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=painting`
    );
    const data = await response.json();
    // Return the first 10 object IDs, or an empty array if none found
    return data.objectIDs ? data.objectIDs.slice(0, 10) : [];
  };

  // Function to fetch details of each painting by its ID
  const fetchObjectDetails = async (id) => {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
    );
    const data = await response.json();
    // Return an object containing the image, title, and artist name (description)
    return {
      src: data.primaryImage,
      title: data.title,
      description: data.artistDisplayName,
    };
  };

  // useEffect to load the images when the component is first rendered
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true); // Set loading to true while fetching data
      try {
        const objectIDs = await fetchObjectIDs(); // Fetch the list of object IDs
        const slidePromises = objectIDs.map((id) => fetchObjectDetails(id)); // Fetch details for each object ID
        const fetchedSlides = await Promise.all(slidePromises); // Wait for all the promises to resolve
        // Filter out slides that have no image and set the valid slides to the state
        const validSlides = fetchedSlides.filter((slide) => slide.src);
        setSlides(validSlides);
      } catch (error) {
        // Log any errors that occur during the fetch process
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false); // Set loading to false after the process is complete
      }
    };

    loadImages(); // Trigger the image loading process
  }, []); // Empty dependency array ensures this runs only on the initial render

  return (
    <>
      {/* Title component, passing in t3ext for the title */}
      <Title text="Elijah's Art Museum" />

      {/* Gallery grid to display thumbnail images */}
      <div
        className="gallery"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          padding: "20px",
        }}
      >
        {/* Loop over each slide and render a thumbnail image */}
        {slides.map((slide, i) => (
          <img
            key={i} // Unique key for each image in the list
            src={slide.src} // Image source URL
            alt={slide.title} // Alt text as the title of the artwork
            className="thumbnail" // Assigning a CSS class to the image
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
            }}
            onClick={() => setIndex(i)} // When image is clicked, set the index of the Lightbox to the clicked image
          />
        ))}
      </div>

      {/* Lightbox component to display images in full screen with various plugins */}
      <Lightbox
        slides={slides} // Pass in the slides (images and metadata)
        open={index >= 0} // Open the Lightbox if an image is clicked (index is not -1)
        index={index} // Pass the current index of the selected image
        close={() => setIndex(-1)} // Close the Lightbox when the user clicks outside or presses the close button
        plugins={[Captions, Download, Fullscreen, Zoom, Thumbnails]} // Enabling the plugins for captions, downloading, fullscreen, zoom, and thumbnails
        captions={{
          showToggle: true, // Show a toggle for captions
          descriptionTextAlign: "end", // Align the description text to the right
        }}
      />
    </>
  );
}

export default App;
