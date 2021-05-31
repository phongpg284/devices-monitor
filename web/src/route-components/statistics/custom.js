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
    },
    {
        label: "Độ ẩm (%)",
        value: "humidity",
        marks: Marks,
        thresholdColor: ThresholdColor,
    },
    {
        label: "Mưa",
        value: "rain",
        marks: Marks,
        thresholdColor: ThresholdColor,
    },
    {
        label: "Độ bụi (mg/m3)",
        value: "dust",
        marks: Marks,
        thresholdColor: ThresholdColor,
    },
    {
        label: "Nồng độ CO (ppm)",
        value: "coGas",
        marks: Marks,
        thresholdColor: ThresholdColor,
    },
    {
        label: "Độ ẩm đất (%)",
        value: "soilHumid",
        marks: Marks,
        thresholdColor: ThresholdColor,
    },
]

