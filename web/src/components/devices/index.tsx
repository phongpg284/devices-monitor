import { Accordion, Button, Card, Form, FormControl } from "react-bootstrap";
import './devices.scss'
import { useContext, useEffect, useState } from "react";
import { DeviceContext } from "../../App";
import { dataProps } from "../map";
export interface deviceProps {
    _id: string,
    name: string,
    lat: number[],
    long: number[],
    temperature: number[],
    humidity: number[],
    rain: boolean[],
    dust: number[],
    coGas: number[],
    soilHumid: number[],
    cylinder: boolean,
    alert: boolean,
    lastUpdate: Date,
}

interface DeviceItemProps {
    data: dataProps,
    hover: boolean,
}

const DeviceItem = (props: DeviceItemProps) => {
    const { deviceState, setDeviceState } = useContext(DeviceContext);
    const { data, hover } = props;
    console.log(data)
    const [ isCollapse, setIsCollapse ] = useState(false);
    const handleToggle = () => {
        setIsCollapse(!isCollapse);
    }
    useEffect(() => {        
        const updateState = {
            hovereId: deviceState.hoveredId,
            data: deviceState.data.map((device: dataProps) => {
                if (device._id === data._id) 
                    return ({
                        ...device,
                        highlight: isCollapse
                    })
                return device 
            }),
        }
        setDeviceState(updateState)
    }, [isCollapse]);

    const handleClickUp = (e: any) => {
        //TODO: do sth
        e.stopPropagation();
    }

    const handleClickDown = (e: any) => {
        e.stopPropagation();
    }

    const handleAlert = (e: any) => {
        e.stopPropagation();
    }

    const handleHover = (e: any) => { 
        if(!isCollapse)
        setDeviceState({
            ...deviceState,
            hoveredId: data._id,
        });
    }
    const handleQuitHover= (e: any) => {
        if(!isCollapse)
        setDeviceState({
            ...deviceState,
            hoveredId: "",
        })
    }

    return (
        <Accordion>
            <Accordion.Toggle 
                as={Card} 
                eventKey={data._id} 
                className="device-toogle" 
                onPointerEnter={handleHover}
                onPointerLeave={handleQuitHover}
                onClick={handleToggle}
                id={data._id}
            >
                <Card className="device-item justify-content-flex-start" id={data._id} style={{backgroundColor: hover? "#979ea3": ""}}>
                    <Card.Text as="div" className="d-flex p-2 justify-content-space-between align-items-center" id={data._id}>
                        <i 
                            className="bi-wifi px-3 align-self-center"
                            style={{fontSize: "2.2vw"}}
                        />
                        <div className="my-3">
                            <h1 
                                style={{fontSize: "2.2vw"}}
                                className="mx-3 d-flex align-self-left"
                            >
                                {data.name}
                            </h1>
                            <h4 
                                style={{fontSize: "0.9vw", paddingTop:"4px"}}
                            >
                                Vị trí: {data.lat[0]}, {data.long[0]}
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
                            className="d-flex mx-4"
                            onClick={handleAlert}
                        >
                            Alert
                        </Button>
                    {isCollapse && 
                        <i className="fa fa-sort-desc ml-auto mx-2 align-self-start pin" />                
                    }
                    {!isCollapse && 
                        <i className="fa fa-sort-up ml-auto mx-2 align-self-start pin" />                
                    }
                    </Card.Text>
                </Card>
            </Accordion.Toggle>
            <Accordion.Collapse className="device-collapse" eventKey={data._id}>
                <Card className="device-collapse-content">
                    <Card.Body className="d-flex flex-row px-1">
                        <ul>
                            <li>Nhiệt độ: {data.temperature} C</li>
                            <li>Độ ẩm: {data.humidity} %</li>
                            <li>Mưa: {data.rain ? `Có`: `Không`}</li>
                            <li>Độ bụi:: {data.dust} mg/m3</li>
                        </ul>    
                        <ul className="pr-4">
                            <li>Nồng độ CO: {data.coGas} ppm</li>
                            <li>Độ ẩm đất: {data.soilHumid} %</li>
                            <li>Xilanh: {data.cylinder? `Lên`: `Xuống`}</li>
                            <li>Báo động: {data.alert ? `Có` : `Không`}</li>
                        </ul>
                    </Card.Body>

                </Card>
            </Accordion.Collapse>
        </Accordion>
    )
}

const DeviceList = () => {
    const { deviceState, setDeviceState } = useContext(DeviceContext);
    const [devicesData, setDevicesData] = useState({
        data: [],
        hoveredId: "",
    });

    useEffect(() => {
        setDevicesData(deviceState);
    },[deviceState])
    
    return (
        <div className="device-list">
            <Form className="mt-2 m-1">
                <FormControl 
                    type="input"
                    placeholder="Filter"
                    className="mr-5"
                />
            </Form>
            {devicesData.data && devicesData.data.map((device: dataProps) => (
                <DeviceItem key={device._id} data={device} hover={device._id === deviceState.hoveredId} />                
            ))}
        </div>
    )
}

export default DeviceList;