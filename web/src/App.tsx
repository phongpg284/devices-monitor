import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { createContext, useEffect, useState } from "react";
import "./App.css";
import Chart from "./components/charts";
import DeviceList, { fakeData } from "./components/devices";
import { GET_DEVICES } from "./components/devices/schema";
import Header from "./components/header";
import Map from "./components/map";
import { deviceProps } from "./components/map/deviceMarker";
import Statistic from "./components/statistic";
export const DeviceContext = createContext({
  deviceState: {
    data: [],
    hoveredId: "",
  },
  setDeviceState: (() => {}) as any
});

function App() {
  const { data } = useQuery(GET_DEVICES,{
    pollInterval: 1000,
  });
  const [ deviceState, setDeviceState ] = useState({
    data: [],
    hoveredId: "",
  });

  useEffect(() => {
    const updateData = data?.getDevices.map((device: deviceProps) => ({
      ...device,
      highlight: false,
    }));
    setDeviceState({
      data: updateData,
      hoveredId: "",
    });
  },[data]);
  
  return (
    <DeviceContext.Provider value = {{deviceState, setDeviceState}}>
      <div className="App">
        <div className="vh-100 mvw-100 m-0 flex-column flex no-wrap">
          <main className="flex-grow">
            <Header />
          </main>
          <div className="main-contain d-flex justify-content-flex-start">
            <div className="flex-grow-1">
              <Chart />
            </div>
            <div className="flex-grow-1 pt-1 middle-content d-flex flex-column justify-content-flex-start">
              <Statistic />
              <Map
                defaultCenter={{ lat: 21.04, lng: 105.83 }}
                defaultZoom={15}
                apiKey="AIzaSyDumeWrTMi-7xbY7uRRupj3zMsTCaro8WQ"
                data={deviceState}
              />
            </div>
            <div className="flex-grow-1">
              <DeviceList />
            </div>
          </div>
        </div>
      </div>
    </DeviceContext.Provider>
  );
}

export default App;
