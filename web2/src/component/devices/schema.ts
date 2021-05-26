import { gql } from "@apollo/client";

export const GET_FEEDING_DEVICES = gql`
    query GetFeedingDevices {
        getFeedingDevices {
            _id
            name
            temperature
            o2Gas
            pH
            foodCan
            foodTray
            fan
            lastUpdated
        }
    }
`;

export const CREATE_FEEDING_DEVICE = gql`
    mutation CreateFeedingDevice($input: FeedingDeviceCreateInput) {
        createFeedingDevice(input: $input) {
            _id
            name
            temperature
            o2Gas
            pH
            foodCan
            foodTray
            fan
            lastUpdated
        }
    }
`;

export const UPDATE_FEEDING_DEVICE = gql`
    mutation UpdateFeedingDevice($input: FeedingDeviceUpdateInput) {
        updateFeedingDevice(input: $input) {
            _id
            name
            temperature
            o2Gas
            pH
            foodCan
            foodTray
            fan
            lastUpdated
        }
    }
`;