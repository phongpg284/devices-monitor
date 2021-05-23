import { Card } from "react-bootstrap"
import "./statistic.scss"
const Statistic = () => {
    return (
        <div className="d-flex flex-row justify-content-center statistic-header">
            <Card className="statistic-item px-2">
                <Card.Title className="statistic-title">
                    Total Devices
                </Card.Title>
                <Card.Text className="statistic-counter">{5}</Card.Text>
            </Card>
            <Card className="statistic-item px-2">
                <Card.Title className="statistic-title">
                    Working Devices
                </Card.Title>
                <Card.Text className="statistic-counter">{10}</Card.Text>
            </Card>
            <Card className="statistic-item px-2">
                <Card.Title className="statistic-title">
                    Offline Devices
                </Card.Title>
                <Card.Text className="statistic-counter">{5}</Card.Text>
            </Card>
        </div>
    )
}

export default Statistic;