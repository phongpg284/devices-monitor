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

const O2Marks = {
    "0": "0",
    "10000": {
        style: {
            color: '#f50',
        },
        label: <strong>10000</strong>,
    },
    "5000": {
        style: {
            color: '#d4d106',
        },
        label: <strong>5000</strong>,
    },
}

const ThresholdColor = {
    errorThreshold: "#ff0040",
    safeThreshold: "#00d9ff",
}

export const Properties = [
    {
        label: "Nồng độ O2 trong nước (μg)",
        value: "o2Gas",
        marks: O2Marks,
        maxValue: 10000,
        minValue: 0,
        safeThresholeType: "higher",
        thresholdColor: ThresholdColor,
    },
    {
        label: "Độ pH",
        value: "pH",
        marks: Marks,
        maxValue: 100,
        minValue: 0,
        safeThresholeType: "lower",
        thresholdColor: ThresholdColor,
    },
    {
        label: "Nhiệt độ nước (°C)",
        value: "temperature",
        marks: Marks,
        maxValue: 100,
        minValue: 0,
        safeThresholeType: "lower",
        thresholdColor: ThresholdColor,
    },
]
