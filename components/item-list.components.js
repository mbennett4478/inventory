import * as React from 'react';
import { Text, withTheme } from 'react-native-paper';
import { FlatList, View } from 'react-native';

const left = (props) => <List.Icon {...props} icon='folder' />;

const openMenu = setVisible => () => {
    setVisible(true);
}

const closeMenu = setVisible => () => {
    setVisible(false);
}

function RenderItem({ item, index, theme, onItemClick }) {
    const [visible, setVisible] = React.useState(false);

    const right = (props) => (
        <Menu 
            visible={visible}
            onDismiss={closeMenu(setVisible)}
            anchor={<IconButton 
                {...props} 
                icon='dots-vertical' 
                onPress={openMenu(setVisible)} 
            />}
        >
            <Menu.Item title='Edit' />
            <Divider />
            <Menu.Item title='Delete'/>
        </Menu>
    );

    return (
        <List.Item
            key={index}
            title={item.name}
            description={`${item.quantity} items`}
            left={left}
            right={right}
            theme={theme}
        />
    );
}

function ItemList({ data, theme }) {
    function renderItem({ item, index }) {
        return (
            <RenderItem 
                item={item}
                index={index}
                theme={theme}
            />
        );
    }

    return (
        <>
            {data.length > 0 ? (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    theme={theme}
                    removeClippedSubviews={true}
                    initialNumToRender={13}
                    maxToRenderPerBatch={1}
                />
            ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>No Items</Text>
                </View>
            )}
        </>
    );
}

export default withTheme(ItemList);