import { Col, InputNumber, Row, Slider } from "antd";
import { useState } from "react";
import { Device } from "../devices";

interface SlideItemProps {
    data: Device,
    property: {
        label: string,
        value: string,
    }
}

const SlideItem = (props: SlideItemProps) => {
    const { data, property } = props;
    const formatter = (value: any) => `${value}%`
    const [ inputValue, setInputValue ] = useState((data as any)[property.value].threshold);
    const handleOnChange = (value: number) => {
        setInputValue(value)
    }
    return (
        <>
            <h4>{property.label}</h4>
            <Row>
                <Col span={12}>
                    <Slider
                        min={0}
                        max={20}
                        onChange={handleOnChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        defaultValue={(data as any)[property.value].threshold}
                        tipFormatter={formatter}
                        included
                        // tooltipVisible
                    />
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={0}
                        max={20}
                        style={{ margin: '0 16px' }}
                        // formatter={value => `${value}`}
                        value={inputValue}
                        onChange={handleOnChange}
                    />
                </Col>
            </Row>
        </>
    )
}

export default SlideItem;