import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ADD_INVENTORY, GET_INVENTORIES, DELETE_INVENTORY } from '../graphql/inventory';
import { Appbar,  withTheme, FAB, ActivityIndicator } from 'react-native-paper';
import HomeList from '../components/home-list.components';
import CreateEditModal from '../components/create-edit-modal.components';

function HomeScreen({ navigation, theme }) {
    const { loading: loadingGet, error: errorGet, data } = useQuery(GET_INVENTORIES);
    const [{ createOrEdit, visible, name, errorCreating, itemSelectedId }, setState] = React.useState({
        createOrEdit: 'create',
        visible: false,
        name: '',
        errorCreating: null,
        itemSelectedId: null, 
    });

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

    const onDeletePressed = async (item) => {
        try {
            setState({ itemSelectedId: item.id });
            await deleteInventory({ variables: { id: item.id }});
            setState({ itemSelectedId: null });
        } catch (err) {
            console.log(errorDelete);
        }
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