import { gql } from "@apollo/client";

export const ENVIRONMENT_FEEDING_UNIT = gql`
    fragment EnvironmentFeedingUnit on environmentFeedingUnit {
        data
        threshold
    }
`;

export const GET_FEEDING_DEVICES = gql`
    ${ENVIRONMENT_FEEDING_UNIT}
    query getFeedingDevices {
        getFeedingDevices {
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
            foodCan
            foodTray
            fan
            updateTime
        }
    }
`;

export const CREATE_FEEDING_DEVICE = gql`
    mutation CreateFeedingDevice($input: FeedingDeviceCreateInput) {
        createFeedingDevice(input: $input) {
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
            foodCan
            foodTray
            fan
            updateTime
        }
    }
`;

export const UPDATE_FEEDING_DEVICE = gql`
    mutation UpdateFeedingDevice($input: FeedingDeviceUpdateInput) {
        updateFeedingDevice(input: $input) {
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
            foodCan
            foodTray
            fan
            updateTime
        }
    }
`;