import React from "react";
import "./Star.css"

const Star = ({rating, fontSize}) => {
  return (
    <div
      className="Stars"
      style={{"--rating": rating, fontSize: fontSize}}
      aria-label="Rating of this product is 2.3 out of 5."
    ></div>
  );
};

export default Star;
