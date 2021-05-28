import "./map.scss";
import { Overlay, Popover} from "react-bootstrap"
import { useContext, useEffect, useRef, useState } from "react";
import { DeviceContext } from "../../App";

const DeviceMarker = (props: any) => {   
    const { deviceState, setDeviceState } = useContext(DeviceContext)
    const [ isHoverEffect, setIsHoverEffect ] = useState(false); 
    const { hover, $hover, highlight, data } = props;
    const [ show, setShow] = useState(false);
    const ref = useRef(null);

    const handleClick = (event: any) => {
        setShow(!show);
    }

    useEffect(() => {
        setIsHoverEffect($hover);
        setDeviceState({
            ...deviceState,
            hoveredId: $hover ? data._id : "",
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <i 
                className={`fa fa-map-marker marker-${data.alert? "blink":"none"}`} 
                style={{ 
                    fontSize: "2.5em",
                    transform: (isHoverEffect||show)? "scale(1.5,1.5) translate(0,-7px)" : "none"
                }}
                ref={ref}
                onClick={handleClick}
            />
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
                        {data.lat[0]},{data.long[0]}
                    </Popover.Content>
                </Popover>
            </Overlay>     
        </div>
    )
}

export default DeviceMarker;