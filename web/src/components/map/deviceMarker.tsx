import "./map.scss";
import { Overlay, OverlayTrigger, Popover} from "react-bootstrap"
import { useContext, useEffect, useRef, useState } from "react";
import { DeviceContext } from "../../App";
// import 'font-awesome/css/font-awesome.min.css'

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
    const [ isHoverEffect, setIsHoverEffect ] = useState(false); 
    const { hover, $hover, highlight, data } = props;
    const [ show, setShow] = useState(false);
    // const [ target, setTarget] = useState(null);
    
    const ref = useRef(null);

    const handleClick = (event: any) => {
        setShow(!show);
        // setTarget(event.target);
    }

    useEffect(() => {
        setIsHoverEffect($hover);
        setDeviceState({
            ...deviceState,
            hoveredId: $hover ? data._id : "",
        })
    },[$hover])

    useEffect(() => {
        setIsHoverEffect(hover);
    },[hover,highlight])

    useEffect(() => {
        if(highlight)
        setIsHoverEffect(highlight);
    },[highlight])

    return (
        <div >
            {/* <OverlayTrigger 
                placement="top"
                overlay={DevicePopover(data)}
                trigger={["hover","focus"]}
                
            > */}
                <i 
                    className="fa fa-map-marker marker" 
                    style={{ 
                        fontSize: "2.5em",
                        transform: (isHoverEffect||show)? "scale(1.5,1.5) translate(0,-7px)" : "none"
                    }}
                    ref={ref}
                    onClick={handleClick}
                />
            {/* </OverlayTrigger>   */}
            <Overlay
                show={show||isHoverEffect}
                target={ref.current}
                placement="top"
                container={ref.current}
                containerPadding={20}
            >
                <Popover id="popover-device">
                    <Popover.Title style={{color: "black", fontWeight:"bold"}}>
                        {data.name}
                    </Popover.Title>
                    <Popover.Content>
                        {data.lat},{data.lng}
                    </Popover.Content>
                </Popover>
            </Overlay>     
        </div>
    )
}

export default DeviceMarker;