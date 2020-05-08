import * as React from 'react';
import { FlatList } from 'react-native';
import { List, IconButton, Menu, withTheme, Divider } from 'react-native-paper';
import { set } from 'react-native-reanimated';

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
            anchor={<IconButton {...props} icon='dots-vertical' onPress={openMenu(setVisible)} />}
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
            description={`${item.items.length} items`}
            left={left}
            right={right}
            theme={theme}
            onPress={onItemClick(item)}
        />
    );
}

function HomeList({ data, theme, onItemClick }) {
    function renderItem({ item, index }) {
        return (
            <RenderItem 
                item={item}
                index={index}
                theme={theme}
                onItemClick={onItemClick}
            />
        );
    }

    return (
        <>
            {data.length > 0 && 
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    theme={theme}
                    removeClippedSubviews={true}
                    initialNumToRender={13}
                    maxToRenderPerBatch={1}
                />
            }
        </>
    );
}

export default withTheme(HomeList);