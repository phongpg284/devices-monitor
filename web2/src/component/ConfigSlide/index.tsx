import { Button, Col, InputNumber, Row, Slider, Modal } from "antd";
import { useEffect, useState } from "react";
import { Device } from "../Devices";
import { EngineProperty } from "../ConfigTable/index";
import { useMutation } from "@apollo/client";
import { useMediaQuery } from "react-responsive";

interface SlideItemProps {
    data: Device,
    property: EngineProperty,
}

const ConfigSlideItem = (props: SlideItemProps) => {
    const { data, property } = props;
    const [ inputValue, setInputValue ] = useState((data as any)[property.value]);
    const formatter = (value: any) => `${value}%`
    const [ isDisableButton, setIsDisableButton ] = useState(true);
    const [ updateDevice, { data: updateData }] = useMutation(property.apiKey)
    
    const isTabletOrMobile = useMediaQuery({query: "(max-width: 1224px)"});

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
        <div>
            {!isTabletOrMobile && (
                <div className="p-3 m-2">
                    <h4 className="d-flex justify-self-flex-start">{property.label}</h4>
                        <div className="d-flex justify-content-flex-start align-items-center">
                            <div style={{width: "40vw"}}>
                            <Slider
                                min={-100}
                                max={100}
                                onChange={handleOnChange}
                                value={typeof inputValue === 'number' ? inputValue : 0}
                                marks={property.marks}
                                defaultValue={(data as any)[property.value]}
                                tipFormatter={formatter}
                                />
                            </div>
                            <InputNumber
                                min={-100}
                                max={100}
                                style={{ margin: '0 40px' }}
                                formatter={value => `${value}`}
                                value={inputValue}
                                onChange={handleOnChange}
                            />
                            <Button
                                type="primary"
                                onClick={showConfirm}
                                style={{marginRight:"2px"}}
                                disabled={isDisableButton}
                            >
                                Confirm
                            </Button>
                            <Button
                                type="primary"
                                danger
                                onClick={handleClickReset}
                            >
                                Reset
                            </Button>
                        </div>
                </div>
            )}
            {isTabletOrMobile && (
                        <div className="py-3">
                        <h4 className="d-flex justify-self-flex-start">{property.label}</h4>
                                <div style={{width: "90vw", marginTop:"20px"}}>
                                <Slider
                                    min={-100}
                                    max={100}
                                    onChange={handleOnChange}
                                    value={typeof inputValue === 'number' ? inputValue : 0}
                                    marks={property.marks}
                                    defaultValue={(data as any)[property.value]}
                                    tipFormatter={formatter}
                                    />
                                </div>
                            <div style={{marginTop: "50px"}}>
                                <InputNumber
                                    min={-100}
                                    max={100}
                                    style={{ marginRight: '40px' }}
                                    formatter={value => `${value}`}
                                    value={inputValue}
                                    onChange={handleOnChange}
                                    />
                                <Button
                                    type="primary"
                                    style={{marginRight: "2px"}}
                                    onClick={showConfirm}
                                    disabled={isDisableButton}
                                    >
                                    Confirm
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    onClick={handleClickReset}
                                    >
                                    Reset
                                </Button>
                            </div>
                    </div>
            )}
        </div>
    )
}

export default ConfigSlideItem;