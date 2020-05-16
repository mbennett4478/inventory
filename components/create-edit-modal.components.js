import * as React from 'react';
import { withTheme, Portal, Modal, Card, TextInput, Button } from 'react-native-paper';

function CreateEditModal({ visible, type, onCreate, onEdit, onDismiss, value, onChangeText, loading }) {
    const [changed, setChanged] = React.useState(type === 'create' && !!value);
    const label = type === 'edit' ? 'Edit inventory' : 'Create a new inventory';
    const buttonText = type === 'edit' ? 'Edit' : 'Create';
    const onChange = (text) => {
        if (type !== 'edit') {
            setChanged((type === 'create' && !!text));
        } 
        onChangeText(text);
    };

    const onAdd = () => {
        setChanged(false);
        if (type === 'edit') {
            onEdit();
        } else {
            onCreate();
        }
    }

    const onClose = () => {
        setChanged(false);
        onDismiss();
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose}>
                <Card style={styles.modal}>
                    <Card.Content>
                        <TextInput label={label} value={value} onChangeText={onChange} mode="outlined" />
                    </Card.Content>
                    <Card.Actions style={styles.actions}>
                        <Button 
                            disabled={!(type === 'edit' || changed) || loading}
                            icon="plus"
                            mode="contained"
                            loading={loading}
                            style={styles.createEditButton}
                            onPress={onAdd}
                        >
                            {buttonText}
                        </Button>
                        <Button
                            icon="close"
                            mode="contained"
                            color="#D62828"
                            style={styles.createEditButton}
                            onPress={onClose}
                        >
                            Cancel
                        </Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
}

const styles = {
    modal: {
        marginHorizontal: 24,
    },
    actions: {
        justifyContent: 'space-between',
    },
    createEditButton: {
        marginHorizontal: 8,
        padding: 10,
    }
};

export default withTheme(CreateEditModal);