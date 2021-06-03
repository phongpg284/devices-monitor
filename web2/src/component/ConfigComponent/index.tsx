import { Button } from "antd";
import { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { DeviceContext } from "../../App";
import ConfigTable from "../ConfigTable";
import { SET_FAN, SET_FOOT_CAN, SET_FOOT_TRAY, UPDATE_FEEDING_CYLINDER_STATUS } from "../ConfigTable/setEngineSchema";
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useMutation } from "@apollo/client";
import useLongPress from "./useLongPress";


const DefaultMarks = {
    "0": "0",
    "-100": {
        style: {
            color: '#f50',
        },
        label: <strong>-100</strong>,
    },
    "100": {
        style: {
            color: '#f50',
        },
        label: <strong>100</strong>,
    },
    "-75": {
        style: {
            color: '#d4d106',
        },
        label: <strong>-75</strong>,
    },
    "75": {
        style: {
            color: '#d4d106',
        },
        label: <strong>75</strong>,
    },
    "-50": {
        style: {
            color: '#02ff63',
        },
        label: <strong>-50</strong>,
    },
    "50": {
        style: {
            color: '#02ff63',
        },
        label: <strong>50</strong>,
    },
}
const Properties = [
    {
        label: "Động cơ mở khoang thức ăn",
        value: "footCan",
        marks: DefaultMarks,
        apiKey: SET_FOOT_CAN,
    },
    {
        label: "Động cơ quay khay thức ăn",
        value: "footTray",
        marks: DefaultMarks,
        apiKey: SET_FOOT_TRAY,
    },
    {
        label: "Động cơ cánh quạt chân vịt",
        value: "fan",
        marks: DefaultMarks,
        apiKey: SET_FAN,
    }
];

const ConfigComponent = () => {
    const { deviceState, setDeviceState } = useContext(DeviceContext);
    const [ updateCylinder ] = useMutation(UPDATE_FEEDING_CYLINDER_STATUS);

    const { data } = deviceState;
    const [ deviceIdChoose, setDeviceIdChoose ] = useState(0); 
    const handleDeviceChange = (e: any) => {
        setDeviceIdChoose(e.target.value)
    }

    const onLongPressUp = () => {
        console.log('longpress up is triggered');
        updateCylinder({
            variables: {
                id: (data[deviceIdChoose] as any)._id,
                status: "up"
            }
        })
    };
    
    const onLongPressDown = () => {
        console.log('longpress down is triggered');
        updateCylinder({
            variables: {
                id: (data[deviceIdChoose] as any)._id,
                status: "down"
            }
        })
    };
    const onRelease = () => {
        console.log('release up')
        updateCylinder({
            variables: {
                id: (data[deviceIdChoose] as any)._id,
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
        <div className="px-5 py-4">
            <h1>Điều chỉnh thông số động cơ thiết bị</h1> 
            <Form className="d-flex ">
                <Form.Group className="py-2 px-4">
                    <Form.Label style={{fontSize: "1.2rem"}}>Chọn thiết bị</Form.Label>
                    <Form.Control
                        as="select"
                        type="name"
                        placeholder="Name"
                        onChange={handleDeviceChange}
                    >
                        {data && data.map((device: any, index: number) => (
                            <option value={index}>{device.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Form>
            <div className="d-flex flex-row justify-content-flex-start px-4">
                <h4 className="align-self-center">Điều chỉnh khay thức ăn</h4>
                <div className="d-flex flex-column justify-content-center mx-5">
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
            </div>
            {data[0] && <ConfigTable data={data[deviceIdChoose]} properties={Properties}/>}
        </div>
    )
}

export default ConfigComponent;