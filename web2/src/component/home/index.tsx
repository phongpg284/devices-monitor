import { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { DeviceContext } from "../../App";
import ConfigTable from "../configTable";

const Home = () => {
    const { deviceState, setDeviceState } = useContext(DeviceContext);
    const { data } = deviceState;
    console.log(data)
    const [ deviceIdChoose, setDeviceIdChoose ] = useState(0); 
    const handleDeviceChange = (e: any) => {
        setDeviceIdChoose(e.target.value)
    }

    return (
        <div>
            <Form className="d-flex flex-row justify-content-center">
                <Form.Group className="px-5">
                    <Form.Label>Chọn thiết bị</Form.Label>
                    <Form.Control
                        as="select"
                        type="name"
                        placeholder="Name"
                        className=""
                        onChange={handleDeviceChange}
                        >
                        {data && data.map((device: any, index: number) => (
                            <option value={index}>{device.name}</option>
                            ))}
                    </Form.Control>
                </Form.Group>
            </Form>
            {data[0] && <ConfigTable data={data[deviceIdChoose]} />}
        </div>
    )
}

export default Home;