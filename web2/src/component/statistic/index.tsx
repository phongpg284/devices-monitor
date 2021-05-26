import { useContext, useState } from "react";
import { Form, FormGroup } from "react-bootstrap"
import { DeviceContext } from "../../App";
import { Bar, Line } from "react-chartjs-2";
import { DatePicker } from "antd";
import moment from "moment";

const Property = [
    {
        label: "Nồng độ O2 trong nước (ppm)",
        value: "o2Gas"
    },
    {
        label: "Độ pH (%)",
        value: "pH"
    },
    {
        label: "Nhiệt độ nước (°C)",
        value: "temparature"
    },
    // {
    //     label: "Báo động",
    //     value: "alert"
    // },
]

interface BaseGraphProps {
    data: any;
    startDate: Date;
    endDate: Date;
    property: {
        label: string,
        value: string,
    };
}

const BaseGraph = (props: BaseGraphProps) => {
    const { data, startDate, endDate, property } = props;
    console.log(property)
    let showData = [];
    if(data)
    showData = data[property.value];
    const state = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                // lineTension: 0.5,
                label: property.label,
                backgroundColor: '#00d9ff',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: showData,
            }
        ]
    }

    
    return (
        <div>
            <Bar
                style={{margin: "100px"}}
                height={300}
                width={1000}
                data={state}
                options={{
                    plugins: {
                        title:{
                            display:true,
                            text: `Biểu đồ ${property.label}`,
                            font: {
                                size: 30
                            },
                            padding: 20
                        },
                        legend:{
                            display:true,
                            position:'bottom',
                        },               
                    },
                    // scales: {
                    //     y: {
                    //         title: "jfjfjf",
                    //         ticks: {
                    //             // Include a dollar sign in the ticks
                    //             callback: function(value: any) {
                    //                 return '$' + value;
                    //             }
                    //         }
                    //     }
                    // }
                }}
                type="bar"
            />
        </div>
    )
}

const StatisticsRoute = () => {
    const { deviceState, setDeviceState } = useContext(DeviceContext);
    const { data } = deviceState;
    const [ deviceIdChoose, setDeviceIdChoose ] = useState(0); 
    const [ propertyChoose, setPropertyChoose ] = useState(Property[0]);
    const handleDeviceChange = (e: any) => {
        setDeviceIdChoose(e.target.value)
    }

    const handlePropertyChange = (e: any) => {
        setPropertyChoose(Property[e.target.value])
    }
    const [ startDate, setStartDate ] = useState<any>(new Date());
    const [ endDate, setEndDate ] = useState<any>(new Date());    

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
        <div className="p-3">
            <Form className="d-flex flex-row justify-content-center">
                <FormGroup className="px-5">
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
                </FormGroup>
                <FormGroup className="px-5">
                    <Form.Label>Chọn thông số</Form.Label>
                    <Form.Control
                        as="select"
                        type="property"
                        placeholder="Property"
                        className=""
                        onChange={handlePropertyChange}
                    >
                        {Property.map((property: any, index: number) => (
                            <option value={index}>{property.label}</option>
                        ))}
                    </Form.Control>
                </FormGroup>
                <FormGroup className="px-5">
                    <Form.Label>Chọn thời gian</Form.Label>
                    <Form.Text>
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
                <BaseGraph 
                    data={data[deviceIdChoose]} 
                    startDate={startDate}
                    endDate={endDate}
                    property={propertyChoose}
                />
            )}
        </div>
    )
}

export default StatisticsRoute;