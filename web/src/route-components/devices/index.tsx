import "./devices.scss"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import { useContext, useEffect, useState } from "react";
import { DeviceContext } from "../../App";
import paginationFactory from "react-bootstrap-table2-paginator";
import { dataProps } from "../../components/map";

const DeviceRoute = () => {
    const { deviceState } = useContext(DeviceContext);
    const [ data, setData ] = useState([]);
    
    useEffect(() => {
        const tableData = deviceState.data?.map((device: dataProps, index: number) => {
            return {
                ...device,
                cordinate: `${device.lat[0]},${device.long[0]}`,
                id: index,
                humidity: device.humidity.data[0],
                temperature: device.temperature.data[0],
                coGas: device.coGas.data[0],
                dust: device.dust.data[0],
                soilHumid: device.soilHumid.data[0],
                rain: device.rain? "Có" : "Không",
                // lastUpdated: new Date(device.updateTime[0]).toString()
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
        headerStyle: { width: '80px'},
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
        headerStyle: { width: '180px' }
    }, {
        dataField: 'temperature',
        text: 'Nhiệt độ (°C)',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'humidity',
        text: 'Độ ẩm (%)',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'rain',
        text: 'Mưa',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'dust',
        text: 'Độ bụi (mg/m3)',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'coGas',
        text: 'Nồng độ CO (ppm)',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'soilHumid',
        text: 'Độ ẩm đất (%)',
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'lastUpdated',
        text: 'Cập nhật lần cuối',
        sort: true,
        filter: textFilter(),
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