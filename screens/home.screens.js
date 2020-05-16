import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ADD_INVENTORY, GET_INVENTORIES, update, onComplete, onError } from '../graphql/inventory';
import { Appbar,  withTheme, FAB, ActivityIndicator } from 'react-native-paper';
import HomeList from '../components/home-list.components';
import CreateEditModal from '../components/create-edit-modal.components';

function HomeScreen({ navigation, theme }) {
    const { loading, error, data } = useQuery(GET_INVENTORIES);
    const [{ creating, createOrEdit, visible, name, errorCreating }, setState] = React.useState({
        creating: false,
        createOrEdit: 'create',
        visible: false,
        name: '',
        errorCreating: null,
    });
    const completeCallback = () => setState(state => ({ ...state, visible: false, creating: false, name: '' }));
    const errorCallback = (error) => {
        console.log(error);
        setState(state => ({ ...state, creating: false, errorCreating: error.message }));
    };
    const [createInventory] = useMutation(ADD_INVENTORY, { 
        update,
        onCompleted: onComplete(completeCallback),
        onError: onError(errorCallback),
    });

    const dismiss = () => setState(state => ({ ...state, name: '', visible: false }));
    const onFABClick = () => setState(state => ({ ...state, name: '', createOrEdit: 'create', visible: true }));
    const addInventory = () => {
        setState(state => ({ ...state, createOrEdit: 'create', creating: true }));
        createInventory({ variables: { name }});
    };
    const editInventory = () => {
        setState(state => ({ ...state, creating: true }));
        setTimeout(() => {
            setState(state => ({ ...state, name: '', creating: false, visible: false }));
        }, 1000);
    }
    const changeName = (text) => setState(state => ({ ...state, name: text }));
    const onEditPressed = (item) => setState(state => ({ ...state, createOrEdit: 'edit', name: item.name, visible: true }));
    const gotoInventory = inventory => () => navigation.push('Inventory', { inventory });

    const onDeletePressed =  (item) => {
        // Delete
        console.log("delete");
    }

    if (error) return <Text>Error! {error.message}</Text>;

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title='Inventories'/>
            </Appbar.Header>
            {loading ? (
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
                    />
                    <CreateEditModal 
                        visible={visible}
                        type={createOrEdit}
                        onCreate={addInventory}
                        onEdit={editInventory}
                        onDismiss={dismiss}
                        value={name}
                        onChangeText={changeName}
                        loading={creating}
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
        margin: 16,
        right: 0,
        bottom: 0,
    },
});


export default withTheme(HomeScreen);