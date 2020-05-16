import * as React from 'react';
import { View, Text } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';
import ItemList from '../components/item-list.components';

function InventoryScreen({ navigation, theme, route }) {
    const { inventory } = route.params;

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title={inventory.name}/>
            </Appbar.Header>
            <ItemList data={inventory.items} />
        </>
    );
}

export default withTheme(InventoryScreen);