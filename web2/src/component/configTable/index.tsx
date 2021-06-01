import { DocumentNode } from "graphql";
import { Device } from "../devices";
import ConfigSlideItem from "../ConfigSlide";

export interface Property {
    label: string,
    value: string,
    marks?: any,
    apiKey: DocumentNode,
}

interface ConfigTableProps {
    data: Device;
    properties: Property[];
}

const ConfigTable = (props: ConfigTableProps) => {
    const { data, properties } = props;
    return (
        <>
            {properties.map(property => (
                <ConfigSlideItem data={data} property={property}/>    
            ))}
        </>
    )
}

export default ConfigTable;