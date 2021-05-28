import { Button, Col, InputNumber, Row, Slider, Modal } from "antd";
import { useEffect, useState } from "react";
import { Device } from "../devices";
import { Property } from "../configTable/index";
import { useMutation } from "@apollo/client";

interface SlideItemProps {
    data: Device,
    property: Property,
}

const SlideItem = (props: SlideItemProps) => {
    const { data, property } = props;
    const [ inputValue, setInputValue ] = useState((data as any)[property.value]);
    const formatter = (value: any) => `${value}%`
    const [ isDisableButton, setIsDisableButton ] = useState(true);
    const [ updateDevice, { data: updateData }] = useMutation(property.apiKey)
    
    useEffect(() => {
        setInputValue((data as any)[property.value])
    },[data])

    useEffect(() => {
        setIsDisableButton(inputValue === (data as any)[property.value]);
    },[inputValue]);

    const handleOnChange = (value: number) => {
        setInputValue(value)
    }

    const { confirm } = Modal;
    const showConfirm = () => {
        confirm({
            title: 'Xác nhận điều chỉnh thông số',
            content: `${property.label} thay đổi chỉ số từ ${(data as any)[property.value]} thành ${inputValue}`,
            onOk() {
                setIsDisableButton(true);
                updateDevice({
                    variables: {
                        value: inputValue,
                        id: data._id,
                    }
                });
            },
            onCancel() {
            },
        });
        
    }

    const handleClickReset = () => {
        setIsDisableButton(false);
        setInputValue((data as any)[property.value]);
    }

    return (
        <div className="p-3 m-2">
            <h4 className="d-flex justify-content-flex-start">{property.label}</h4>
            <Row>
                <Col span={7}>
                    <Slider
                        min={-100}
                        max={100}
                        onChange={handleOnChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        marks={property.marks}
                        defaultValue={(data as any)[property.value]}
                        tipFormatter={formatter}
                    />
                </Col>
                <Col span={3}>
                    <InputNumber
                        min={-100}
                        max={100}
                        style={{ margin: '0 16px' }}
                        formatter={value => `${value}`}
                        value={inputValue}
                        onChange={handleOnChange}
                    />
                </Col>
                <Col span={1}>
                    <Button
                        type="primary"
                        onClick={showConfirm}
                        disabled={isDisableButton}
                    >
                        Confirm
                    </Button>
                </Col>
                <Col span={3}>
                    <Button
                        type="primary"
                        danger
                        onClick={handleClickReset}
                    >
                        Reset
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default SlideItem;