import "./map.scss";
import { OverlayTrigger, Popover} from "react-bootstrap"
import { useContext, useEffect, useState } from "react";
import { DeviceContext } from "../../App";

export interface deviceProps {
    _id: string;
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

const DeviceMarker = (props: any) => {   
    const { deviceState, setDeviceState } = useContext(DeviceContext)
    const [ isHoverEffect, setIsHoverEffect ] = useState(props.$hover); 
    const { hover, $hover, highlight, data } = props;

    useEffect(() => {
        setIsHoverEffect($hover);
        setDeviceState({
            ...deviceState,
            hoveredId: $hover ? data._id : "",
        })
    },[$hover])

    useEffect(() => {
        setIsHoverEffect(hover);
    },[hover])

    useEffect(() => {
        if(highlight)
        setIsHoverEffect(highlight);
    },[highlight])

    return (
        <>
            <OverlayTrigger 
                placement="top"
                overlay={DevicePopover(data)}
                trigger={["hover","focus"]}
            >
                <i className="bi-speedometer marker" 
                    style={{ 
                        fontSize: isHoverEffect ? "2.5em" : "2em",
                        color: isHoverEffect ? "red" : ""
                    }}
                />
            </OverlayTrigger>       
        </>
    )
}

export default DeviceMarker;