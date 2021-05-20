import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./App.css";
import Chart from "./components/charts";
import DeviceList, { fakeData } from "./components/devices";
import Header from "./components/header";
import Map from "./components/map";
import Statistic from "./components/statistic";

function App() {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    cache: new InMemoryCache(),
  });
  
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <div className="vh-100 mvw-100 m-0 flex-column flex no-wrap">
          <main className="flex-grow">
            <Header />
          </main>
          <div className="main-contain d-flex justify-content-flex-start">
            <div className="flex-grow-1">
              <Chart />
            </div>
            <div className="flex-grow-2 pt-1">
              <Statistic></Statistic>
              <Map 
                defaultCenter={{lat: 21.04, lng: 105.83}}
                defaultZoom={15}
                apiKey="AIzaSyDumeWrTMi-7xbY7uRRupj3zMsTCaro8WQ"
                data={fakeData}
              />
            </div>
            <div className ="flex-grow-1">
              <DeviceList />
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
