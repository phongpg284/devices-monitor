import "./index.scss"
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Form, FormGroup } from "react-bootstrap"
import { DeviceContext } from "../../App";
import { DatePicker } from "antd";
import { Properties } from "./custom";
import Graph from "../Graph";
import ThresholdSlideItem from "../ThresholdSlide";

const Statistics = () => {
    const { deviceState } = useContext(DeviceContext);
    const { data } = deviceState;
    const [ deviceIdChoose, setDeviceIdChoose ] = useState(0); 
    const [ propertyChoose, setPropertyChoose ] = useState(Properties[0]);
    const handleDeviceChange = (e: any) => {
        setDeviceIdChoose(e.target.value)
    }

    const handlePropertyChange = (e: any) => {
        setPropertyChoose(Properties[e.target.value])
    }
    const [ startDate, setStartDate ] = useState<any>(null);
    const [ endDate, setEndDate ] = useState<any>(null);    

    useEffect(() => {
        if(data && data[0] && !startDate && !endDate) {
            setStartDate((data[deviceIdChoose][propertyChoose.value] as any).updateTime[0]?.toLocaleString());
            setEndDate((data[deviceIdChoose][propertyChoose.value] as any).updateTime[(data[deviceIdChoose][propertyChoose.value]as any).updateTime.length-1]?.toLocaleString())
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])

    const handleOnChangeDate = (value: any, dateString: any) => {
        // console.log(value,"value");
        // console.log(dateString,"string");
    }

    const onOk = (value: any) => {
        setStartDate(value[0]?._d)
        setEndDate(value[1]?._d)
    }
    const disabledDate = (current: any) => {
        return current > moment().endOf('day');
    }

    return (
        <div className="d-flex flex-row justify-content-center flex-wrap">
            <div className="p-3 graphContainer">
                <Form className="selection-view">
                    <FormGroup className="selection-form">
                        <Form.Label>Chọn thiết bị</Form.Label>
                        <Form.Control
                            as="select"
                            type="name"
                            placeholder="Name"
                            className=""
                            onChange={handleDeviceChange}
                        >
                            {data && data.map((device: any, index: number) => (
                                <option key={device._id} value={index}>{device.name}</option>
                            ))}
                        </Form.Control>
                    </FormGroup>
                    <FormGroup className="selection-form">
                        <Form.Label>Chọn thông số</Form.Label>
                        <Form.Control
                            as="select"
                            type="property"
                            placeholder="Property"
                            className=""
                            onChange={handlePropertyChange}
                        >
                            {Properties.map((property: any, index: number) => (
                                <option key={property.label} value={index}>{property.label}</option>
                            ))}
                        </Form.Control>
                    </FormGroup>
                    <FormGroup className="selection-form">
                        <Form.Label>Chọn khoảng thời gian</Form.Label>
                        <Form.Text className="justify-self-flex-start d-flex">
                            <DatePicker.RangePicker 
                                showTime
                                disabledDate={disabledDate}
                                onChange={handleOnChangeDate}
                                onOk={onOk}
                            />
                        </Form.Text>
                    </FormGroup>
                </Form>
                {data && (
                    <Graph 
                        data={data[deviceIdChoose]} 
                        startDate={startDate}
                        endDate={endDate}
                        property={propertyChoose}
                    />
                )}
            </div>
            <div className="setThresholdContainer">
                {data[deviceIdChoose] && (
                    <ThresholdSlideItem
                        data={data[deviceIdChoose]}
                        property={propertyChoose}
                    />
                )}
            </div>
        </div>
    )
}

export default Statistics;