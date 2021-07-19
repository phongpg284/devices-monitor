import { DocumentNode } from "graphql";
import { Device } from "../Devices";
import ConfigSlideItem from "../ConfigSlide";

export interface EngineProperty {
    label: string,
    value: string,
    marks?: any,
    apiKey: DocumentNode,
}

interface ConfigTableProps {
    data: Device;
    properties: EngineProperty[];
}

const ConfigTable = (props: ConfigTableProps) => {
    const { data, properties } = props;
    return (
        <div className="">
            {properties.map(property => (
                <ConfigSlideItem data={data} property={property}/>    
            ))}
        </div>
    )
}

export default ConfigTable;