import { Accordion, Card, Form, FormControl } from "react-bootstrap";
import { Button, Modal } from "antd"
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import './devices.scss'
import { useContext, useEffect, useState } from "react";
import { DeviceContext } from "../../App";
import { dataProps } from "../Map";
import { useMutation } from "@apollo/client";
import { SEND_ALERT, UPDATE_BORDER_CYLINDER_STATUS } from "./commandSchema";
import useLongPress from "./useLongPress";
import { latLng2Tile } from "google-map-react";

export interface environmentUnit {
    data: any[],
    threshold: number,
    updateTime: Date[]
}
export interface Device {
    _id: string,
    name: string,
    lat: number[],
    long: number[],
    temperature: environmentUnit,
    humidity: environmentUnit,
    rain: {
        data: boolean[],
        updateTime: Date[],
    },
    dust: environmentUnit,
    coGas: environmentUnit,
    soilHumid: environmentUnit,
    cylinder: boolean,
    alert: boolean,
    locationUpdateTime: Date[],
}

interface DeviceItemProps {
    data: dataProps,
    hover: boolean,
}

const DeviceItem:React.FC<DeviceItemProps> = (props: DeviceItemProps) => {
    const { deviceState, setDeviceState } = useContext(DeviceContext);
    const [ updateCylinder ] = useMutation(UPDATE_BORDER_CYLINDER_STATUS);
    const [ sendAlert ] = useMutation(SEND_ALERT);

    const { data, hover } = props;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCollapse]);

    const { confirm } = Modal;
    const showAlertConfirm = () => {
        confirm({
            title: 'Xác nhận báo động thiết bị',
            content: `Báo động thiết bị ${data.name}`,
            onOk() {
                sendAlert({
                    variables: {
                        id: data._id
                    }
                })
            },
            onCancel() {
            },
        });
        
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

    const onLongPressUp = () => {
        console.log('longpress up is triggered');
        updateCylinder({
            variables: {
                id: data._id,
                status: "up"
            }
        })
    };
    
    const onLongPressDown = () => {
        console.log('longpress down is triggered');
        updateCylinder({
            variables: {
                id: data._id,
                status: "down"
            }
        })
    };
    const onRelease = () => {
        console.log('release up')
        updateCylinder({
            variables: {
                id: data._id,
                status: "stop"
            }
        })
        
    }
    
    const onClickUp = () => {
        console.log('click up is triggered')
    }
    const onClickDown = () => {
        console.log('click down is triggered')
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 200,
    };

    const longPressUpEvent = useLongPress(onLongPressUp, onClickUp, onRelease, defaultOptions);
    const longPressDownEvent = useLongPress(onLongPressDown, onClickDown, onRelease, defaultOptions);

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
                            className="bi-wifi px-3 align-self-center d-flex"
                            style={{fontSize: "2.8rem"}}
                        />
                        <div className="my-2">
                            <h1 
                                style={{fontSize: "2.2rem"}}
                                className="mx-3"
                            >
                                {data.name}
                            </h1>
                            {data.lat && data.long &&<h4 
                                style={{fontSize: "1.1rem"}}
                            >
                                Vị trí: {data.lat[data.lat.length-1]}, {data.long[data.long.length-1]}
                            </h4> }
                            {data.locationUpdateTime && <i 
                                style={{fontSize: "0.8rem", paddingTop:"4px"}}
                            >
                                Cập nhật vị trí lần cuối: {new Date(data.locationUpdateTime[data.locationUpdateTime.length-1]).toLocaleString()}
                            </i>}
                        </div>  
                        <div className="d-flex flex-column justify-content-center ml-auto mx-2">
                            <Button 
                                {...longPressUpEvent}
                                icon={<CaretUpOutlined />}
                                size="large"
                            />
                            <Button 
                                {...longPressDownEvent}
                                icon={<CaretDownOutlined />}
                                size="large"
                            />
                        </div>
                        <Button
                            style={{ marginBottom: '16px' }}
                            type="primary"
                            danger
                            disabled={data.alert}
                            onClick={showAlertConfirm}
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
                            <li>Nhiệt độ: {data.temperature.data[data.temperature.data.length-1]} °C</li>
                            <i>(Cập nhật lần cuối: {new Date(data.temperature.updateTime[data.temperature.updateTime.length-1]).toLocaleString()})</i> 
                            <li>Độ ẩm: {data.humidity.data[data.humidity.data.length-1]} %</li>
                            <i>(Cập nhật lần cuối: {new Date(data.humidity.updateTime[data.humidity.updateTime.length-1]).toLocaleString()})</i> 
                            <li>Mưa: {data.rain.data[data.rain.data.length-1] ? `Có`: `Không`}</li>
                            <i>(Cập nhật lần cuối: {new Date(data.rain.updateTime[data.rain.updateTime.length-1]).toLocaleString()})</i> 
                        </ul>    
                        <ul className="pr-4">
                            <li>Độ bụi: {data.dust.data[data.dust.data.length-1]} mg/m3</li>
                            <i>(Cập nhật lần cuối: {new Date(data.dust.updateTime[data.dust.updateTime.length-1]).toLocaleString()})</i> 
                            <li>Nồng độ CO: {data.coGas.data[data.coGas.data.length-1]} ppm</li>
                            <i>(Cập nhật lần cuối: {new Date(data.coGas.updateTime[data.coGas.updateTime.length-1]).toLocaleString()})</i> 
                            <li>Độ ẩm đất: {data.soilHumid.data[data.soilHumid.data.length-1]} %</li>
                            <i>(Cập nhật lần cuối: {new Date(data.soilHumid.updateTime[data.soilHumid.updateTime.length-1]).toLocaleString()})</i> 
                        </ul>
                    </Card.Body>

                </Card>
            </Accordion.Collapse>
        </Accordion>
    )
}

const DeviceList = () => {
    const { deviceState } = useContext(DeviceContext);
    const [devicesData, setDevicesData] = useState({
        data: [],
        hoveredId: "",
    });

    useEffect(() => {
        setDevicesData(deviceState);
    },[deviceState])
    
    return (
        <div className="device-list">
            <Form className="pt-2 m-1">
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