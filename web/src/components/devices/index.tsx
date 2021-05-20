import { useQuery } from "@apollo/client";
import { Accordion, Button, Card, Form, FormControl } from "react-bootstrap";
import { GET_DEVICES } from "./schema";
import './devices.scss'
import { useEffect, useState } from "react";
export const fakeData = [
    {
        _id: 1,
        name: "device1",
        lat: 21.043851,
        lng: 105.837026,
        temperature: 1,
        humidity: 1,
        rain: true,
        dust: 1,
        coGas: 1,
        soilHumid: 1,
    },
    {
        _id: 2,
        name: "device2",
        lat: 21.043810,
        lng: 105.839026,
        temperature: 2,
        humidity: 2,
        rain: true,
        dust: 2,
        coGas: 2,
        soilHumid: 2,
    },
    {
        _id: 3,
        name: "device3",
        lat: 21.043820,
        lng: 105.838026,
        temperature: 3,
        humidity: 3,
        rain: true,
        dust: 3,
        coGas: 3,
        soilHumid: 3,
    },
    {
        _id: 4,
        name: "device4",
        lat: 21.043170,
        lng: 105.838026,
        temperature: 4,
        humidity: 4,
        rain: false,
        dust: 4,
        coGas: 4,
        soilHumid: 4,
    },
]

interface deviceProps {
    _id: number,
    name: string,
    lat: number,
    lng: number,
    temperature?: number,
    humidity?: number,
    rain?: boolean,
    dust?: number,
    coGas?: number,
    soilHumid?: number,
}

const DeviceItem = ({props}: any) => {
    const handleClickUp = () => {
        //TODO: do sth
    }

    const handleClickDown = () => {
        
    }

    const handleAlert = (event: any) => {
        
    }
    return (
        <Accordion>
            <Accordion.Toggle as={Card} eventKey={props._id} className="device-toogle">
                <Card className="device-item px-2">
                    <Card.Text className="d-flex justify-content-space-between align-items-center">
                        <i 
                            className="bi-wifi px-3"
                            style={{fontSize: "2rem"}}
                        />
                        <div>
                            <h1 
                                style={{fontSize: "1.8rem"}}
                                className="mx-3 d-flex align-self-left"
                            >
                                {props.name}
                            </h1>
                            <h4 
                                style={{fontSize: "1rem", paddingTop:"4px"}}
                            >
                                Vị trí: {props.lat}, {props.lng}
                            </h4>
                        </div>  
                        <div className="d-flex flex-column justify-content-center ml-auto mx-2">
                            <i 
                                className="bi-caret-up-square"
                                style={{fontSize: "2rem"}} 
                                onClick={handleClickUp}
                            />            
                            <i 
                                className="bi-caret-down-square" 
                                style={{fontSize: "2rem"}} 
                                onClick={handleClickDown}
                            />
                        </div>
                        <Button 
                            variant="danger"
                            className="d-flex mx-1"
                            onClick={handleAlert}
                        >
                            Alert
                        </Button>
                    </Card.Text>                
                </Card>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props._id}>
                <Card.Body className="d-flex flex-row px-1">
                    <ul>
                        <li>Nhiệt độ: {props.temperature} C</li>
                        <li>Độ ẩm: {props.humidity} %</li>
                        <li>Mưa: {props.rain ? `Có`: `Không`}</li>
                    </ul>    
                    <ul className="pr-4">
                        <li>Độ bụi:: {props.dust} mg/m3</li>
                        <li>Nồng đọ CO: {props.coGas} ppm</li>
                        <li>Độ ẩm đất: {props.soilHumid} %</li>
                    </ul>
                </Card.Body>
            </Accordion.Collapse>
        </Accordion>
    )
}

const DeviceList = () => {
    const { data } = useQuery(GET_DEVICES,{
        fetchPolicy:"network-only"
    }) ;
    const [devicesData, setDevicesData] = useState([]);
    useEffect(() => {
        if(data) {
        setDevicesData(data.getDevices);
        console.log(data.getDevices);
    }},[data])
    return (
        <div className="device-list">
            <Form className="mt-2 m-1">
                <FormControl 
                    type="input"
                    placeholder="Filter"
                    className="mr-5"
                />
            </Form>
            {devicesData && devicesData.map((device: deviceProps) => (
                <DeviceItem key={device._id} props={device}/>                
            ))}
        </div>
    )
}

export default DeviceList;