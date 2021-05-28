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

export const UPDATE_CYLINDER_STATUS = gql`
    ${ENVIRONMENT_UNIT}
    mutation UpdateCylinderStatus($id: String!, $status: String!) {
        updateCylinderStatus(id: $id, status: $status) {
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