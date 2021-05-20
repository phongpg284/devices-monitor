import "./map.scss";
import GoogleMap from "google-map-react";
import DeviceMarker from "./deviceMarker";
export {fakeData} from "../devices/index";
interface MapProps {
  defaultCenter: {
    lat: number;
    lng: number;
  }
  defaultZoom: number;

  apiKey: string;
  data: any;
}

const Map = (props: MapProps) => {
  return (
    <div className="google-map">
      <GoogleMap
        bootstrapURLKeys={{ key: props.apiKey }}
        defaultCenter = {props.defaultCenter}
        defaultZoom={props.defaultZoom}
      >
        {props.data.map((device: any) => (
          <DeviceMarker lat={device.lat} lng={device.lng} data={device} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
