import "./map.scss";
import GoogleMap from "google-map-react";
import DeviceMarker, { deviceProps } from "./deviceMarker";
export {fakeData} from "../devices/index";

export interface dataProps extends deviceProps {
  highlight: boolean;
}

interface MapProps {
  defaultCenter: {
    lat: number;
    lng: number;
  }
  defaultZoom: number;
  apiKey: string;
  data: {
    data: dataProps[],
    hoveredId: string;
  };
}

const Map = (props: MapProps) => {
  return (
    <div className="google-map">
      <GoogleMap
        bootstrapURLKeys={{ key: props.apiKey }}
        defaultCenter = {props.defaultCenter}
        defaultZoom={props.defaultZoom}
        hoverDistance={30}
      >
        {props.data.data && props.data.data.map((device: dataProps) => (
          <DeviceMarker 
            key={device._id}
            lat={device.lat} 
            lng={device.lng} 
            data={device} 
            highlight={device.highlight} 
            hover={props.data.hoveredId === device._id}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
