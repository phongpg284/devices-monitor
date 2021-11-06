import "./App.css";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_FEEDING_DEVICES } from "./component/Devices/schema";
import Header from "./component/Header";
import ConfigComponent from "./component/ConfigComponent";
import Statistics from "./component/Statistics";

export const DeviceContext = createContext({
  deviceState: {
    data: [],
  },
  setDeviceState: (() => {}) as any,
});

function App() {
  const { data } = useQuery(GET_FEEDING_DEVICES, {
    pollInterval: 10000,
  });
  const [deviceState, setDeviceState] = useState({data: []});
  
  useEffect(() => {
    if(data)
    setDeviceState({
      data: data?.getFeedingDevices
    })
  }, [data]);
  
  return (
    <DeviceContext.Provider value={{ deviceState, setDeviceState}}>
      <div className="App">
        <div className="vh-100 mvw-100 m-0 flex-column flex no-wrap">
          <main className="flex-grow">
            <HashRouter>
              <Header />
              <Switch>
                <Route path="/devices">
                  <Statistics />
                </Route>
                <Route path="/statistics">
                  <Statistics />
                </Route>
                <Route path="/">
                  <ConfigComponent/>
                </Route>
              </Switch>
            </HashRouter>
          </main>
        </div>
      </div>
    </DeviceContext.Provider>
  );
}

export default App;
