import * as React from 'react';
import { withTheme, Portal, Modal, Card, TextInput, Button } from 'react-native-paper';

function CreateEditModal({ visible, type, onCreate, onEdit, onDismiss, value, onChangeText, loading }) {
    const [changed, setChanged] = React.useState(type === 'edit');
    const label = type === 'edit' ? 'Edit inventory' : 'Create a new inventory';
    const buttonText = type === 'edit' ? 'Edit' : 'Create';

    const onChange = (text) => {
        if (type !== 'edit') {
            setChanged(!name || name.length <= 0);
        } 
        onChangeText(text);
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss>
                <Card style={styles.modal}>
                    <Card.Content>
                        <TextInput label={label} value={value} onChangeText={onChange} mode="outlined" />
                    </Card.Content>
                    <Card.Actions style={styles.actions}>
                        <Button 
                            disabled={changed}
                            icon="plus"
                            mode="contained"
                            loading={loading}
                            style={styles.createEditButton}
                            onPress={type === 'edit' ? onEdit : onCreate}
                        >
                            {buttonText}
                        </Button>
                        <Button
                            icon="close"
                            mode="contained"
                            color="#D62828"
                            style={styles.createEditButton}
                            onPress={onDismiss}
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