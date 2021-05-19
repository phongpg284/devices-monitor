import { OverlayTrigger, Popover} from "react-bootstrap"

interface deviceProps {
    id: string;
    name: string;
    lat: number;
    lng: number;
    temperature?: number;
    humidity?: number;
    rain?: boolean;
    dust?: number;
    coGas?: number;
    soilHumid?: number;

}
const DevicePopover = (device: Partial<deviceProps>) => {
    return (
        <Popover id="popover-device">
            <Popover.Title>
                {device.name}
            </Popover.Title>
            <Popover.Content>
                {device.lat}
                ,
                {device.lng}
            </Popover.Content>
        </Popover>
    )
}

const DeviceMarker = ({data}: any) => {
    return (
        <>
            <OverlayTrigger 
                placement="top"
                overlay={DevicePopover(data)}
                trigger="hover"
            >
                <i className="bi-speedometer" 
                    style={{fontSize: "0.8cm", color: "red"}}>
                </i>
            </OverlayTrigger>       
        </>
    )
}

export default DeviceMarker;