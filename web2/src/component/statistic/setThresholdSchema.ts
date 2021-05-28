import { gql } from "@apollo/client";

export const ENVIRONMENT_FEEDING_UNIT = gql`
    fragment EnvironmentFeedingUnit on EnvironmentFeedingUnit {
        data
        threshold
        updateTime
    }
`;

export const SET_FEEDING_THRESHOLD = gql`
    ${ENVIRONMENT_FEEDING_UNIT}
    mutation SetFeedingThreshold($value: Float!, $property: String!, $id: String!) {
        setFeedingThreshold(value: $value, property: $property, id: $id) {
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

