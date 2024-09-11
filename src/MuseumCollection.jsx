import React, { useState, useEffect } from "react"; // Importing React and necessary hooks
import "./App.css"; // Importing CSS for the component's styling

const MuseumCollection = () => {
  // State for holding the image URLs fetched from the API
  const [images, setImages] = useState([]);

  // State to manage the loading state while fetching data
  const [loading, setLoading] = useState(true);

  // Function to fetch the Object IDs of highlighted paintings from the API
  const fetchObjectIDs = async () => {
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=painting`; // API URL for searching paintings
    const response = await fetch(searchUrl); // Fetch the data from the API
    const data = await response.json(); // Convert the response to JSON
    // Return the first 100 object IDs or an empty array if none found
    return data.objectIDs ? data.objectIDs.slice(0, 100) : [];
  };

  // Function to fetch details for a given object ID (specifically the image URL)
  const fetchObjectDetails = async (id) => {
    const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`; // API URL for the object's details
    const response = await fetch(objectUrl); // Fetch the data for the specific object
    const data = await response.json(); // Convert the response to JSON
    return data.primaryImage; // Return the image URL (primaryImage) from the object data
  };

  // useEffect to fetch images when the component first renders
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true); // Set loading to true while fetching data
      try {
        const objectIDs = await fetchObjectIDs(); // Fetch the list of object IDs
        const imagePromises = objectIDs.map((id) => fetchObjectDetails(id)); // Fetch image details for each object ID
        const images = await Promise.all(imagePromises); // Wait for all the image fetch promises to resolve
        setImages(images.filter((img) => img)); // Filter out any images that don't have a valid URL
      } catch (error) {
        // Log any errors that occur during the fetch process
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false); // Set loading to false after the fetch process completes
      }
    };

    fetchImages(); // Trigger the image fetching process
  }, []); // Empty dependency array ensures this runs only on the initial render

  // Display a loading message while the images are being fetched
  if (loading) {
    return <div>Loading images...</div>;
  }

  // Render the gallery of images once they are loaded
  return (
    <div className="gallery">
      {images.map((imageUrl, index) => (
        <img
          key={index} // Unique key for each image in the list
          src={imageUrl} // Image source URL
          alt={`Artwork ${index + 1}`} // Alt text for accessibility, indicating artwork number
          className="gallery-img" // CSS class for styling the image
        />
      ))}
    </div>
  );
};

export default MuseumCollection;
