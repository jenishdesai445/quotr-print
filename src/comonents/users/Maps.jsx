import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

import { AiOutlineClose } from "react-icons/ai";
import "../style.css";

const MapContainer = ({ google, data, lat, lng }) => {
  const [position, setPosition] = useState({ lat: lat, lng: lng });
  const mapRef = useRef(null);

  const handleMarkerDragEnd = (coord, map, event) => {
    const newPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setPosition(newPosition);
    centerMap(newPosition);
  };

  const centerMap = (position) => {
    if (mapRef.current) {
      const map = mapRef.current.map;
      map.setZoom(14); // Set the desired zoom level
      map.setCenter(position); // Center the map on the marker position
    }
  };

  useEffect(() => {
    setPosition({ lat: lat, lng: lng });
  }, [lat, lng]);

  useEffect(() => {
    data(position);
    centerMap(position);
  }, [position]);
  return (
    <div>
      <div style={{ width: "100%", height: "65vh", position: "relative" }}>
        <Map google={google} initialCenter={position} zoom={5} ref={mapRef}>
          <Marker
            position={position}
            draggable={true}
            onDragend={handleMarkerDragEnd}
          />
        </Map>
      </div>
      {/* <div class='col-md-12 col-12 m-auto text-start '> 
            <label htmlFor="" class='text-white m-0 px-3 mt-3 '>Latitude</label>
            <input type="text"  id="contactInputForm" class="form-control p-2 px-4 m-0" placeholder="Latitude" value={position.lat} />
            <label htmlFor="" class='text-white m-0 px-3  mt-3'>Longitude</label> 
            <input type="text"  id="contactInputForm" class="form-control p-2 px-4 m-0" placeholder="Longitude " value={position.lng} />
        </div> */}
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyAvzHK00m3gO1-hBanLOTHn9wNE_BUgdMw",
})(MapContainer);
