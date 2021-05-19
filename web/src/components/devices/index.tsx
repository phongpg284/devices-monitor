import { Card, Form, FormControl } from "react-bootstrap";
import './devices.scss'
export const fakeData = [
    {
        id: 1,
        name: "device1",
        lat: 21.043851,
        lng: 105.838026
    },
    {
        id: 2,
        name: "device2",
        lat: 21.043810,
        lng: 105.838026
    },
    {
        id: 3,
        name: "device3",
        lat: 21.043820,
        lng: 105.838026
    },
    {
        id: 4,
        name: "device4",
        lat: 21.043870,
        lng: 105.838026
    },
]

const DeviceItem = ({props}: any) => {
    const handleClick = (event: any) => {
        //TODO: showinfo?
    }
    return (
        <>
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
        </>
    )
}

const DeviceList = () => {
    return (
        <div className="device-list">
            <Form>
                <FormControl 
                    type="input"
                    placeholder="filter"
                    className="mr-5 mb-3"
                />
            </Form>
            {fakeData.map(device => (
                <DeviceItem key={device.id} props={device}/>                
            ))}
        </div>
    )
}

export default DeviceList;