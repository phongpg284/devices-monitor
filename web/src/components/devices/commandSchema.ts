import { gql } from "@apollo/client";

export const ENVIRONMENT_UNIT = gql`
    fragment EnvironmentUnit on environmentUnit {
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

export const CYLINDER_UP = gql`
    ${ENVIRONMENT_UNIT}
    mutation CylinerUp($id: String!) {
        cylinderUp(id: $id) {
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

export const CYLINDER_DOWN = gql`
    ${ENVIRONMENT_UNIT}
    mutation CylinerDown($id: String!) {
        cylinderDown(id: $id) {
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