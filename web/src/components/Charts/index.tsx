import "./charts.scss";
import { Card } from "react-bootstrap";
const Chart = () => {
    return (
        <>
            <Card className="update-timer m-2">
                <Card.Title className="update-timer-title px-2 mx-1">
                    Last Updated at (M/D/YYYY)
                </Card.Title>
                <Card.Text className="update-timer-text">
                    5/19/2021, 12:20pm
                </Card.Text>
            </Card>
        </>
    )
}

export default Chart;