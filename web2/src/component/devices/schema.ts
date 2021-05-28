import { gql } from "@apollo/client";

export const ENVIRONMENT_FEEDING_UNIT = gql`
    fragment EnvironmentFeedingUnit on EnvironmentFeedingUnit {
        data
        threshold
        updateTime
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
            footCan
            footTray
            fan
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
            footCan
            footTray
            fan
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
            footCan
            footTray
            fan
        }
    }
`;