import { gql } from "@apollo/client";

export const GET_DEVICES = gql`
    query GetDevices {
        getDevices {
            _id
            name
            lat
            lng
            humidity
            rain
            dust
            coGas
            soilHumid
        }
    }
`;