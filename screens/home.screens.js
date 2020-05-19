import * as React from 'react';
import { Text, StyleSheet, View, InteractionManager } from 'react-native';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { ADD_INVENTORY, GET_INVENTORIES, DELETE_INVENTORY } from '../graphql/inventory';
import { Appbar,  withTheme, FAB, ActivityIndicator, Snackbar } from 'react-native-paper';
import HomeList from '../components/home-list.components';
import CreateEditModal from '../components/create-edit-modal.components';

function HomeScreen({ navigation, theme }) {
    const { loading: loadingGet, error: errorGet, data } = useQuery(GET_INVENTORIES);
    const client = useApolloClient();
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [{ createOrEdit, visible, name, errorCreating, itemSelectedId, itemToBeDeleted, itemToBeDeletedIndex }, setState] = React.useState({
        createOrEdit: 'create',
        visible: false,
        name: '',
        errorCreating: null,
        itemSelectedId: null, 
        itemToBeDeleted: null,
        itemToBeDeletedIndex: null,
    });
    const itemToBeDeletedRef = React.useRef(itemToBeDeleted);
    itemToBeDeletedRef.current = itemToBeDeleted;

    const [createInventory, { loading: loadingCreate , error: errorCreate }] = useMutation(ADD_INVENTORY, { 
        update(cache, { data: { createContainer }}) {
            const { containers } = cache.readQuery({ query: GET_INVENTORIES });
            const combined = containers.concat([createContainer]);
            cache.writeQuery({
                query: GET_INVENTORIES,
                data: { containers: combined },
            });
        },
    });

    const [deleteInventory, { loading: loadingDelete, error: errorDelete }] = useMutation(DELETE_INVENTORY, {
        update(cache, { data: { deleteContainer } }) {
            const { containers } = cache.readQuery({ query: GET_INVENTORIES });
            const result = containers.filter((container) => deleteContainer.id !== container.id);
            cache.writeQuery({
                query: GET_INVENTORIES,
                data: { containers: result },
            });
        },
    });

    const dismiss = () => setState(state => ({ ...state, name: '', visible: false }));
    const onFABClick = () => setState(state => ({ ...state, name: '', createOrEdit: 'create', visible: true }));

    const addInventory = async () => {
        try {
            setState(state => ({ ...state, createOrEdit: 'create' }));
            await createInventory({ variables: { name } });
            dismiss();
        } catch (err) {
            console.log(errorCreate);
        } 
    };

    const editInventory = () => {
        setTimeout(() => {
            setState(state => ({ ...state, name: '', visible: false }));
        }, 1000);
    }
    const changeName = (text) => setState(state => ({ ...state, name: text }));
    const onEditPressed = (item) => setState(state => ({ ...state, createOrEdit: 'edit', name: item.name, visible: true }));
    const gotoInventory = inventory => () => navigation.push('Inventory', { inventory });

    const onDeletePressed = (item, index) => {
    // const onDeletePressed = async (item, index) => {
        try {
            setState(state => ({ ...state, itemSelectedId: item.id, itemToBeDeletedIndex: index }));
            const { containers } = client.readQuery({ query: GET_INVENTORIES });
            // await deleteInventory({ variables: { id: item.id }});
            const combinded =  containers.filter((container) => item.id !== container.id);
            client.writeQuery({ query: GET_INVENTORIES, data: { containers: combinded } });
            setState(state => ({ ...state, itemSelectedId: null, itemToBeDeleted: item }));
            setSnackbarVisible(true);
            setTimeout(function () {
                if (itemToBeDeletedRef.current) {
                    const found = data.containers.find((c) => c.id == itemToBeDeletedRef.current.id);
                    console.log(`found: ${found}`);
                } else {
                    console.log('nope');
                }
            }, 8000);
        } catch (err) {
            console.log(errorDelete);
        }
    };
    
    const persistDelete = async () => {
        try {
            await deleteInventory({ variables: { id: itemToBeDeleted.id } });
        } catch (err) {
            console.log(err.message);
        }
    };

    const wtf = () => {
        setSnackbarVisible(false);
    };

    if (errorGet) return <Text>Error! {errorGet.message}</Text>;

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title='Inventories'/>
            </Appbar.Header>
            {loadingGet ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator animating={true} size='large' /> 
                </View>
            ) : (
                <>
                    <HomeList 
                        data={data.containers} 
                        onItemClick={gotoInventory} 
                        onEdit={onEditPressed}
                        onDelete={onDeletePressed}
                        menuLoadingDelete={loadingDelete}
                        itemSelectedId={itemSelectedId}
                    />
                    <CreateEditModal 
                        visible={visible}
                        type={createOrEdit}
                        onCreate={addInventory}
                        onEdit={editInventory}
                        onDismiss={dismiss}
                        value={name}
                        onChangeText={changeName}
                        loading={loadingCreate}
                    />
                    <FAB 
                        style={styles.fab}
                        icon="plus"
                        color={theme.colors.text}
                        onPress={onFABClick}
                    />
                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={wtf}
                        action={{
                            label: 'Undo',
                            onPress: () => {
                                const { containers } = client.readQuery({ query: GET_INVENTORIES });
                                const combined = [
                                    ...containers.slice(0, itemToBeDeletedIndex),
                                    itemToBeDeleted,
                                    ...containers.slice(itemToBeDeletedIndex),
                                ];

                                client.writeQuery({ 
                                    query: GET_INVENTORIES,
                                    data: { containers: combined },
                                });
                                setState(state => ({ ...state, itemToBeDeleted: null }));
                            },
                        }}
                        theme={theme}
                    >
                        <Text>Taco</Text>
                    </Snackbar>
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 32,
        right: 0,
        bottom: 0,
    },
});


export default withTheme(HomeScreen);