import {View, Modal, StyleSheet} from 'react-native';
import React from 'react';
import LayoutStyle from '../styles/LayoutStyle';
import Colors from '../styles/Colors';

const Overlay = ({
  visible,
  onBackdropPress,
  onRequestClose,
  onModalClose,
  ...props
}) => {
  console.log('in proess modal');
  return (
    <View style={[styles.mainModal]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}>
        <View
          onStartShouldSetResponder={onRequestClose}
          style={[styles.modalContainer]}>
          <View
            onStartShouldSetResponder={() => true}
            style={[styles.modalView]}
            {...props}
          />
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  mainModal: {
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.modalTransparent,
  },
  modalView: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, //check in Real device
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.white,
  },
});

export default Overlay;
