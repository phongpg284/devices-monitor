const Marks = {
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

const ThresholdColor = {
    errorThreshold: "#ff0040",
    safeThreshold: "#00d9ff",
}

export const Properties = [
    {
        label: "Nồng độ O2 trong nước (mg/m3)",
        value: "o2Gas",
        marks: Marks,
        thresholdColor: ThresholdColor,
    },
    {
        label: "Độ pH",
        value: "pH",
        marks: Marks,
        thresholdColor: ThresholdColor,
    },
    {
        label: "Nhiệt độ nước (°C)",
        value: "temperature",
        marks: Marks,
        thresholdColor: ThresholdColor,
    },
]
