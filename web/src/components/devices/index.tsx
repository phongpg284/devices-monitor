import { Accordion, Card, Form, FormControl } from "react-bootstrap";
import './devices.scss'
export const fakeData = [
    {
        id: 1,
        name: "device1",
        lat: 21.043851,
        lng: 105.838026,
        temperature: 1,
        humidity: 1,
        rain: true,
        dust: 1,
        coGas: 1,
        soilHumid: 1,
    },
    {
        id: 2,
        name: "device2",
        lat: 21.043810,
        lng: 105.838026,
        temperature: 2,
        humidity: 2,
        rain: true,
        dust: 2,
        coGas: 2,
        soilHumid: 2,
    },
    {
        id: 3,
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
        id: 4,
        name: "device4",
        lat: 21.043870,
        lng: 105.838026,
        temperature: 4,
        humidity: 4,
        rain: false,
        dust: 4,
        coGas: 4,
        soilHumid: 4,
    },
]

const DeviceItem = ({props}: any) => {
    const handleClick = (event: any) => {
        //TODO: showinfo?
    }
    return (
        <Accordion>
            <Accordion.Toggle as={Card} eventKey={props.id} className="device-toogle">
                <Card onClick={handleClick}>
                    <Card.Text className="device-item">
                        <i className="bi-wifi float-left mr-1"></i>
                        <h1 style={{fontSize: "1.4rem", float:"left" }}>
                            {props.name}
                        </h1>
                        <h4 style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
                            {props.lat}
                        </h4>
                        <h4 style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
                            {props.lng}
                        </h4>  
                    </Card.Text>                
                </Card>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props.id}>
                <Card.Body className="d-flex flex-row">
                    <ul>
                        <li>Nhiệt độ: {props.temperature} C</li>
                        <li>Độ ẩm: {props.humidity} %</li>
                        <li>Mưa: {props.rain ? `Có`: `Không`}</li>
                    </ul>    
                    <ul>
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
    return (
        <div className="device-list">
            <Form className="mt-2 mx-1">
                <FormControl 
                    type="input"
                    placeholder="Filter"
                    className="mr-5"
                />
            </Form>
            {fakeData.map(device => (
                <DeviceItem key={device.id} props={device}/>                
            ))}
        </div>
    )
}

export default DeviceList;