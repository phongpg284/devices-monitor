import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import { GET_DEVICES } from "./components/devices/schema";
import Header from "./components/header";
import Home from "./route-components/home";
import { deviceProps } from "./components/devices/index";
import DeviceRoute from "./route-components/devices";
import StatisticsRoute from "./route-components/statistics";

export const DeviceContext = createContext({
  deviceState: {
    data: [],
    hoveredId: "",
  },
  setDeviceState: (() => {}) as any,
});

function App() {
  const { data } = useQuery(GET_DEVICES, {
    pollInterval: 1000,
  });
  const [deviceState, setDeviceState] = useState({
    data: [],
    hoveredId: "",
  });

  useEffect(() => {
    const updateData = data?.getDevices.map((device: deviceProps) => ({
      ...device,
      highlight: false,
    }));
    console.log(updateData)
    setDeviceState({
      data: updateData,
      hoveredId: "",
    });
  }, [data]);

  return (
    <DeviceContext.Provider value={{ deviceState, setDeviceState }}>
      <div className="App">
        <div className="vh-100 mvw-100 m-0 flex-column flex no-wrap">
          <main className="flex-grow">
            <BrowserRouter>
              <Header />
              <Switch>
                <Route path="/devices">
                  <DeviceRoute/>
                </Route>
                <Route path="/statistics">
                  <StatisticsRoute/>
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </BrowserRouter>
          </main>
        </div>
      </div>
    </DeviceContext.Provider>
  );
}

export default App;
