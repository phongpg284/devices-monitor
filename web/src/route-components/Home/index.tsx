import { useContext } from "react"
import { DeviceContext } from "../../App"
import DeviceList from "../../components/DevicesList"
import Map from "../../components/Map"
import Counter from "../../components/CounterHeader"
import "./home.scss"

const mapKey = process.env.REACT_APP_MAP_API_KEY;

const Home = () => {
    const { deviceState } = useContext(DeviceContext);
    return (
        <div className="main-contain d-flex justify-content-flex-start">
            {/* <div className="flex-grow-1">
              <Chart />
            </div> */}
            <div className="flex-grow-1 pt-1 middle-content d-flex flex-column justify-content-flex-start">
              <Counter data={deviceState}/>
              <Map
                defaultCenter={{ lat: 21.04, lng: 105.83 }}
                defaultZoom={15}
                apiKey={mapKey!}
                data={deviceState}
              />
            </div>
            <div className="flex-grow-1 right-content">
              <DeviceList />
            </div>
          </div>
    )
}

export default Home;