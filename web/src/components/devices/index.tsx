import { useEffect } from "react";
import './devices.scss'
const fakeData = [
    {
        name: "device1",
        lat: 21.043851,
        lng: 105.838026
    },
    {
        name: "device2",
        lat: 21.043810,
        lng: 105.838026
    },
    {
        name: "device3",
        lat: 21.043820,
        lng: 105.838026
    },
    {
        name: "device4",
        lat: 21.043870,
        lng: 105.838026
    },
]

const DeviceItem = ({props}: any) => {
    return (
        <div className="device-item mx-4 border">
            <h1 style={{ fontStyle: "italic", fontSize: "1.4rem", float:"left" }}>
                {props.name}
            </h1>
            <h4 style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
                {props.lat}
            </h4>
            <h4 style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
                {props.lng}
            </h4>
        </div>
    )
}

const DeviceList = () => {
    return (
        <div className="device-list">
            <h1>Device List</h1>
            {fakeData.map(device => (
                <DeviceItem props={device}/>                
            ))}
        </div>
    )
}

export default DeviceList;