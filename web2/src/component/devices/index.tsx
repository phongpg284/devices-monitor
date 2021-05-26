import { useContext } from "react"
import { DeviceContext } from "../../App"

export interface Device {
    _id: string;
    name: string;
    temperature: {
        data: number[],
        threshold?: number,
    }
    o2Gas: {
        data: number[],
        threshold?: number,
    }
    pH: {
        data: number[],
        threshold?: number,
    }
    foodCan: boolean,
    foodTray: boolean,
    fan: boolean,
}

const DeviceList = () => {
    const { deviceState, setDeviceState} = useContext(DeviceContext);
    return (
        <div></div>
    )
}