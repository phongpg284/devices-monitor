import { Card } from "react-bootstrap"
import "./counterHeader.scss"
const CounterHeader = (props: any) => {
    const { data } = props;
    const totalDevices = data?.data?.length;
    const alertDevices = data?.data?.filter((device: any) => device?.alert === true).length;
    const workingDevices = (totalDevices && alertDevices)? totalDevices - alertDevices : 0;

    return (
        <div className="d-flex flex-row justify-content-center statistic-header">
            <Card className="statistic-item px-2" id="total-counter">
                <Card.Title className="statistic-title">
                    Total Devices
                </Card.Title>
                <Card.Text className="statistic-counter">{totalDevices}</Card.Text>
            </Card>
            <Card className="statistic-item px-2" id="working-counter">
                <Card.Title className="statistic-title">
                    Working Devices
                </Card.Title>
                <Card.Text className="statistic-counter">{workingDevices}</Card.Text>
            </Card>
            <Card className="statistic-item px-2" id="alert-counter">
                <Card.Title className="statistic-title">
                    Alert Devices
                </Card.Title>
                <Card.Text className="statistic-counter">{alertDevices}</Card.Text>
            </Card>
        </div>
    )
}

export default CounterHeader;