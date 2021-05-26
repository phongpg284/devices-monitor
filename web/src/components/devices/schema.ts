import { gql } from "@apollo/client";

export const ENVIRONMENT_UNIT = gql`
    fragment EnvironmentUnit on environmentUnit {
        data
        threshold
    }
`;

export const GET_BORDER_DEVICES = gql`
    ${ENVIRONMENT_UNIT}
    query GetBorderDevices {
        getBorderDevices {
            _id
            name 
            lat
            long
            humidity {
                ...EnvironmentUnit
            }
            temperature {
                ...EnvironmentUnit
            }
            rain 
            dust {
                ...EnvironmentUnit
            }
            coGas {
                ...EnvironmentUnit
            }
            soilHumid {
                ...EnvironmentUnit
            }
            cylinder
            alert
            updateTime
            locationUpdateTime
        }
    }
`;

export const CREATE_BORDER_DEVICE = gql`
    mutation CreateBorderDevice($input: BorderDeviceCreateInput) {
        createBorderDevice(input: $input) {
            _id
            name 
            lat
            long
            humidity {
                ...EnvironmentUnit
            }
            temperature {
                ...EnvironmentUnit
            }
            rain 
            dust {
                ...EnvironmentUnit
            }
            coGas {
                ...EnvironmentUnit
            }
            soilHumid {
                ...EnvironmentUnit
            }
            cylinder
            alert
            updateTime
            locationUpdateTime
        }
    }
`;

export const UPDATE_BORDER_DEVICE = gql`
    mutation UpdateBorderDevice($input: DeviceUpdateInput) {
        updateBorderDevice(input: $input) {
            _id
            name 
            lat
            long
            humidity {
                ...EnvironmentUnit
            }
            temperature {
                ...EnvironmentUnit
            }
            rain 
            dust {
                ...EnvironmentUnit
            }
            coGas {
                ...EnvironmentUnit
            }
            soilHumid {
                ...EnvironmentUnit
            }
            cylinder
            alert
            updateTime
            locationUpdateTime
        }
    }
`;