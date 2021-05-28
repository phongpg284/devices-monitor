import { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { DeviceContext } from "../../App";
import ConfigTable from "../configTable";
import { SET_FAN, SET_FOOT_CAN, SET_FOOT_TRAY } from "../configTable/setEngineSchema";

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

const Home = () => {
    const { deviceState, setDeviceState } = useContext(DeviceContext);
    const { data } = deviceState;
    const [ deviceIdChoose, setDeviceIdChoose ] = useState(0); 
    const handleDeviceChange = (e: any) => {
        setDeviceIdChoose(e.target.value)
    }

    return (
        <div className="p-3 mx-4">
            <h1 className="py-1">Điều chỉnh thông số thiết bị</h1> 
            <Form className="d-flex flex-row justify-content-flex-start">
                <Form.Group className="p-4">
                    <Form.Label style={{fontSize: "2vh"}}>Chọn thiết bị</Form.Label>
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
            {data[0] && <ConfigTable data={data[deviceIdChoose]} properties={Properties}/>}
        </div>
    )
}

export default Home;