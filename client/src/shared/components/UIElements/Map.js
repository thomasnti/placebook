import React, { useRef, useEffect } from "react";

import './Map.css'

function Map(props) {
  const mapRef = useRef(),
    { center, zoom } = props;

  // useRef keeps a reference to the div below and mapRef tells google to render the map inside the div
  /*
    useEffect callback will run only when at least one of the dependency array values change 
    And also runs after the JSX code has been rendered (here map component return the div)
  */

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({
      position: center,
      map: map,
    });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
}

export default Map;
