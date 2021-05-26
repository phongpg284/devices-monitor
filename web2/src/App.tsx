import React, { createContext, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./component/header";
import Switch from "react-bootstrap/esm/Switch";
import { useQuery } from "@apollo/client";
import { GET_FEEDING_DEVICES } from "./component/devices/schema";
import StatisticsRoute from "./component/statistic";

export const DeviceContext = createContext({
  deviceState: {
    data: [],
  },
  setDeviceState: (() => {}) as any,
});

function App() {
  const { data } = useQuery(GET_FEEDING_DEVICES, {
    pollInterval: 1000,
  });
  const [deviceState, setDeviceState] = useState({data: []});

  useEffect(() => {
    setDeviceState(data?.getFeedingDevices);
  }, [data]);

  return (
    <DeviceContext.Provider value={{ deviceState, setDeviceState}}>
      <div className="App">
        <div className="vh-100 mvw-100 m-0 flex-column flex no-wrap">
          <main className="flex-grow">
            <BrowserRouter>
              <Header />
              <Switch>
                <Route path="/devices"></Route>
                <Route path="/statistics">
                  <StatisticsRoute />
                </Route>
                <Route path="/"></Route>
              </Switch>
            </BrowserRouter>
          </main>
        </div>
      </div>
    </DeviceContext.Provider>
  );
}

export default App;
