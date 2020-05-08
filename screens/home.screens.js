import * as React from 'react';
import { SafeAreaView, ScrollView, Text, FlatList, StyleSheet, View } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ADD_INVENTORY, GET_INVENTORIES } from '../graphql/inventory';
import { Appbar, List, IconButton, withTheme, FAB, Portal, Modal, TextInput, Card, Button, ActivityIndicator } from 'react-native-paper';
import HomeList from '../components/home-list.components';
import { set } from 'react-native-reanimated';

function HomeScreen({ navigation, theme }) {
    const { loading, error, data } = useQuery(GET_INVENTORIES);
    const [creating, setCreating] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [name, setName] = React.useState('');
    const [errorCreating, setErrorCreating] = React.useState(null);

    const [createInventory] = useMutation(ADD_INVENTORY, {
        update(cache, { data: { createContainer } }) {
            const { containers } = cache.readQuery({ query: GET_INVENTORIES });
            const combined = containers.concat([createContainer]);
            cache.writeQuery({
                query: GET_INVENTORIES,
                data: { containers: combined },
            });
        },
        onCompleted() {
            setVisible(false);
            setCreating(false);
            setName('');
        },
        onError(error) {
            console.log(error);
            setCreating(false);
            setErrorCreating(error.message);
        }
    });

    const dismiss = () => {
        setVisible(false);
        setName('');
    };

    const addInventory = () => {
        setCreating(true);
        createInventory({ variables: { name }});
    };

    const changeName = (text) => setName(text);

    const gotoInventory = inventory => () => {
        navigation.push('Inventory', { inventory });
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
                    <HomeList data={data.containers} onItemClick={gotoInventory} />
                    <Portal>
                        <Modal visible={visible} onDismiss={dismiss}>
                            <Card style={{marginHorizontal: 24}}>
                                <Card.Content>
                                    <TextInput label='Create a new Inventory' value={name} onChangeText={changeName} mode='outlined' />
                                </Card.Content>
                                <Card.Actions style={{justifyContent: 'space-between'}}>
                                    <Button 
                                        disabled={!name || name.length <= 0} 
                                        icon='plus' 
                                        mode='contained' 
                                        loading={creating} 
                                        style={{marginHorizontal: 8, padding: 10}} 
                                        onPress={addInventory}
                                    >
                                        Create
                                    </Button>
                                    <Button 
                                        icon='close' 
                                        mode='contained' 
                                        color="#D62828" 
                                        style={{marginHorizontal: 8, padding: 10}} 
                                        onPress={dismiss}
                                    >
                                        Cancel
                                    </Button>
                                </Card.Actions>
                            </Card>
                        </Modal>
                    </Portal>
                    <FAB 
                        style={styles.fab}
                        icon="plus"
                        color={theme.colors.text}
                        onPress={() => setVisible(true)}
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