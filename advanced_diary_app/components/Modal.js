import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useResponsiveContext } from "../context/ResponsiveContext";

export default function ModalToFill({ visible, onClose, children }) {

    const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();
    const isLandscape = width > height

    const styles = StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(3, 3, 3, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: isLandscape? '75%' : '90%',
        backgroundColor: "#0e6f03c5",
        borderRadius: moderateScale(15),
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(12),
        borderWidth: moderateScale(1),
      },
      closeButton: {
        marginBottom: moderateScale(6),
        alignSelf: 'flex-end',
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(6),
        backgroundColor: '#1a1818',
        borderRadius: moderateScale(10),
      },
    });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ color: 'white' }}>X</Text>
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
}
