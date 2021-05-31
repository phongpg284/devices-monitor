import { Bar } from "react-chartjs-2";

interface BaseGraphProps {
    data: any;
    startDate: Date;
    endDate: Date;
    property: {
        label: string,
        value: string,
        marks?: any,
        thresholdColor: {
            errorThreshold: string,
            safeThreshold: string,
        }
    };
}

const BaseGraph = (props: BaseGraphProps) => {
    const { data, startDate, endDate, property } = props;
    let showData: any[] = [];
    let showLabels: any[] = [];
    let showColors: any[] = [];
    
    if(data && startDate && endDate) {
        data[property.value].updateTime.forEach((time: any, index: number) => {
            if(time <= new Date(endDate).toISOString() && time >= new Date(startDate).toISOString()) {
                showLabels.push(new Date(time).toLocaleString())
                showData.push(data[property.value].data[index]);
                showColors.push(data[property.value].data[index] > data[property.value].threshold ? property.thresholdColor.errorThreshold : property.thresholdColor.safeThreshold);
            }
        });
    }

    const state = {
        labels: showLabels,
        datasets: [
            {
                // lineTension: 0.5,
                label: property.label,
                backgroundColor: showColors,
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: showData,
            }
        ]
    }
    
    return (
        <div>
            <Bar
                style={{margin: "30px"}}
                height={350}
                width={500}
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
                            display:true,
                            position:'bottom',
                        },               
                    },
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
export default BaseGraph;