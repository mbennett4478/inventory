import * as React from 'react';
import { View, Text } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';

function InventoryScreen({ navigation, theme, route }) {
    const { inventory } = route.params;

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title={inventory.name}/>
            </Appbar.Header>
            <View>
                <Text>HELLLOOOOOO</Text>
            </View>
        </>
    );
}

export default withTheme(InventoryScreen);