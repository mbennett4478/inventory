import * as React from 'react';
import { FlatList } from 'react-native';
import { List, IconButton, Menu, withTheme, Divider } from 'react-native-paper';

const left = (props) => <List.Icon {...props} icon='folder' />;

// const openMenu = setVisible => () => {
//     setVisible(true);
// }

// const closeMenu = setVisible => () => {
//     setVisible(false);
// }


function RenderItem({ item, index, theme, onItemClick, onEdit, onDelete }) {
    const [visible, setVisible] = React.useState(false);

    const toggleMenu = () => {
        setVisible(!visible);
    }

    const onEditCb = () => {
        onEdit(item);
        toggleMenu();
    }

    const onDeleteCb = () => {
        onDelete(item);
        toggleMenu();
    }

    const right = (props) => (
        <Menu 
            visible={visible}
            onDismiss={toggleMenu}
            anchor={<IconButton {...props} icon='dots-vertical' onPress={toggleMenu} />}
        >
            <Menu.Item title='Edit' onPress={onEditCb} />
            <Divider />
            <Menu.Item title='Delete' onPress={onDeleteCb} />
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

function HomeList({ data, theme, onItemClick, onEdit, onDelete }) {
    function renderItem({ item, index }) {
        return (
            <RenderItem 
                item={item}
                index={index}
                theme={theme}
                onEdit={onEdit}
                onDelete={onDelete}
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