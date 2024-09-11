import React from "react";
import "./App.css";

const Title = ({ text }) => {
  return (
    <div className="title-container">
      <h1>{text}</h1>
    </div>
  );
};

export default Title;
