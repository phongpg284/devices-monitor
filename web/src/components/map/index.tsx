import GoogleMap from "google-map-react";
import { useState } from "react";
import DeviceMarker from "./deviceMarker";

interface props {
  center: {
    lat: number;
    lng: number;
  }
  zoom: number;
}

const Map = () => {
  const [defaultStats, setDefaultStats] = useState({
    center: {
      lat: 21.04,
      lng: 105.83,
    },
    zoom: 15,
  });
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMap
        bootstrapURLKeys={{ key: "AIzaSyDumeWrTMi-7xbY7uRRupj3zMsTCaro8WQ" }}
        defaultCenter = {defaultStats.center}
        defaultZoom={defaultStats.zoom}
      >
        <DeviceMarker lat={21.043851} lng={105.838026} text="OOOOOOOOOOOO" />
      </GoogleMap>
    </div>
  );
};

export default Map;
