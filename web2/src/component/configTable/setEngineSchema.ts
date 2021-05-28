import { gql } from "@apollo/client";

export const ENVIRONMENT_FEEDING_UNIT = gql`
    fragment EnvironmentFeedingUnit on environmentFeedingUnit {
        data
        threshold
        updateTime
    }
`;

export const SET_FOOT_CAN = gql`
    ${ENVIRONMENT_FEEDING_UNIT}
    mutation SetFootCan($value: Float!, $id: String!) {
        setFootCan(value: $value, id: $id) {
            _id
            name 
            temperature {
                ...EnvironmentFeedingUnit
            }
            o2Gas {
                ...EnvironmentFeedingUnit
            }
            pH {
                ...EnvironmentFeedingUnit
            }
            footCan
            footTray
            fan
            cylinder
        }
    }
`;

export const SET_FOOT_TRAY = gql`
    ${ENVIRONMENT_FEEDING_UNIT}
    mutation SetFootTray($value: Float!, $id: String!) {
        setFootTray(value: $value, id: $id) {
            _id
            name 
            temperature {
                ...EnvironmentFeedingUnit
            }
            o2Gas {
                ...EnvironmentFeedingUnit
            }
            pH {
                ...EnvironmentFeedingUnit
            }
            footCan
            footTray
            fan
            cylinder
        }
    }
`;

export const SET_FAN = gql`
    ${ENVIRONMENT_FEEDING_UNIT}
    mutation SetFan($value: Float!, $id: String!) {
        setFan(value: $value, id: $id) {
            _id
            name 
            temperature {
                ...EnvironmentFeedingUnit
            }
            o2Gas {
                ...EnvironmentFeedingUnit
            }
            pH {
                ...EnvironmentFeedingUnit
            }
            footCan
            footTray
            fan
            cylinder
        }
    }
`;

export const UPDATE_FEEDING_CYLINDER_STATUS = gql`
    ${ENVIRONMENT_FEEDING_UNIT}
    mutation UpdateFeedingCylinderStatus($id: String!, $status: String!) {
        updateFeedingCylinderStatus(id: $id, status: $status) {
            _id
            name 
            temperature {
                ...EnvironmentFeedingUnit
            }
            o2Gas {
                ...EnvironmentFeedingUnit
            }
            pH {
                ...EnvironmentFeedingUnit
            }
            footCan
            footTray
            fan
            cylinder
        }
    }
`;
