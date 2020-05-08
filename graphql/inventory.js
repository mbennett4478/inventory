import gql from 'graphql-tag';

export const GET_INVENTORIES = gql`
    {
        containers {
            id
            items {
                containerId
                item {
                id
                name
                description
                }
                quantity
            }
            name
        }
    }
`; 

export const ADD_INVENTORY = gql`
    mutation AddContainer($name: String!) {
        createContainer(name: $name) {
            id
            items {
                item {
                    id
                    name
                    description
                }
                quantity
            }
            name
        }
    }
`;