import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme as RNDarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DefaultTheme, DarkTheme, Provider as PaperProvider, Surface } from 'react-native-paper';
import ApolloClient from 'apollo-boost';
import HomeScreen from './screens/home.screens';
import InventoryScreen from './screens/inventory.screens';


const client = new ApolloClient({ 
  uri: 'http://bsmple.ngrok.io',
  cache: new InMemoryCache(), 
});

const DarkT = {
  ...DarkTheme,
  colors: { 
    ...DarkTheme.colors,
    background: "#264653",
    surface: "#264653",
    primary: "#2A9D8F",
    accent: "#F4A261",
    notification: "#E9C46A",
  },
};

const { Navigator, Screen } = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={DarkT}>
      <ApolloProvider client={client}>
        <NavigationContainer theme={DarkT}>
          <Navigator headerMode='none'>
            <Screen name="Home" component={HomeScreen} />
            <Screen name="Inventory" component={InventoryScreen} />
          </Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
