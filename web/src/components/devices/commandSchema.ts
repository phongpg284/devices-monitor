import { gql } from "@apollo/client";

export const ENVIRONMENT_UNIT = gql`
    fragment EnvironmentUnit on EnvironmentUnit {
        data
        threshold
        updateTime
    }
`;

export const SEND_ALERT = gql`
    ${ENVIRONMENT_UNIT}
    mutation SendAlert($id: String!) {
        sendAlert(id: $id) {
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
            rain {
                data
                updateTime
            } 
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
            locationUpdateTime
        }
    }
`;

export const UPDATE_BORDER_CYLINDER_STATUS = gql`
    ${ENVIRONMENT_UNIT}
    mutation UpdateBorderCylinderStatus($id: String!, $status: String!) {
        updateBorderCylinderStatus(id: $id, status: $status) {
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
            rain {
                data
                updateTime
            } 
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
            locationUpdateTime
        }
    }
`;

export const SET_BORDER_THRESHOLD = gql`
    ${ENVIRONMENT_UNIT}
    mutation SetBorderThreshold($id: String!, $property: String! $value: Float!) {
        setBorderThreshold(id: $id, property: $property, value: $value) {
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
            rain {
                data
                updateTime
            } 
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
            locationUpdateTime
        }
    }
`;