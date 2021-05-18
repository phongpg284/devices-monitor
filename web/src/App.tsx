import './App.css';
import Chart from './components/charts';
import DeviceList from './components/devices';
import Header from './components/header';
import Map from './components/map';

function App() {
  return (
    <div className="App">
      <div className="vh-100 mvw-100 m-0 flex-column flex no-wrap">
        <main className="flex-grow">
          <Header/>
        </main>
        <div className="d-flex justify-content-between">
          <Chart/>
          {/* <div className="lol"> */}
            <Map />
          {/* </div> */}
          <div className="w-3px">
            <DeviceList/>

          </div>
        </div>
        {/* <div className="device-list">
        </div> */}
      </div>
    </div>
  );
}

export default App;
