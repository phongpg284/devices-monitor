import "./graph.scss"
import { Bar } from "react-chartjs-2";
interface GraphProps {
    data: any;
    startDate: Date;
    endDate: Date;
    property: {
        label: string,
        value: string,
        marks: any
        thresholdColor: {
            errorThreshold: string,
            safeThreshold: string,
        }
        graphType: string,
    };
}

const Graph = (props: GraphProps) => {
    const { data, startDate, endDate, property } = props;
    let showData: any[] = []
    let showLabels: any[] = [];
    let showColors: any[] = [];

    if(data && startDate && endDate) {
        data[property.value].updateTime.forEach((time: any, index: number) => {
            if(time <= new Date(endDate).toISOString() && time >= new Date(startDate).toISOString()) {
                showLabels.push(new Date(time).toLocaleString())
                showData.push(data[property.value].data[index]);
                showColors.push(data[property.value].data[index] > data[property.value].threshold ? property.thresholdColor.errorThreshold: property.thresholdColor.safeThreshold);
            }
        });
    }

    const state = {
        labels: showLabels,
        datasets: [
            {
                // lineTension: 0.5,
                // type: property.graphType,
                label: property.label,
                backgroundColor: showColors,
                borderColor: '#535252',
                borderWidth: 1,
                data: showData,
            }
        ]
    }
    
    return (
        <div className="graph">
            <Bar
                height={300}
                width={350}
                data={state}
                options={{
                    plugins: {
                        title:{
                            display:true,
                            text: `Biểu đồ ${property.label}`,
                            font: {
                                size: 30
                            },
                            padding: 20
                        },
                        legend:{
                            display: true,
                            position:'bottom',
                        },               
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            min: 0,
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    // scales: {
                    //     y: {
                    //         title: "jfjfjf",
                    //         ticks: {
                    //             // Include a dollar sign in the ticks
                    //             callback: function(value: any) {
                    //                 return '$' + value;
                    //             }
                    //         }
                    //     }
                    // }
                }}
                type="bar"
            />
        </div>
    )
}

export default Graph;