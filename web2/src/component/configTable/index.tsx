import { Device } from "../devices";
import SlideItem from "./slideItem";

const Properties = [
    {
        label: "Nhiệt độ nước (°C)",
        value: "temperature",
    },
    {
        label: "Nồng độ O2 trong nước (ppm)",
        value: "o2Gas",
    },
    {
        label: "Độ pH",
        value: "pH",
    }
];

interface configTableProps {
    data: Device;
}

const ConfigTable = (props: configTableProps) => {
    const { data } = props;
    return (
        <div>
            {Properties.map(property => (
                <SlideItem data={data} property={property}/>    
            ))}
        </div>
    )
}

export default ConfigTable;