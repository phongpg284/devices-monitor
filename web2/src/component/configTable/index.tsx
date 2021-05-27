import { DocumentNode } from "graphql";
import { Device } from "../devices";
import SlideItem from "./slideItem";

export interface Property {
    label: string,
    value: string,
    marks?: any,
    apiKey: DocumentNode,
}

interface configTableProps {
    data: Device;
    properties: Property[];
}

const ConfigTable = (props: configTableProps) => {
    const { data, properties } = props;
    return (
        <div>
            {properties.map(property => (
                <SlideItem data={data} property={property}/>    
            ))}
        </div>
    )
}

export default ConfigTable;