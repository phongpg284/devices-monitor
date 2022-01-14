export const Marks = {
    "0": "0",
    "100": {
        style: {
            color: '#f50',
        },
        label: <strong>100</strong>,
    },
    "50": {
        style: {
            color: '#d4d106',
        },
        label: <strong>50</strong>,
    },
}

export const ThresholdColor = {
    errorThreshold: "#ff0040",
    safeThreshold: "#00d9ff",
}

export const Properties = [
    {
        label: "Nhiệt độ (°C)",
        value: "temperature",
        marks: Marks,
        thresholdColor: ThresholdColor,
        graphType: "bar"
    },
    {
        label: "Độ ẩm (%)",
        value: "humidity",
        marks: Marks,
        thresholdColor: ThresholdColor,
        graphType: "bar",
    },
    {
        label: "Mưa",
        value: "rain",
        marks: Marks,
        thresholdColor: ThresholdColor,
        graphType: "line",
    },
    {
        label: "Độ bụi (AQI)",
        value: "dust",
        marks: Marks,
        thresholdColor: ThresholdColor,
        graphType: "bar",
    },
    {
        label: "Nồng độ CO (AQI)",
        value: "coGas",
        marks: Marks,
        thresholdColor: ThresholdColor,
        graphType: "bar",
    },
    {
        label: "Độ ẩm đất (%)",
        value: "soilHumid",
        marks: Marks,
        thresholdColor: ThresholdColor,
        graphType: "bar",
    },
]

