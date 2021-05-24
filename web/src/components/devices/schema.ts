import { gql } from "@apollo/client";

export const GET_DEVICES = gql`
    query GetDevices {
        getDevices {
            _id
            name
            lat
            long
            humidity
            temperature
            rain
            dust
            coGas
            soilHumid
            cylinder
            alert
            lastUpdated
        }
    }
`;

export const CREATE_DEVICE = gql`
    mutation CreateDevice($input: DeviceCreateInput) {
        createDevice(input: $input) {
            _id
            name
            lat
            long
            humidity
            temperature
            rain
            coGas
            soilHumid
            cylinder
            alert
            lastUpdated
        }
    }
`;

export const UPDATE_DEVICE = gql`
    mutation UpdateDevice($input: DeviceUpdateInput) {
        updateDevice(input: $input) {
            _id
            name
            lat
            long
            humidity
            temperature
            rain
            coGas
            soilHumid
            cylinder
            alert
            lastUpdated
        }
    }
`;