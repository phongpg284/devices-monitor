import "./devices.scss"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import { useContext, useEffect, useState } from "react";
import { DeviceContext } from "../../App";
import paginationFactory from "react-bootstrap-table2-paginator";

const DeviceRoute = () => {
    const { deviceState, setDeviceState } = useContext(DeviceContext);
    const [ data, setData ] = useState([]);
    
    useEffect(() => {
        const tableData =deviceState.data?.map((device: any, index: number) => {
            return {
                ...device,
                cordinate: `${device.lat},${device.lng}`,
                id: index,
                rain: device.rain? "Có" : "Không",
            }
        }) 
        if(tableData)
        setData(tableData as any);
    },[deviceState]);
    
    
    const columns = [{
        dataField: 'id',
        text: 'ID',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'name',
        text: 'Tên thiết bị',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'cordinate',
        text: 'Toạ độ',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'temperature',
        text: 'Nhiệt dộ',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'humidity',
        text: 'Độ ẩm',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'rain',
        text: 'Mưa',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'dust',
        text: 'Độ bụi',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'coGas',
        text: 'Nồng độ CO',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'soilHumid',
        text: 'Độ ẩm đất',
        sort: true,
        filter: textFilter(),
        // formatExtraData: {
        //     currentLength: data?.length
        // }
    }];
    return (
        <div className="p-2">
            <BootstrapTable 
                keyField="id" 
                data={data} 
                columns={columns}
                rowStyle={{}}
                noDataIndication={ "Table is empty" }
                striped
                hover
                condensed
                filter={filterFactory()}
                pagination= {paginationFactory({})}
            >
            </BootstrapTable>
        </div>
    )
}

export default DeviceRoute;