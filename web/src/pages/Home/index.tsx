import { useContext } from "react"
import { DeviceContext } from "../../App"
import DeviceList from "../../components/DevicesList"
import Map from "../../components/Map"
import Counter from "../../components/CounterHeader"
import "./home.scss"

const mapApiKey = process.env.REACT_APP_MAP_API_KEY;

const Home = () => {
    const { deviceState } = useContext(DeviceContext);
    return (
        <div className="main-contain d-flex flex-row flex-wrap justify-content-flex-start">
          {/* <div className="flex-grow-1">
            <Chart />
          </div> */}
          <div className="pt-1 middle-content d-flex flex-column justify-content-flex-start">
            <Counter data={deviceState}/>
            <Map
              defaultCenter={{ lat: 21.14088, lng: 105.4953 }}
              defaultZoom={15}
              apiKey={mapApiKey!}
              data={deviceState}
            />
          </div>
          <div className="right-content">
            <DeviceList />
          </div>
        </div>
    )
}

export default Home;