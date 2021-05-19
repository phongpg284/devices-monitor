import "./map.scss";
import GoogleMap from "google-map-react";
import { useState } from "react";
import DeviceMarker from "./deviceMarker";
import { fakeData } from "../devices/index";
export {fakeData} from "../devices/index";
interface props {
  center: {
    lat: number;
    lng: number;
  }
  zoom: number;
}

const Map = (props: any) => {
  const [defaultStats, setDefaultStats] = useState({
    center: {
      lat: 21.04,
      lng: 105.83,
    },
    zoom: 15,
  });
  return (
    <div className="google-map">
      <GoogleMap
        bootstrapURLKeys={{ key: "AIzaSyDumeWrTMi-7xbY7uRRupj3zMsTCaro8WQ" }}
        defaultCenter = {defaultStats.center}
        defaultZoom={defaultStats.zoom}
      >
        {fakeData.map(device => (
          <DeviceMarker lat={device.lat} lng={device.lng} data={device} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
