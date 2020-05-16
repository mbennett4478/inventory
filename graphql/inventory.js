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

export function update(cache, { data: { createContainer } }) {
    const { containers } = cache.readQuery({ query: GET_INVENTORIES });
    const combined = containers.concat([createContainer]);
    cache.writeQuery({
        query: GET_INVENTORIES,
        data: { containers: combined },
    });
}

export function onComplete(cb) {
    return function () {
        cb();
    }
}

export function onError(cb) {
    return function (error) {
        cb(error);
    }
}